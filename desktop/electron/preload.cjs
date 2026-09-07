const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("electronAPI", {
  readDirectory: (dirPath) => {
    return fs.readdirSync(dirPath, {
      withFileTypes: true,
    });
  },
});