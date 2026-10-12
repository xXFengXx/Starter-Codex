const { app, BrowserWindow } = require('electron');
const path = require('node:path');

app.whenReady().then(async () => {
  const root = path.resolve(__dirname, '..', '..');
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(root, 'dist', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await window.loadURL('data:text/html,<html></html>');
  const bridge = await window.webContents.executeJavaScript(
    "({ knowledgeBase: typeof window.knowledgeBase, documents: typeof window.knowledgeBase?.documents })",
  );
  console.log(JSON.stringify(bridge));
  app.exit(bridge.knowledgeBase === 'object' && bridge.documents === 'object' ? 0 : 1);
});
