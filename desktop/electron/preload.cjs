const { contextBridge } = require("electron");
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
});