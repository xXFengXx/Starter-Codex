import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '../shared/types';
import { PersistenceService } from './persistence-service';
import { logger } from './logger';

const SERVICE = 'document-service';
const DOCUMENTS_META = 'documents-meta.json';
export const MAX_IMPORT_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_IMPORT_EXTENSIONS = new Set(['.txt', '.md']);

export class DocumentService {
  private persistence: PersistenceService;

  constructor(persistence: PersistenceService) {
    this.persistence = persistence;
  }

  /** List all imported documents. */
  listDocuments(): Document[] {
    const docs = this.persistence.readJson<Document[]>(DOCUMENTS_META);
    logger.debug(SERVICE, 'Listing documents', { count: docs?.length ?? 0 });
    return docs ?? [];
  }

  /** Import a file from the given path. */
  importDocument(filePath: string): Document {
    if (!fs.existsSync(filePath)) {
      logger.error(SERVICE, `File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }

    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);
    const extension = path.extname(filename).toLowerCase();

    if (!stats.isFile()) {
      throw new Error('The selected path is not a file.');
    }
    if (!SUPPORTED_IMPORT_EXTENSIONS.has(extension)) {
      throw new Error('Unsupported file type. Only .txt and .md files can be imported.');
    }
    if (stats.size > MAX_IMPORT_FILE_SIZE_BYTES) {
      throw new Error('File exceeds the 10 MB size limit.');
    }

    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      logger.error(SERVICE, 'Unable to read import file', { filePath, error: String(error) });
      throw new Error('The selected file could not be read.');
    }

    const documentId = uuidv4();
    const contentPath = `content/${documentId}.txt`;

    const doc: Document = {
      id: documentId,
      title: filename.replace(/\.[^.]+$/, ''),
      filename,
      importedAt: new Date().toISOString(),
      size: stats.size,
      status: 'imported',
    };

    let sourceCopied = false;
    try {
      // Write metadata last so failed imports never appear in the document list.
      this.persistence.copyFileToDocuments(filePath, filename);
      sourceCopied = true;
      this.persistence.writeText(contentPath, content);
      const docs = this.listDocuments();
      docs.push(doc);
      this.persistence.writeJson(DOCUMENTS_META, docs);
    } catch (error) {
      if (sourceCopied) this.persistence.deleteFromDocuments(filename);
      this.persistence.deleteFile(contentPath);
      logger.error(SERVICE, 'Document import failed and was rolled back', {
        filename,
        error: String(error),
      });
      throw new Error(`Unable to import ${filename}. No data was saved.`);
    }

    logger.info(SERVICE, 'Document imported', {
      documentId: doc.id,
      filename: doc.filename,
      size: doc.size,
    });
    return doc;
  }

  /** Get a single document by ID. */
  getDocument(id: string): Document | null {
    const docs = this.listDocuments();
    return docs.find(d => d.id === id) ?? null;
  }

  /** Get the text content of a document. */
  getDocumentContent(id: string): string | null {
    return this.persistence.readText(`content/${id}.txt`);
  }

  /** Update a document's metadata. */
  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const docs = this.listDocuments();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return null;

    docs[index] = { ...docs[index], ...updates };
    this.persistence.writeJson(DOCUMENTS_META, docs);
    logger.info(SERVICE, 'Document updated', { documentId: id, fields: Object.keys(updates) });
    return docs[index];
  }

  /** Delete a document by ID. */
  deleteDocument(id: string): boolean {
    const docs = this.listDocuments();
    const doc = docs.find(d => d.id === id);
    if (!doc) return false;

    this.persistence.deleteFromDocuments(doc.filename);

    const updated = docs.filter(d => d.id !== id);
    this.persistence.writeJson(DOCUMENTS_META, updated);
    logger.info(SERVICE, 'Document deleted', { documentId: id, filename: doc.filename });
    return true;
  }
}
