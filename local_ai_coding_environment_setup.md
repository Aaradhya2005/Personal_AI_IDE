# Local AI Coding Environment --- Setup & MVP Guide

> **Purpose:** Build a local desktop AI coding environment similar in
> interaction to an AI coding IDE.
>
> **Chosen stack:** Electron + React + Vite + Monaco Editor + xterm.js +
> Python/FastAPI + llama.cpp + Git + Docker.
>
> **Scope:** This guide focuses on the first working pipeline. It
> deliberately avoids vector databases, RAG, multi-agent orchestration,
> PostgreSQL, Kubernetes, and other advanced infrastructure.

------------------------------------------------------------------------

# 1. Target Architecture

``` text
┌─────────────────────────────────────────────────────────────────────┐
│                         DESKTOP APPLICATION                         │
│                            Electron                                │
│                                                                     │
│ ┌─────────────┬──────────────────────────┬────────────────────────┐ │
│ │ File        │ Monaco Editor            │ AI Agent               │ │
│ │ Explorer    │                          │                        │ │
│ │             │  main.cpp                │ User: Fix login bug    │ │
│ │ src/        │  ...                     │                        │ │
│ │ tests/      │                          │ ✓ Searching            │ │
│ │ config/     │                          │ ✓ Reading              │ │
│ │             │                          │ → Editing              │ │
│ ├─────────────┴──────────────────────────┴────────────────────────┤ │
│ │                         xterm.js Terminal                       │ │
│ │ $ pytest                                                        │ │
│ │ ✓ 42 passed                                                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                         REST + WebSocket
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PYTHON BACKEND                              │
│                            FastAPI                                 │
│                                                                     │
│ Repository Manager ──┐                                              │
│ Codebase Analyzer ───┤                                              │
│ Planner ─────────────┤                                              │
│ Agent Controller ────┼──► Local LLM Client                         │
│ Tool Manager ────────┤                                              │
│ Git Manager ─────────┤                                              │
│ Build/Test Manager ──┘                                              │
│                                                                     │
│ Tools: read / search / create / edit / delete / command / git       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
                         llama.cpp server
                                │
                                ▼
                           GGUF Model

Execution:
FastAPI → Docker → repository workspace → build/test
```

## Core loop

``` text
Open Repository
      ↓
Scan Repository
      ↓
Baseline
      ↓
User Task
      ↓
Planner
      ↓
Local LLM
      ↓
Search / Read / Edit / Execute
      ↓
Build / Test
      ↓
Fix if necessary
      ↓
Git Diff
      ↓
Review
      ↓
After Analysis
      ↓
Before / After Comparison
      ↓
Final Report
```

------------------------------------------------------------------------

# 2. What Each Technology Does

  Technology       Responsibility
  ---------------- --------------------------------------------------
  Electron         Desktop application shell, native OS integration
  React            IDE interface
  Vite             Frontend development/build tooling
  Monaco Editor    VS-Code-like code editor
  xterm.js         Terminal UI
  Python           Agent/backend implementation
  FastAPI          REST API + WebSocket server
  llama.cpp        Local LLM inference server
  GGUF model       Local coding model
  Git              Branches, status, diff, history
  Docker           Isolated command/build/test execution
  ripgrep (`rg`)   Fast repository code search
  Tree-sitter      Later: AST parsing and structural code analysis
  Pydantic         Backend data models / validation
  httpx            Python HTTP client for llama.cpp
  WebSocket        Live agent and terminal events

------------------------------------------------------------------------

# 3. Prerequisites

This guide assumes Windows is the primary development platform.

Install:

1.  Git
2.  Node.js LTS
3.  Python 3
4.  Docker Desktop
5.  C/C++ build tooling if you need to build llama.cpp yourself
6.  Your GGUF coding model
7.  llama.cpp

Recommended checks:

``` powershell
git --version
node --version
npm --version
python --version
docker --version
docker compose version
```

If a command is not recognized, restart the terminal after installing
the corresponding software.

------------------------------------------------------------------------

# 4. Official Resources

Use official sources whenever possible.

## Node.js

Download: https://nodejs.org/en/download/

Node.js LTS is recommended.

Vite currently requires a modern Node.js release; check the Vite
documentation if your installed version is rejected.

Documentation: https://nodejs.org/docs/latest/api/

## Electron

Documentation: https://www.electronjs.org/docs/latest/

Installation:
https://www.electronjs.org/docs/latest/tutorial/installation

## React

Documentation: https://react.dev/

Installation: https://react.dev/learn/installation

## Vite

Documentation: https://vite.dev/guide/

## Monaco Editor

Repository: https://github.com/microsoft/monaco-editor

Documentation: https://microsoft.github.io/monaco-editor/

## xterm.js

Repository: https://github.com/xtermjs/xterm.js

Documentation: https://xtermjs.org/

## Python

Download: https://www.python.org/downloads/

Documentation: https://docs.python.org/3/

## FastAPI

Documentation: https://fastapi.tiangolo.com/

## llama.cpp

Repository: https://github.com/ggml-org/llama.cpp

Server documentation:
https://github.com/ggml-org/llama.cpp/tree/master/tools/server

## Git

Download: https://git-scm.com/downloads

Documentation: https://git-scm.com/doc

## Docker Desktop

Download/documentation: https://docs.docker.com/desktop/

Windows installation:
https://docs.docker.com/desktop/setup/install/windows-install/

## Tree-sitter

Repository: https://github.com/tree-sitter/tree-sitter

Python bindings: https://github.com/tree-sitter/py-tree-sitter

## ripgrep

Repository: https://github.com/BurntSushi/ripgrep

Releases: https://github.com/BurntSushi/ripgrep/releases

------------------------------------------------------------------------

# 5. Recommended Project Location

Use a normal development directory, for example:

``` powershell
mkdir C:\dev
cd C:\dev
mkdir ai-coding-environment
cd ai-coding-environment
```

Do not keep the project inside a temporary directory.

------------------------------------------------------------------------

# 6. Install Node.js

Download the current LTS release from:

https://nodejs.org/en/download/

After installation:

``` powershell
node --version
npm --version
```

You should see valid versions for both.

------------------------------------------------------------------------

# 7. Install Git

Download Git for Windows:

https://git-scm.com/download/win

Verify:

``` powershell
git --version
```

Configure Git if this is a new machine:

``` powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Do not put real credentials or tokens into source code.

------------------------------------------------------------------------

# 8. Install Python

Download Python:

https://www.python.org/downloads/

During Windows installation, enable:

``` text
Add python.exe to PATH
```

Verify:

``` powershell
python --version
pip --version
```

If `python` does not work but `py` does:

``` powershell
py --version
```

The rest of this guide uses `python`.

------------------------------------------------------------------------

# 9. Install Docker Desktop

Download:

https://www.docker.com/products/docker-desktop/

Windows documentation:

https://docs.docker.com/desktop/setup/install/windows-install/

Start Docker Desktop.

Verify:

``` powershell
docker --version
docker compose version
```

Test:

``` powershell
docker run hello-world
```

For the initial system, Docker is mainly used to isolate repository
commands/builds/tests.

Do not put the entire desktop application inside Docker.

Recommended architecture:

``` text
Host
├── Electron
├── React
├── Python/FastAPI
├── llama.cpp
└── Docker Desktop
      └── Agent execution containers
```

------------------------------------------------------------------------

# 10. Install ripgrep

Your first repository search tool can use `rg`.

If you install it separately, use:

https://github.com/BurntSushi/ripgrep/releases

Verify:

``` powershell
rg --version
```

Example:

``` powershell
rg "authentication" src
```

Example with file names and line numbers:

``` powershell
rg -n "authentication" src
```

This is enough for the first `search_code()` tool.

------------------------------------------------------------------------

# 11. Create the Desktop Frontend

From:

``` powershell
C:\dev\ai-coding-environment
```

Create a React + TypeScript + Vite application:

``` powershell
npm create vite@latest desktop -- --template react-ts
```

Enter the directory:

``` powershell
cd desktop
```

Install dependencies:

``` powershell
npm install
```

Run the normal React development server:

``` powershell
npm run dev
```

You should see a local development URL, normally:

``` text
http://localhost:5173
```

Stop it with:

``` text
Ctrl+C
```

------------------------------------------------------------------------

# 12. Install Electron

Inside `desktop`:

``` powershell
npm install --save-dev electron
```

Electron is installed as a development dependency.

Also install a convenient development helper:

``` powershell
npm install --save-dev concurrently wait-on
```

Install Electron packaging later:

``` powershell
npm install --save-dev electron-builder
```

You do not need packaging during the first development stage.

------------------------------------------------------------------------

# 13. Install Monaco Editor

Inside `desktop`:

``` powershell
npm install monaco-editor @monaco-editor/react
```

The React wrapper makes Monaco convenient to embed in React.

------------------------------------------------------------------------

# 14. Install xterm.js

Inside `desktop`:

``` powershell
npm install @xterm/xterm @xterm/addon-fit
```

xterm.js is only the terminal interface.

It does NOT execute shell commands itself.

Your architecture is:

``` text
xterm.js
    ↓
WebSocket
    ↓
FastAPI
    ↓
Shell/process
    ↓
stdout/stderr
    ↓
WebSocket
    ↓
xterm.js
```

------------------------------------------------------------------------

# 15. Install Frontend State Management

Use Zustand for simple application state:

``` powershell
npm install zustand
```

Useful state:

``` text
currentRepository
openFiles
activeFile
agentStatus
agentEvents
terminalSessions
gitChanges
```

You can replace it later if necessary.

------------------------------------------------------------------------

# 16. Electron Folder Structure

Inside `desktop`, create:

``` text
desktop/
├── electron/
│   ├── main.ts
│   └── preload.ts
│
├── src/
│   ├── components/
│   │   ├── Explorer/
│   │   ├── Editor/
│   │   ├── Terminal/
│   │   ├── Agent/
│   │   └── Diff/
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── websocket.ts
│   │
│   ├── stores/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
└── vite.config.ts
```

Do not create every advanced component immediately. The structure is a
target.

------------------------------------------------------------------------

# 17. Electron Main vs React Renderer

Keep this separation:

``` text
Electron Main Process
    ↓
Native OS functionality

React Renderer
    ↓
UI only
```

Use Electron preload/contextBridge for controlled APIs.

Do NOT expose unrestricted Node.js APIs to the renderer.

Conceptually:

``` text
React
  ↓
window.electron.openRepository()
  ↓
preload
  ↓
IPC
  ↓
Electron main
  ↓
Native file dialog
```

Electron IPC documentation:

https://www.electronjs.org/docs/latest/tutorial/ipc

------------------------------------------------------------------------

# 18. Python Backend

Return to the project root:

``` powershell
cd C:\dev\ai-coding-environment
mkdir backend
cd backend
```

Create a virtual environment:

``` powershell
python -m venv .venv
```

Activate it in PowerShell:

``` powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can either use Command Prompt:

``` cmd
.venv\Scripts\activate.bat
```

or adjust the PowerShell execution policy for your user according to
your organization's security requirements.

Upgrade pip:

``` powershell
python -m pip install --upgrade pip
```

------------------------------------------------------------------------

# 19. Install Python Dependencies

Initial dependencies:

``` powershell
pip install fastapi uvicorn pydantic httpx websockets GitPython docker
```

Development tools:

``` powershell
pip install pytest ruff
```

Optional Windows terminal support:

``` powershell
pip install pywinpty
```

Later code analysis:

``` powershell
pip install tree-sitter tree-sitter-language-pack
```

For the first prototype, Tree-sitter can remain uninstalled until basic
file/search operations work.

Save dependencies:

``` powershell
pip freeze > requirements.txt
```

A cleaner long-term approach is to maintain a deliberately curated
`requirements.txt` instead of blindly freezing every transitive
dependency.

------------------------------------------------------------------------

# 20. Basic FastAPI Server

Create:

``` text
backend/app/main.py
```

Minimal implementation:

``` python
from fastapi import FastAPI

app = FastAPI(title="Local AI Coding Backend")


@app.get("/health")
def health():
    return {"status": "ok"}
```

Run:

``` powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Test in a browser:

``` text
http://127.0.0.1:8000/health
```

Expected:

``` json
{
  "status": "ok"
}
```

Swagger/OpenAPI:

``` text
http://127.0.0.1:8000/docs
```

------------------------------------------------------------------------

# 21. Backend Structure

Build toward:

``` text
backend/
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── repository.py
│   │   ├── files.py
│   │   ├── agent.py
│   │   ├── terminal.py
│   │   └── git.py
│   │
│   ├── agent/
│   │   ├── controller.py
│   │   ├── planner.py
│   │   ├── llm.py
│   │   ├── state.py
│   │   └── tools.py
│   │
│   ├── analyzer/
│   │   ├── scanner.py
│   │   ├── metrics.py
│   │   └── search.py
│   │
│   ├── repository/
│   │   ├── manager.py
│   │   └── workspace.py
│   │
│   ├── execution/
│   │   ├── commands.py
│   │   ├── build.py
│   │   └── tests.py
│   │
│   ├── git/
│   │   └── manager.py
│   │
│   └── reports/
│       ├── baseline.py
│       └── comparison.py
│
├── tests/
├── requirements.txt
└── .venv/
```

------------------------------------------------------------------------

# 22. llama.cpp

You already have experience building llama.cpp, so keep using it as the
local inference layer.

Official repository:

https://github.com/ggml-org/llama.cpp

The current server executable is `llama-server`.

If you build llama.cpp from source, the official server documentation
provides CMake commands such as:

``` powershell
cmake -B build
cmake --build build --config Release -t llama-server
```

The exact output location can vary by platform/build configuration.

Verify:

``` powershell
llama-server --help
```

or, if it is not on PATH:

``` powershell
.\build\bin\Release\llama-server.exe --help
```

Adjust the path to match your build.

------------------------------------------------------------------------

# 23. Start llama.cpp

Assume your model is:

``` text
C:\models\coding-model.gguf
```

A basic server command is:

``` powershell
llama-server.exe `
  -m "C:\models\coding-model.gguf" `
  -c 8192 `
  --host 127.0.0.1 `
  --port 8080
```

If your executable is elsewhere, use its full path.

The llama.cpp server normally exposes a local HTTP interface.

Check:

``` text
http://127.0.0.1:8080
```

The exact available endpoints/options depend on the llama.cpp version
you installed, so use:

``` powershell
llama-server.exe --help
```

and the server documentation for your version.

Server documentation:

https://github.com/ggml-org/llama.cpp/tree/master/tools/server

------------------------------------------------------------------------

# 24. Test llama.cpp Before Connecting Python

Do this BEFORE writing the LLM integration.

If the server is running, verify the API using the endpoint shown by
your installed llama.cpp version.

For OpenAI-compatible endpoints, a common pattern is:

``` powershell
curl.exe http://127.0.0.1:8080/v1/models
```

Then test a chat completion:

``` powershell
curl.exe http://127.0.0.1:8080/v1/chat/completions `
  -H "Content-Type: application/json" `
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Explain what a C++ class is in one sentence.\"}],\"max_tokens\":100}"
```

If your particular llama.cpp build exposes a different endpoint, use the
endpoint shown by its server documentation/version.

Do not proceed to the agent loop until this basic request works.

------------------------------------------------------------------------

# 25. Python LLM Client

Create:

``` text
backend/app/agent/llm.py
```

Conceptual responsibility:

``` text
Python
  ↓
HTTP request
  ↓
llama.cpp
  ↓
local GGUF model
  ↓
response
```

Use `httpx`.

Example structure:

``` python
import httpx


class LocalLLM:
    def __init__(self, base_url: str = "http://127.0.0.1:8080"):
        self.base_url = base_url

    async def chat(self, messages):
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(
                f"{self.base_url}/v1/chat/completions",
                json={
                    "messages": messages,
                    "temperature": 0.1,
                    "max_tokens": 2000,
                },
            )
            response.raise_for_status()
            return response.json()
```

Treat this as an initial adapter. The exact request format should match
the API exposed by the llama.cpp version/model you run.

------------------------------------------------------------------------

# 26. Environment Configuration

Do not hard-code model paths.

Create:

``` text
backend/.env
```

Example:

``` text
LLM_BASE_URL=http://127.0.0.1:8080
WORKSPACE_ROOT=C:\dev\ai-coding-environment\workspaces
MAX_AGENT_RETRIES=3
```

For secrets later, use a proper secret mechanism. Do not commit `.env`.

Add:

``` text
.env
.venv/
node_modules/
dist/
workspaces/
```

to appropriate `.gitignore` files.

------------------------------------------------------------------------

# 27. Repository Manager

The repository manager should eventually provide:

``` text
open_repository()
clone_repository()
create_workspace()
get_root()
is_git_repository()
create_agent_branch()
```

Basic repository workflow:

``` text
User selects folder
        ↓
Repository Manager
        ↓
Validate repository
        ↓
Create/choose workspace
        ↓
Create agent branch
        ↓
Agent starts
```

------------------------------------------------------------------------

# 28. First Repository Scanner

Before AST analysis, implement a simple scanner.

Collect:

``` text
file count
directory count
file extensions
language estimate
LOC
Git status
```

Example:

``` json
{
  "project": {
    "files": 421,
    "directories": 48,
    "loc": 98431
  },
  "languages": {
    "cpp": 120,
    "python": 40
  }
}
```

Write:

``` text
baseline.json
```

Do not try to calculate every architectural metric immediately.

------------------------------------------------------------------------

# 29. First Search Tool

Implement:

``` text
search_code(query, path)
```

Example command:

``` powershell
rg -n "authentication" src
```

Return structured data to the LLM:

``` json
{
  "query": "authentication",
  "matches": [
    {
      "file": "src/auth/AuthService.cpp",
      "line": 31,
      "text": "..."
    }
  ]
}
```

The LLM can then decide which file to read.

------------------------------------------------------------------------

# 30. First File Tools

Implement:

``` text
read_file(path)
create_file(path, content)
edit_file(path, ...)
delete_file(path)
```

For the first version, `edit_file` can use a safe replacement model such
as:

``` text
old_text
new_text
```

rather than allowing arbitrary filesystem operations.

Example:

``` json
{
  "path": "src/auth/AuthService.cpp",
  "old_text": "old implementation",
  "new_text": "new implementation"
}
```

Always validate that the target path remains inside the allowed
workspace.

------------------------------------------------------------------------

# 31. First Command Tool

Implement:

``` text
run_command(command)
```

But do NOT immediately expose unrestricted arbitrary commands to the
agent.

At minimum:

``` text
Allowed workspace
Command timeout
Output limit
Process termination
Environment isolation
```

Eventually:

``` text
run_command()
       ↓
Docker
       ↓
Repository mounted
       ↓
Command
```

For early development, you can run commands directly on your own
development machine while testing with harmless commands, then move
agent-controlled execution into Docker before giving the system broad
execution capabilities.

------------------------------------------------------------------------

# 32. Terminal Architecture

For the visible terminal:

``` text
React
 ↓
xterm.js
 ↓
WebSocket
 ↓
FastAPI
 ↓
terminal process
 ↓
stdout/stderr
 ↓
WebSocket
 ↓
xterm.js
```

For Windows, interactive terminal handling is more complicated than a
simple `subprocess.run()`. `pywinpty` can help provide Windows
pseudo-terminal support.

For a first milestone, you can start with non-interactive commands:

``` text
git status
dir
python --version
pytest
npm test
```

Then implement a fully interactive shell.

------------------------------------------------------------------------

# 33. Agent Tools

Your first tool registry should contain:

``` text
read_file
search_code
create_file
edit_file
delete_file
run_command
git_status
git_diff
```

Later:

``` text
find_symbol
find_references
find_callers
find_callees
get_dependencies
run_build
run_tests
run_linter
```

------------------------------------------------------------------------

# 34. Tool Calling Architecture

Do not make the LLM output arbitrary Python.

Use structured tool calls.

Conceptually:

``` text
LLM
 ↓
Tool call:
{
  "name": "read_file",
  "arguments": {
    "path": "src/auth/AuthService.cpp"
  }
}
 ↓
Tool Registry
 ↓
read_file()
 ↓
Tool Result
 ↓
LLM
```

This is the foundation of the agent.

------------------------------------------------------------------------

# 35. Agent Controller

Create:

``` text
backend/app/agent/controller.py
```

The controller performs:

``` text
receive task
    ↓
load repository context
    ↓
run planner
    ↓
send plan to LLM
    ↓
LLM requests tool
    ↓
execute tool
    ↓
return tool result
    ↓
LLM requests next tool
    ↓
...
    ↓
final response
```

Pseudo-flow:

``` python
while not finished:
    response = llm.chat(messages)

    if response contains tool_call:
        result = execute_tool(tool_call)
        messages.append(result)
    else:
        break
```

This is enough for the first agent.

------------------------------------------------------------------------

# 36. Planner

The Planner can initially be one LLM call.

Input:

``` text
User task
+
Repository summary
```

Output:

``` json
{
  "goal": "Fix login bug",
  "steps": [
    "Search login implementation",
    "Inspect authentication flow",
    "Identify failure",
    "Modify implementation",
    "Add or update tests",
    "Run tests"
  ],
  "files_to_investigate": [
    "src/auth/",
    "tests/auth/"
  ]
}
```

Do not build a separate autonomous Planner agent.

It is simply a structured stage.

------------------------------------------------------------------------

# 37. Agent State

Maintain state similar to:

``` json
{
  "session_id": "abc123",
  "repository": "C:\\workspace\\project",
  "task": "Fix login bug",
  "plan": {},
  "messages": [],
  "tool_calls": [],
  "files_changed": [],
  "commands": [],
  "test_results": [],
  "status": "working"
}
```

This state later feeds reporting.

------------------------------------------------------------------------

# 38. Agent Events

Create an event stream:

``` text
agent_started
planning_started
planning_completed
tool_started
tool_completed
file_changed
command_started
command_output
test_started
test_completed
agent_error
agent_completed
```

Example:

``` json
{
  "type": "tool_started",
  "tool": "search_code",
  "arguments": {
    "query": "authentication"
  }
}
```

React subscribes to this event stream through WebSocket.

The UI can display:

``` text
✓ Repository analyzed
✓ Plan generated
🔍 Searching authentication
📄 Reading AuthService.cpp
✏ Editing AuthService.cpp
▶ Running tests
✓ 42 tests passed
```

------------------------------------------------------------------------

# 39. Git Integration

Use Git from the backend.

Initial operations:

``` text
git_status()
git_diff()
create_branch()
git_log()
```

Before an agent task:

``` text
git status
```

Create an agent branch:

``` text
agent/<session-id>
```

After modification:

``` text
git diff
```

Never rely only on the LLM's description of what it changed.

The Git diff is the evidence.

------------------------------------------------------------------------

# 40. Build/Test Manager

Create:

``` text
backend/app/execution/build.py
backend/app/execution/tests.py
```

Responsibilities:

``` text
detect project type
choose build command
choose test command
run command
capture stdout
capture stderr
return exit code
```

Initially, you can require the user/project configuration to provide
commands:

``` json
{
  "build_command": "cmake --build build",
  "test_command": "ctest --test-dir build"
}
```

Later add automatic detection.

------------------------------------------------------------------------

# 41. Debug Loop

Use a hard retry limit:

``` text
MAX_AGENT_RETRIES=3
```

Flow:

``` text
Build/Test
    │
    ├── PASS ──► Review
    │
    └── FAIL
          ↓
       Error output
          ↓
          LLM
          ↓
      Find relevant code
          ↓
         Edit
          ↓
      Build/Test
          │
          └── repeat, max 3
```

If three attempts fail:

``` text
status = failed
```

and produce a report.

------------------------------------------------------------------------

# 42. Review Stage

Do not build a separate reviewer service initially.

Send the local LLM:

``` text
User request
+
Plan
+
Git diff
+
Build result
+
Test result
```

Ask for structured review:

``` json
{
  "status": "approved",
  "correctness": "good",
  "security": "good",
  "maintainability": "good",
  "regression_risk": "low",
  "unnecessary_changes": [],
  "test_adequacy": "good"
}
```

Later, make this a dedicated review stage or model.

------------------------------------------------------------------------

# 43. After Analysis

Run the same scanner after the agent finishes:

``` text
repository after
       ↓
analyzer
       ↓
after.json
```

Then compare:

``` text
baseline.json
+
after.json
+
git diff
+
test results
+
review
```

Produce:

``` text
comparison.json
```

Example:

``` json
{
  "files": {
    "before": 421,
    "after": 426,
    "change": 5
  },
  "tests": {
    "before": 820,
    "after": 847,
    "change": 27
  }
}
```

------------------------------------------------------------------------

# 44. Report Files

For the MVP:

``` text
reports/
├── baseline.json
├── change.json
├── after.json
└── comparison.json
```

Later:

``` text
baseline.md
change.md
comparison.md
```

JSON remains the internal source of truth.

------------------------------------------------------------------------

# 45. WebSocket Endpoints

Recommended initial endpoints:

``` text
/ws/agent/{session_id}
/ws/terminal/{session_id}
```

Agent:

``` text
FastAPI
 ↓
agent event
 ↓
WebSocket
 ↓
React Agent Panel
```

Terminal:

``` text
process output
 ↓
FastAPI
 ↓
WebSocket
 ↓
xterm.js
```

------------------------------------------------------------------------

# 46. REST Endpoints

Initial API:

``` text
GET  /health

POST /api/repository/open
POST /api/repository/clone

GET  /api/files
GET  /api/file
PUT  /api/file

POST /api/agent/task
POST /api/agent/stop

GET  /api/git/status
GET  /api/git/diff

POST /api/build
POST /api/test

GET  /api/reports/baseline
GET  /api/reports/comparison
```

Keep the API small.

------------------------------------------------------------------------

# 47. Recommended Frontend Components

Your first UI can contain:

``` text
App
├── TopBar
├── Explorer
├── Editor
├── AgentPanel
│   ├── TaskInput
│   ├── Plan
│   └── Activity
├── Terminal
└── StatusBar
```

Later:

``` text
DiffViewer
ReviewPanel
ReportViewer
ProblemsPanel
GitPanel
```

------------------------------------------------------------------------

# 48. Recommended Initial UI Layout

``` text
┌───────────────────────────────────────────────────────────────┐
│ Project                         ● Local Model                 │
├──────────────┬──────────────────────────────┬───────────────┤
│ EXPLORER     │ MONACO EDITOR                │ AI AGENT      │
│              │                              │               │
│ src/         │ AuthService.cpp              │ Task          │
│ ├ auth/      │                              │ Fix login bug │
│ ├ api/       │ class AuthService {          │               │
│ └ main.cpp   │     ...                      │ PLAN          │
│              │ }                            │ ✓ Search      │
│ tests/       │                              │ ✓ Inspect     │
│              │                              │ → Modify      │
│ README.md    │                              │               │
├──────────────┴──────────────────────────────┴───────────────┤
│ TERMINAL                                                     │
│ $ pytest                                                     │
│ ✓ 42 passed                                                  │
└───────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 49. Development Commands

## Frontend

``` powershell
cd desktop
npm install
npm run dev
```

## Backend

``` powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## llama.cpp

Example:

``` powershell
llama-server.exe `
  -m "C:\models\coding-model.gguf" `
  -c 8192 `
  --host 127.0.0.1 `
  --port 8080
```

## Docker

``` powershell
docker version
docker run hello-world
```

------------------------------------------------------------------------

# 50. Development Ports

Use fixed local ports:

``` text
5173 → Vite
8000 → FastAPI
8080 → llama.cpp
```

Architecture:

``` text
Electron
   │
   ├── React/Vite → 5173
   │
   └── FastAPI → 8000
                   │
                   └── llama.cpp → 8080
```

In production, Electron can load the built frontend directly instead of
relying on Vite.

------------------------------------------------------------------------

# 51. Running Everything During Development

Open three terminals.

### Terminal 1 --- Frontend

``` powershell
cd C:\dev\ai-coding-environment\desktop
npm run dev
```

### Terminal 2 --- Backend

``` powershell
cd C:\dev\ai-coding-environment\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 3 --- Local LLM

``` powershell
llama-server.exe `
  -m "C:\models\coding-model.gguf" `
  -c 8192 `
  --host 127.0.0.1 `
  --port 8080
```

Then launch Electron.

------------------------------------------------------------------------

# 52. Eventually Run All Three Automatically

After the individual pieces work, configure Electron development to
start:

``` text
Vite
FastAPI
llama.cpp
Electron
```

automatically.

Do NOT do this first.

First make each component independently reliable.

------------------------------------------------------------------------

# 53. Basic MVP Milestones

## Milestone 1 --- Desktop Shell

Success means:

``` text
Electron opens
React renders
```

------------------------------------------------------------------------

## Milestone 2 --- Editor

Success means:

``` text
Open repository
↓
File Explorer
↓
Click file
↓
Monaco displays file
```

------------------------------------------------------------------------

## Milestone 3 --- Terminal

Success means:

``` text
Open terminal
↓
Run command
↓
See output
```

------------------------------------------------------------------------

## Milestone 4 --- Local LLM

Success means:

``` text
Python
↓
llama.cpp
↓
GGUF model
↓
Response
```

------------------------------------------------------------------------

## Milestone 5 --- First Tool

Success means:

``` text
LLM
↓
read_file()
↓
file content
↓
LLM
```

------------------------------------------------------------------------

## Milestone 6 --- Search

Success means:

``` text
LLM
↓
search_code()
↓
repository results
↓
LLM
```

------------------------------------------------------------------------

## Milestone 7 --- Editing

Success means:

``` text
LLM
↓
edit_file()
↓
file changed
↓
Monaco shows change
```

------------------------------------------------------------------------

## Milestone 8 --- Agent Loop

Success means:

``` text
LLM
 ↓
Search
 ↓
Read
 ↓
Edit
 ↓
Read
 ↓
Test
 ↓
Finish
```

This is your first genuine coding agent.

------------------------------------------------------------------------

## Milestone 9 --- Git

Success means:

``` text
Agent changes
↓
git diff
↓
UI shows diff
```

------------------------------------------------------------------------

## Milestone 10 --- Build/Test

Success means:

``` text
Agent changes
↓
Build
↓
Tests
↓
PASS / FAIL
```

------------------------------------------------------------------------

## Milestone 11 --- Debug

Success means:

``` text
FAIL
 ↓
LLM
 ↓
Fix
 ↓
Test
 ↓
PASS
```

with a maximum of three attempts.

------------------------------------------------------------------------

## Milestone 12 --- Analyzer

Success means:

``` text
Repository
↓
Scan
↓
baseline.json
```

and after modification:

``` text
Repository
↓
Scan
↓
after.json
```

------------------------------------------------------------------------

## Milestone 13 --- Comparison

Success means:

``` text
baseline.json
+
after.json
+
git diff
+
tests
↓
comparison.json
```

------------------------------------------------------------------------

# 54. Final MVP Architecture

When all milestones are complete:

``` text
                       ELECTRON
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    Explorer           Monaco             Agent UI
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                      REST / WS
                           │
                           ▼
                        FastAPI
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
 Repository             Agent              Analyzer
 Manager               Controller
                           │
                      ┌────▼────┐
                      │ Planner │
                      └────┬────┘
                           │
                      ┌────▼────┐
                      │ llama   │
                      │ .cpp    │
                      └────┬────┘
                           │
                         GGUF
                           │
                           ▼
                        Tool Loop
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
       Filesystem          Git          Commands
                                            │
                                            ▼
                                         Docker
                                            │
                                      Build / Tests
                                            │
                                            ▼
                                          Review
                                            │
                                            ▼
                                       After Scan
                                            │
                                            ▼
                                       Comparison
                                            │
                                            ▼
                                         Reports
```

------------------------------------------------------------------------

# 55. What You Should NOT Build Yet

Do not add these to the first implementation:

``` text
❌ Vector database
❌ Traditional RAG
❌ PostgreSQL
❌ Redis
❌ Celery
❌ Kubernetes
❌ Microservices
❌ Graph database
❌ Multiple autonomous agents
❌ Cloud LLM
❌ Internet research
❌ LSP for every language
❌ Advanced code graph
```

First prove the core loop.

------------------------------------------------------------------------

# 56. First Complete Demonstration

Your first end-to-end demo should be something small.

Example repository:

``` text
simple Python project
```

Task:

``` text
Fix the failing login function and add a test.
```

The system should visibly perform:

``` text
1. Open repository
2. Scan repository
3. Generate baseline
4. User enters task
5. Planner generates plan
6. Local LLM starts
7. search_code("login")
8. read_file("login.py")
9. read_file("test_login.py")
10. edit_file("login.py")
11. edit_file("test_login.py")
12. git diff
13. run tests
14. If failed → debug
15. Tests pass
16. Review diff
17. Run after-analysis
18. Generate comparison
19. Show final report
```

If this works, you have the fundamental system.

------------------------------------------------------------------------

# 57. Recommended Implementation Order

Follow this exact order:

``` text
PHASE 1
Electron + React + Vite
        ↓
PHASE 2
Monaco
        ↓
PHASE 3
File Explorer
        ↓
PHASE 4
FastAPI
        ↓
PHASE 5
xterm.js + WebSocket
        ↓
PHASE 6
llama.cpp connection
        ↓
PHASE 7
read_file()
        ↓
PHASE 8
search_code()
        ↓
PHASE 9
edit_file()
        ↓
PHASE 10
Agent tool loop
        ↓
PHASE 11
Git diff / branch
        ↓
PHASE 12
Build / tests
        ↓
PHASE 13
Debug loop
        ↓
PHASE 14
Baseline analyzer
        ↓
PHASE 15
After analyzer
        ↓
PHASE 16
Comparison
        ↓
PHASE 17
Reports
```

Do not move to Phase 10 until Phases 1--9 are individually working.

------------------------------------------------------------------------

# 58. Definition of Done for the First Version

The first version is successful when this works locally:

``` text
┌──────────────────────────────────────────────┐
│              Desktop Application             │
│                                              │
│  Open Repository                             │
│       ↓                                      │
│  Browse Files                                │
│       ↓                                      │
│  Open File in Monaco                         │
│       ↓                                      │
│  Ask Local LLM                               │
│       ↓                                      │
│  Agent Searches Repository                   │
│       ↓                                      │
│  Agent Reads Files                           │
│       ↓                                      │
│  Agent Edits Files                           │
│       ↓                                      │
│  Git Diff Appears                            │
│       ↓                                      │
│  Build / Test                                │
│       ↓                                      │
│  Agent Fixes Failure if Necessary            │
│       ↓                                      │
│  Final Result                                │
└──────────────────────────────────────────────┘
```

After this works, add the more sophisticated software-engineering
analysis pipeline.

------------------------------------------------------------------------

# 59. Final Technology Checklist

Before starting implementation:

-   [ ] Node.js LTS installed
-   [ ] npm working
-   [ ] Git installed
-   [ ] Python installed
-   [ ] Python virtual environment working
-   [ ] Docker Desktop installed
-   [ ] Docker working
-   [ ] ripgrep installed
-   [ ] llama.cpp built/available
-   [ ] GGUF coding model available
-   [ ] llama.cpp server starts
-   [ ] llama.cpp API responds
-   [ ] React/Vite project created
-   [ ] Electron installed
-   [ ] Monaco installed
-   [ ] xterm.js installed
-   [ ] FastAPI installed
-   [ ] FastAPI `/health` works
-   [ ] Frontend can call FastAPI
-   [ ] WebSocket connection works
-   [ ] Repository can be opened
-   [ ] File can be read
-   [ ] File can be searched
-   [ ] File can be edited
-   [ ] Git diff works
-   [ ] Test command works
-   [ ] Local LLM can call tools
-   [ ] Agent loop works

------------------------------------------------------------------------

# 60. Key Principle

Keep this architecture simple:

``` text
Electron
    ↓
React UI
    ↓
FastAPI
    ↓
Agent Controller
    ↓
Local llama.cpp
    ↓
Tool calls
    ↓
Real repository
    ↓
Real execution
    ↓
Real test results
```

The model should never be treated as the authority about the repository.

The repository, filesystem, Git diff, compiler, tests, static analysis,
and execution results are the evidence.

That is what turns the application from a chat interface that generates
code into a genuine software-engineering environment.
