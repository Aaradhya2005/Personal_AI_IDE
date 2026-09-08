import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";

export default function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
      },
    });

    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon);

    term.open(terminalRef.current);

    setTimeout(() => {
      fitAddon.fit();
    }, 100);

    term.writeln("Personal AI IDE");
    term.writeln("");

    (window as any).electronAPI.onTerminalData(
      (data: string) => {
        term.write(data);
      }
    );

    
    term.onData((data) => {
      (window as any).electronAPI.sendTerminalData(data);
    });

    const resizeHandler = () => {
      fitAddon.fit();
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      term.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}