import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, truncateSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test, { after, before } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const runtime = join(root, '.harness', 'runtime', 'REQ-0003');
const require = createRequire(import.meta.url);
let DocumentService;
let PersistenceService;
let MAX_IMPORT_FILE_SIZE_BYTES;
let IPC_CHANNELS;
let registerIpcHandlers;

before(async () => {
  rmSync(runtime, { recursive: true, force: true });
  mkdirSync(runtime, { recursive: true });
  execFileSync(process.execPath, [join(root, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', 'tsconfig.node.json'], {
    cwd: root,
    stdio: 'pipe',
  });
  execFileSync(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build', '--config', 'vite.preload.config.ts'], {
    cwd: root,
    stdio: 'pipe',
  });
  ({ DocumentService, MAX_IMPORT_FILE_SIZE_BYTES } = await import(pathToFileURL(join(root, 'dist', 'services', 'document-service.js'))));
  ({ PersistenceService } = await import(pathToFileURL(join(root, 'dist', 'services', 'persistence-service.js'))));
  ({ IPC_CHANNELS } = await import(pathToFileURL(join(root, 'dist', 'shared', 'types.js'))));
  ({ registerIpcHandlers } = await import(pathToFileURL(join(root, 'dist', 'main', 'ipc-handlers.js'))));
});

after(() => rmSync(runtime, { recursive: true, force: true }));

function fixture(name, content = 'hello') {
  const path = join(runtime, 'fixtures', name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
  return path;
}

function service(name) {
  const dataDir = join(runtime, name);
  return { dataDir, instance: new DocumentService(new PersistenceService(dataDir)) };
}

test('imports txt and markdown files, including uppercase extensions', () => {
  const { instance } = service('supported-formats');
  for (const filename of ['notes.txt', 'guide.md', 'UPPER.MD']) {
    const document = instance.importDocument(fixture(filename));
    assert.equal(document.filename, filename);
  }
  assert.deepEqual(instance.listDocuments().map((document) => document.filename), ['notes.txt', 'guide.md', 'UPPER.MD']);
});

test('accepts exactly 10 MiB and rejects one byte over before persistence', () => {
  const allowed = fixture('limit.txt', '');
  truncateSync(allowed, MAX_IMPORT_FILE_SIZE_BYTES);
  assert.equal(service('at-limit').instance.importDocument(allowed).size, MAX_IMPORT_FILE_SIZE_BYTES);

  const oversized = fixture('oversized.md', '');
  truncateSync(oversized, MAX_IMPORT_FILE_SIZE_BYTES + 1);
  const { dataDir, instance } = service('over-limit');
  assert.throws(() => instance.importDocument(oversized), /10 MB/);
  assert.equal(instance.listDocuments().length, 0);
  assert.deepEqual(existsSync(join(dataDir, 'documents', 'oversized.md')), false);
});

test('rejects unsupported and missing files without persistence', () => {
  const { dataDir, instance } = service('invalid');
  assert.throws(() => instance.importDocument(fixture('document.pdf')), /Unsupported file type/);
  assert.throws(() => instance.importDocument(join(runtime, 'missing.txt')), /File not found/);
  assert.equal(instance.listDocuments().length, 0);
  assert.deepEqual(readFileSync(join(runtime, 'fixtures', 'document.pdf'), 'utf8'), 'hello');
  assert.deepEqual(existsSync(join(dataDir, 'documents', 'document.pdf')), false);
});

test('rolls back copied files and content when persistence fails', () => {
  const dataDir = join(runtime, 'rollback');
  class FailingPersistence extends PersistenceService {
    writeJson() {
      throw new Error('simulated metadata failure');
    }
  }
  const instance = new DocumentService(new FailingPersistence(dataDir));
  assert.throws(() => instance.importDocument(fixture('rollback.txt')), /No data was saved/);
  assert.deepEqual(existsSync(join(dataDir, 'documents', 'rollback.txt')), false);
  assert.deepEqual(existsSync(join(dataDir, 'content')) ? readFileNames(join(dataDir, 'content')) : [], []);
});

function readFileNames(directory) {
  return readdirSync(directory);
}

test('file selection IPC filters txt and md and returns null when canceled', async () => {
  const handlers = new Map();
  const ipcMain = { handle: (channel, handler) => handlers.set(channel, handler) };
  let options;
  const dialog = {
    showOpenDialog: async (received) => {
      options = received;
      return { canceled: true, filePaths: [] };
    },
  };
  const noOp = new Proxy({}, { get: () => () => undefined });
  const { instance: documentService } = service('ipc-boundary');
  registerIpcHandlers(ipcMain, {
    documentService,
    indexingService: noOp,
    qaService: noOp,
    persistence: noOp,
    dialog,
  });
  assert.equal(await handlers.get(IPC_CHANNELS.SELECT_DOCUMENT)(), null);
  assert.deepEqual(options.filters[0].extensions, ['txt', 'md']);
  assert.deepEqual(options.properties, ['openFile']);
  await assert.rejects(
    handlers.get(IPC_CHANNELS.IMPORT_DOCUMENT)(undefined, fixture('bypass.pdf')),
    /Unsupported file type/,
  );
});

test('sandboxed Electron preload exposes the document bridge', () => {
  const electron = require('electron');
  const result = spawnSync(electron, [join(root, 'harness', 'tests', 'preload-bridge.cjs')], {
    cwd: root,
    encoding: 'utf8',
    timeout: 15_000,
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /"knowledgeBase":"object"/);
  assert.match(result.stdout, /"documents":"object"/);
});
