import "./App.css";
import Editor from "@monaco-editor/react";
import TerminalPanel from "./components/Terminal";

function App() {
  return (
    <div className="app">
      <div className="top">
        <div className="explorer">Explorer</div>

        <div className="editor">
         <Editor
         height="100%"
        defaultLanguage="typescript"
        defaultValue={`function hello() {
        console.log("Hello Personal AI IDE");
         }`}
            theme="vs-dark"
             />
        </div>

        <div className="agent">AI Agent</div>
      </div>

      <div className="terminal">
              <TerminalPanel />
        </div>
    </div>
  );
}

export default App;