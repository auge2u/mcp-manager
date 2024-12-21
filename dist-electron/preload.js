"use strict";
const electron = require("electron");
const outputListeners = /* @__PURE__ */ new Set();
const errorListeners = /* @__PURE__ */ new Set();
electron.contextBridge.exposeInMainWorld("electron", {
  readConfig: () => {
    console.log("Invoking readConfig from preload");
    return electron.ipcRenderer.invoke("read-config");
  },
  executeCommand: (command) => {
    console.log("Invoking executeCommand from preload:", command);
    return electron.ipcRenderer.invoke("execute-command", command);
  },
  // New MCP management functions
  launchMCP: (config) => {
    console.log("Launching MCP:", config);
    return electron.ipcRenderer.invoke("launch-mcp", config);
  },
  // MCP event listeners
  onMCPOutput: (callback) => {
    outputListeners.add(callback);
    return () => outputListeners.delete(callback);
  },
  onMCPError: (callback) => {
    errorListeners.add(callback);
    return () => errorListeners.delete(callback);
  }
});
electron.ipcRenderer.on("mcp-output", (_event, data) => {
  outputListeners.forEach((callback) => callback(data));
});
electron.ipcRenderer.on("mcp-error", (_event, data) => {
  errorListeners.forEach((callback) => callback(data));
});
