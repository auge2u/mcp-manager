import { contextBridge, ipcRenderer } from 'electron'

// Type definitions for MCP configuration
interface MCPConfig {
    command: string
    args?: string[]
    env?: Record<string, string>
    projectId?: string
}

// Create type-safe event emitter for MCP events
type MCPEventCallback = (data: string) => void
const outputListeners = new Set<MCPEventCallback>()
const errorListeners = new Set<MCPEventCallback>()

// Expose APIs to renderer using contextBridge
contextBridge.exposeInMainWorld('electron', {
    readConfig: () => {
        console.log('Invoking readConfig from preload')
        return ipcRenderer.invoke('read-config')
    },
    executeCommand: (command: string) => {
        console.log('Invoking executeCommand from preload:', command)
        return ipcRenderer.invoke('execute-command', command)
    },
    // New MCP management functions
    launchMCP: (config: MCPConfig) => {
        console.log('Launching MCP:', config)
        return ipcRenderer.invoke('launch-mcp', config)
    },
    // MCP event listeners
    onMCPOutput: (callback: MCPEventCallback) => {
        outputListeners.add(callback)
        return () => outputListeners.delete(callback)
    },
    onMCPError: (callback: MCPEventCallback) => {
        errorListeners.add(callback)
        return () => errorListeners.delete(callback)
    }
})

// Handle MCP events from main process
ipcRenderer.on('mcp-output', (_event, data) => {
    outputListeners.forEach(callback => callback(data))
})

ipcRenderer.on('mcp-error', (_event, data) => {
    errorListeners.forEach(callback => callback(data))
})

// This is needed for TypeScript
export {}
