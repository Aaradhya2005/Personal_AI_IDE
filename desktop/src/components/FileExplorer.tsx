import { useEffect, useState } from "react";
import "./FileExplorer.css";

type FileExplorerProps = {
  setEditorContent: (content: string) => void;
  setCurrentFile: (path: string) => void;
};

type Entry = {
  name: string;
  path: string;
  isDirectory: boolean;
};

export default function FileExplorer({
  setEditorContent,
  setCurrentFile,
}: FileExplorerProps) {
  const [rootFiles, setRootFiles] = useState<Entry[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [folderContents, setFolderContents] =
    useState<Record<string, Entry[]>>({});

  const [selectedEntry, setSelectedEntry] =
    useState<Entry | null>(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [showNewFileModal, setShowNewFileModal] =
    useState(false);

  const [newFileName, setNewFileName] =
    useState("");
    const loadRootFiles = () => {
      const files =
        (window as any).electronAPI.getDirectoryContents("../");
    
      setRootFiles(files);
    };
    
    useEffect(() => {
      loadRootFiles();
    }, []);

  const refreshFolder = (folderPath: string) => {
    const contents =
      (window as any).electronAPI.getDirectoryContents(
        folderPath
      );

    setFolderContents((prev) => ({
      ...prev,
      [folderPath]: contents,
    }));
  };

  const openFile = (filePath: string) => {
    const content =
      (window as any).electronAPI.readFile(filePath);

    setEditorContent(content);
    setCurrentFile(filePath);
  };

  const toggleFolder = (folderPath: string) => {
    if (expandedFolders.includes(folderPath)) {
      setExpandedFolders((prev) =>
        prev.filter((f) => f !== folderPath)
      );
      return;
    }

    const contents =
      (window as any).electronAPI.getDirectoryContents(
        folderPath
      );

    setFolderContents((prev) => ({
      ...prev,
      [folderPath]: contents,
    }));

    setExpandedFolders((prev) => [
      ...prev,
      folderPath,
    ]);
  };

  const renderTree = (
    entries: Entry[],
    level = 0
  ) => {
    return entries.map((entry) => (
      <div key={entry.path}>
        <div
          className="explorer-item"
          style={{
            marginLeft: `${level * 20}px`,
          }}
          onContextMenu={(e) => {
            e.preventDefault();

            setSelectedEntry(entry);

            setContextMenu({
              visible: true,
              x: e.pageX,
              y: e.pageY,
            });
          }}
          onClick={() => {
            if (entry.isDirectory) {
              toggleFolder(entry.path);
            } else {
              openFile(entry.path);
            }
          }}
        >
          {entry.isDirectory
            ? expandedFolders.includes(entry.path)
              ? "▼ 📁 "
              : "▶ 📁 "
            : "📄 "}

          {entry.name}
        </div>

        {entry.isDirectory &&
          expandedFolders.includes(entry.path) &&
          folderContents[entry.path] &&
          renderTree(
            folderContents[entry.path],
            level + 1
          )}
      </div>
    ));
  };

  return (
    <div
      className="explorer-container"
      onClick={() =>
        setContextMenu({
          visible: false,
          x: 0,
          y: 0,
        })
      }
    >
      <h3 className="explorer-title">
        Explorer
      </h3>

      <div className="explorer-tree">
        {renderTree(rootFiles)}
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <div
            className="context-menu-item"
            onClick={() => {
              setShowNewFileModal(true);

              setContextMenu({
                visible: false,
                x: 0,
                y: 0,
              });
            }}
          >
            New File
          </div>

          <div className="context-menu-item">
            New Folder
          </div>

          <div className="context-menu-item">
            Rename
          </div>

          <div className="context-menu-item">
            Delete
          </div>
        </div>
      )}

      {showNewFileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>New File</h3>

            <input
              type="text"
              placeholder="example.py"
              value={newFileName}
              onChange={(e) =>
                setNewFileName(e.target.value)
              }
            />

            <div className="modal-buttons">
              <button
                onClick={() => {
                  if (!selectedEntry) return;
                  if (!newFileName.trim()) return;

                  const parentPath =
                    selectedEntry.isDirectory
                      ? selectedEntry.path
                      : selectedEntry.path.substring(
                          0,
                          selectedEntry.path.lastIndexOf(
                            "\\"
                          )
                        );

                  const newFilePath =
                    parentPath +
                    "\\" +
                    newFileName;

                    (window as any).electronAPI.createFile(
                      newFilePath
                    );
                    
                    refreshFolder(parentPath);
                    
                    openFile(newFilePath);
                    
                    setShowNewFileModal(false);
                    setNewFileName("");
                    setSelectedEntry(null);
                }}
              >
                Create
              </button>

              <button
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="selected-entry">
          Selected: {selectedEntry.name}
        </div>
      )}
    </div>
  );
}