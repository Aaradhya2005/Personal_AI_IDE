import "./App.css";
import Editor from "@monaco-editor/react";
import TerminalPanel from "./components/Terminal";
import FileExplorer from "./components/FileExplorer";
import { useState } from "react";

function App() {
  const [editorContent, setEditorContent] = useState(
    `function hello() {
      console.log("Hello Personal AI IDE");
    }`
    );
  return (
    <div className="app">
      <div className="top">
      <div className="explorer">
      <FileExplorer setEditorContent={setEditorContent} />
      </div>

        <div className="editor">
           <Editor
               height="100%"
              defaultLanguage="typescript"
               value={editorContent}
             theme="vs-dark"
          />
        </div>

        <div className="agent">
            <h3>AI Agent</h3>

            <textarea placeholder="Ask the agent to modify code..." />

            <button>Run Agent</button>
          </div>
      </div>

      <div className="terminal">
              <TerminalPanel />
        </div>
    </div>
  );
}

export default App;