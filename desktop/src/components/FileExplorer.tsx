import { useEffect, useState } from "react";

type FileExplorerProps = {
    setEditorContent: (content: string) => void;
  };
  
  type FileEntry = {
    name: string;
    path: string;
    isDirectory: boolean;
  };
  
  export default function FileExplorer({
    setEditorContent,
  }: FileExplorerProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);

  useEffect(() => {
    const result = (window as any).electronAPI.readDirectory("../");

    setFiles(result);
  }, []);

  return (
    <div>
      <h3>Explorer</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {files.map((file, index) => (
          <li
          key={index}
          onClick={() => {
            if (file.isDirectory) {
              console.log("Folder:", file.name);
              return;
            }
          
            const content =
              (window as any).electronAPI.readFile(file.path);
          
            setEditorContent(content);
          }}
          style={{
            cursor: "pointer",
            padding: "4px",
          }}
        >
          {file.name}
        </li>
        ))}
      </ul>
    </div>
  );
}