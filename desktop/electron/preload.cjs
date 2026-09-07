const { contextBridge } = require("electron");
const fs = require("fs");

contextBridge.exposeInMainWorld("electronAPI", {
    readDirectory: (dirPath) => {
        return fs.readdirSync(dirPath, {
          withFileTypes: true,
        }).map((file) => ({
          name: file.name,
          path: require("path").join(dirPath, file.name),
          isDirectory: file.isDirectory(),
        }));
      },

  readFile: (filePath) => {
    return fs.readFileSync(filePath, "utf8");
  },
});