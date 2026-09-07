import { useEffect, useState } from "react";

type FileExplorerProps = {
  setEditorContent: (content: string) => void;
};

type Entry = {
  name: string;
  path: string;
  isDirectory: boolean;
};

export default function FileExplorer({
  setEditorContent,
}: FileExplorerProps) {
  const [rootFiles, setRootFiles] = useState<Entry[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [folderContents, setFolderContents] = useState<
    Record<string, Entry[]>
  >({});

  useEffect(() => {
    const files =
      (window as any).electronAPI.getDirectoryContents("../");

    setRootFiles(files);
  }, []);

  const openFile = (filePath: string) => {
    const content =
      (window as any).electronAPI.readFile(filePath);

    setEditorContent(content);
  };

  const toggleFolder = (folderPath: string) => {
    if (expandedFolders.includes(folderPath)) {
      setExpandedFolders((prev) =>
        prev.filter((f) => f !== folderPath)
      );
      return;
    }

    const contents =
      (window as any).electronAPI.getDirectoryContents(folderPath);

    setFolderContents((prev) => ({
      ...prev,
      [folderPath]: contents,
    }));

    setExpandedFolders((prev) => [...prev, folderPath]);
  };

  const renderTree = (
    entries: Entry[],
    level = 0
  ) => {
    return entries.map((entry) => (
      <div key={entry.path}>
        <div
          style={{
            padding: "4px",
            cursor: "pointer",
            marginLeft: `${level * 20}px`,
            userSelect: "none",
          }}
          onClick={() => {
            if (entry.isDirectory) {
              toggleFolder(entry.path);
            } else {
              openFile(entry.path);
            }
          }}
        >
          {entry.isDirectory ? (
            expandedFolders.includes(entry.path)
              ? "▼ 📁 "
              : "▶ 📁 "
          ) : (
            "📄 "
          )}

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
    <div>
      <h3>Explorer</h3>

      <div>
        {renderTree(rootFiles)}
      </div>
    </div>
  );
}