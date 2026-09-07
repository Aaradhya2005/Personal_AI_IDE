const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("electronAPI", {
  readDirectory: (dirPath) => {
    return fs.readdirSync(dirPath, {
      withFileTypes: true,
    });
  },

  readFile: (filePath) => {
    return fs.readFileSync(filePath, "utf8");
  },

  getDirectoryContents: (dirPath) => {
    return fs.readdirSync(dirPath, {
      withFileTypes: true,
    }).map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      path: path.join(dirPath, entry.name),
    }));
  },
  writeFile: (filePath, content) => {
    fs.writeFileSync(filePath, content, "utf8");
  },
  sendTerminalData: (data) => {
    ipcRenderer.send("terminal:write", data);
  },
  
  onTerminalData: (callback) => {
    ipcRenderer.on("terminal:data", (_, data) => {
      callback(data);
    });
  },
});