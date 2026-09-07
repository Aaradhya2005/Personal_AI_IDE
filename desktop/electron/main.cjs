const { app, BrowserWindow,ipcMain,} = require("electron");
const path = require("path");
const pty = require("node-pty");

let shell;
ipcMain.on("terminal:write", (_, data) => {
  if (shell) {
    shell.write(data);
  }
});
function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  shell = pty.spawn("powershell.exe", [], {
    name: "xterm-color",
    cols: 120,
    rows: 30,
    cwd: process.cwd(),
    env: process.env,
  });
  shell.onData((data) => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("terminal:data", data);
    });
  });

  createWindow();
});