import { useEffect, useState } from "react";

type FileEntry = {
  name: string;
};

export default function FileExplorer() {
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
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}