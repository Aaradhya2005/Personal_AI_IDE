import "./App.css";
import Editor from "@monaco-editor/react";
import TerminalPanel from "./components/Terminal";
import FileExplorer from "./components/FileExplorer";
import { useState, useEffect  } from "react";

function App() {
  const [editorContent, setEditorContent] = useState(
    `function hello() {
      console.log("Hello Personal AI IDE");
    }`
    );
    const [currentFile, setCurrentFile] = useState("");
    const [showSaved, setShowSaved] = useState(false);
    const saveFile = () => {
      if (!currentFile) return;
    
      (window as any).electronAPI.writeFile(
        currentFile,
        editorContent
      );
    
      setShowSaved(true);
    
      setTimeout(() => {
        setShowSaved(false);
      }, 2000);
    };
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "s") {
          e.preventDefault();
          saveFile();
        }
      };
    
      window.addEventListener("keydown", handleKeyDown);
    
      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown
        );
      };
    }, [editorContent, currentFile]);
  return (
    <>
    {showSaved && (
      <div className="save-toast">
        ✓ File Saved
      </div>
    )}
    <div className="app">
      <div className="top">
      <div className="explorer">
          <FileExplorer
              setEditorContent={setEditorContent}
           setCurrentFile={setCurrentFile}
            />
      </div>

        <div className="editor">
           <Editor
               height="100%"
              defaultLanguage="typescript"
               value={editorContent}
               onChange={(value) =>
                setEditorContent(value || "")
              }
             theme="vs-dark"
          />
        </div>

        <div className="agent">
  <h3>AI Agent</h3>

  <button onClick={saveFile}>
  Save File
</button>

  <textarea placeholder="Ask the agent to modify code..." />

  <button>Run Agent</button>
</div>
      </div>

      <div className="terminal">
              <TerminalPanel />
        </div>
    </div>
    </>
  );
}

export default App;