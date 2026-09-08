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
    const [showNewFolderModal, setShowNewFolderModal] =
    useState(false);
  
  const [newFolderName, setNewFolderName] =
    useState("");
  
  const [showRenameModal, setShowRenameModal] =
    useState(false);
  
  const [renameValue, setRenameValue] =
    useState("");
  
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  
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

          <div
                className="context-menu-item"
               onClick={() => {
                 setShowNewFolderModal(true);

                 setContextMenu({
                   visible: false,
                    x: 0,
                   y: 0,
                 });
                }}
              >
               New Folder
           </div>


          <div
                className="context-menu-item"
                onClick={() => {
                  if (!selectedEntry) return;

                  setRenameValue(selectedEntry.name);

                  setShowRenameModal(true);

                  setContextMenu({
                   visible: false,
                    x: 0,
                    y: 0,
                 });
               }}
              >
                Rename
              </div>
              <div
                className="context-menu-item"
                onClick={() => {
                  if (!selectedEntry) return;
                
                  setShowDeleteModal(true);
                
                  setContextMenu({
                    visible: false,
                    x: 0,
                    y: 0,
                  });
                }}
              >
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
                    
                    loadRootFiles();
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
      {showNewFolderModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>New Folder</h3>

      <input
        type="text"
        placeholder="folder_name"
        value={newFolderName}
        onChange={(e) =>
          setNewFolderName(e.target.value)
        }
      />

      <div className="modal-buttons">
        <button
          onClick={() => {
            if (!selectedEntry) return;
            if (!newFolderName.trim()) return;

            const parentPath =
              selectedEntry.isDirectory
                ? selectedEntry.path
                : selectedEntry.path.substring(
                    0,
                    selectedEntry.path.lastIndexOf("\\")
                  );

            const newFolderPath =
              parentPath +
              "\\" +
              newFolderName;

            (window as any).electronAPI.createFolder(
              newFolderPath
            );

            loadRootFiles();
            refreshFolder(parentPath);

            setShowNewFolderModal(false);
            setNewFolderName("");
            setSelectedEntry(null);
          }}
        >
          Create
        </button>

        <button
          onClick={() => {
            setShowNewFolderModal(false);
            setNewFolderName("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showRenameModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Rename</h3>

      <input
        type="text"
        value={renameValue}
        onChange={(e) =>
          setRenameValue(e.target.value)
        }
      />

      <div className="modal-buttons">
        <button
          onClick={() => {
            if (!selectedEntry) return;
            if (!renameValue.trim()) return;

            const parentPath =
              selectedEntry.path.substring(
                0,
                selectedEntry.path.lastIndexOf("\\")
              );

            const newPath =
              parentPath +
              "\\" +
              renameValue;

            (window as any).electronAPI.renamePath(
              selectedEntry.path,
              newPath
            );

            loadRootFiles();
            refreshFolder(parentPath);

            setShowRenameModal(false);
            setRenameValue("");
            setSelectedEntry(null);
          }}
        >
          Rename
        </button>

        <button
          onClick={() => {
            setShowRenameModal(false);
            setRenameValue("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showDeleteModal && selectedEntry && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Delete</h3>

      <p>
        Delete "{selectedEntry.name}" ?
      </p>

      <div className="modal-buttons">
        <button
          onClick={() => {
            const parentPath =
              selectedEntry.path.substring(
                0,
                selectedEntry.path.lastIndexOf("\\")
              );

            (window as any).electronAPI.deletePath(
              selectedEntry.path
            );

            loadRootFiles();
            refreshFolder(parentPath);

            setShowDeleteModal(false);
            setSelectedEntry(null);
          }}
        >
          Delete
        </button>

        <button
          onClick={() => {
            setShowDeleteModal(false);
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