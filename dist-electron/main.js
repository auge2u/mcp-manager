"use strict";
const electron = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const node_fs = require("node:fs");
const os = require("node:os");
const node_child_process = require("node:child_process");
const node_util = require("node:util");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
let mainWindow = null;
async function createWindow() {
  if (mainWindow) return;
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    center: true,
    minWidth: 800,
    minHeight: 600,
    title: "MCP-Aurelius-Kline-Claude",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path__namespace.join(__dirname, "preload.js"),
      webSecurity: true,
      devTools: true
    },
    show: false,
    backgroundColor: "#f2f1e9",
    titleBarStyle: "default",
    frame: true,
    autoHideMenuBar: false
  });
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
          "script-src * 'unsafe-inline' 'unsafe-eval';",
          "connect-src * 'unsafe-inline';",
          "img-src * data: blob: 'unsafe-inline';",
          "frame-src *;",
          "style-src * 'unsafe-inline';"
        ].join(" ")
      }
    });
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorCode, errorDescription);
      setTimeout(() => {
        mainWindow == null ? void 0 : mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "");
      }, 1e3);
    });
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
  });
  const configPath = path__namespace.join(os__namespace.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  console.log("Config path:", configPath);
  try {
    const configExists = node_fs.existsSync(configPath);
    console.log("Config exists:", configExists);
    if (configExists) {
      const config = node_fs.readFileSync(configPath, "utf8");
      console.log("Config content:", config);
    }
  } catch (error) {
    console.error("Error checking config:", error);
  }
  try {
    if (process.env.VITE_DEV_SERVER_URL) {
      console.log("Loading dev server URL:", process.env.VITE_DEV_SERVER_URL);
      await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
      mainWindow.webContents.openDevTools();
      mainWindow.webContents.on("did-fail-load", (_, errorCode, errorDescription) => {
        console.error(`Page load failed: ${errorCode} - ${errorDescription}`);
        if (mainWindow) {
          showErrorPage(mainWindow, `Failed to load development server: ${errorDescription}`);
        }
      });
    } else {
      console.log("Loading production build");
      await mainWindow.loadFile("dist/index.html");
    }
  } catch (error) {
    console.error("Error loading window content:", error);
    if (mainWindow) {
      showErrorPage(mainWindow, error instanceof Error ? error.message : String(error));
    }
  }
  electron.ipcMain.handle("launch-mcp", async (_event, config) => {
    var _a, _b;
    try {
      const { command, args = [], env = {}, projectId } = config;
      const processEnv = {
        ...process.env,
        ...env,
        MCP_PROJECT_ID: projectId || "default",
        MCP_WORKSPACE_PATH: electron.app.getPath("userData")
      };
      const mcpProcess = node_child_process.exec(`${command} ${args.join(" ")}`, {
        env: processEnv
      });
      (_a = mcpProcess.stdout) == null ? void 0 : _a.on("data", (data) => {
        console.log(`MCP output: ${data}`);
        mainWindow == null ? void 0 : mainWindow.webContents.send("mcp-output", data);
      });
      (_b = mcpProcess.stderr) == null ? void 0 : _b.on("data", (data) => {
        console.error(`MCP error: ${data}`);
        mainWindow == null ? void 0 : mainWindow.webContents.send("mcp-error", data);
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to launch MCP:", error);
      throw error;
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
electron.app.whenReady().then(createWindow);
electron.app.on("activate", () => {
  if (!mainWindow) {
    createWindow();
  }
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
function showErrorPage(window, errorMessage) {
  const errorHtml = `
        <html>
            <head>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        padding: 2rem;
                        background: #f2f1e9;
                    }
                    .error-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 { color: #e53e3e; margin-top: 0; }
                    pre { 
                        background: #f7fafc;
                        padding: 1rem;
                        border-radius: 4px;
                        overflow-x: auto;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>Error Loading Content</h1>
                    <p>An error occurred while loading the application:</p>
                    <pre>${errorMessage}</pre>
                    <p>Please check the console for more details.</p>
                </div>
            </body>
        </html>
    `;
  window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
}
electron.ipcMain.handle("read-config", async () => {
  try {
    const configPath = path__namespace.join(os__namespace.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
    console.log("Reading config from:", configPath);
    const exists = node_fs.existsSync(configPath);
    console.log("Config file exists:", exists);
    const data = await fs__namespace.readFile(configPath, "utf8");
    console.log("Config data:", data);
    const parsedData = JSON.parse(data);
    console.log("Parsed config:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error reading config:", error);
    throw error;
  }
});
electron.ipcMain.handle("execute-command", async (_event, command) => {
  const execAsync = node_util.promisify(node_child_process.exec);
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log("Command output:", stdout);
    if (stderr) console.error("Command stderr:", stderr);
    return { success: true, output: stdout };
  } catch (error) {
    console.error("Command error:", error);
    throw error;
  }
});
