import "./App.css";
import Editor from "@monaco-editor/react";
import TerminalPanel from "./components/Terminal";

function App() {
  return (
    <div className="app">
      <div className="top">
      <div className="explorer">
          <h3>Explorer</h3>

          <ul>
            <li>src</li>
           <li>backend</li>
           <li>models</li>
           <li>reports</li>
         </ul>
        </div>

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