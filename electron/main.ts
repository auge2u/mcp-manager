import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import * as os from 'node:os'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

let mainWindow: BrowserWindow | null = null

async function createWindow() {
    if (mainWindow) return
    
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        center: true,
        minWidth: 800,
        minHeight: 600,
        title: 'MCP-Aurelius-Kline-Claude',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true,
            devTools: true
        },
        show: false,
        backgroundColor: '#f2f1e9',
        titleBarStyle: 'default',
        frame: true,
        autoHideMenuBar: false
    })

    // Set Content Security Policy
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
                    "script-src * 'unsafe-inline' 'unsafe-eval';",
                    "connect-src * 'unsafe-inline';",
                    "img-src * data: blob: 'unsafe-inline';",
                    "frame-src *;",
                    "style-src * 'unsafe-inline';"
                ].join(' ')
            }
        })
    })

    // Enable remote debugging in development
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('Failed to load:', errorCode, errorDescription);
            setTimeout(() => {
                mainWindow?.loadURL(process.env.VITE_DEV_SERVER_URL || '');
            }, 1000);
        });
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show()
    })

    const configPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
    console.log('Config path:', configPath)
    try {
        const configExists = existsSync(configPath)
        console.log('Config exists:', configExists)
        if (configExists) {
            const config = readFileSync(configPath, 'utf8')
            console.log('Config content:', config)
        }
    } catch (error) {
        console.error('Error checking config:', error)
    }

    try {
        if (process.env.VITE_DEV_SERVER_URL) {
            console.log('Loading dev server URL:', process.env.VITE_DEV_SERVER_URL)
            await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
            
            // Open dev tools in development
            mainWindow.webContents.openDevTools()
            
            // Add error handling for development
            mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDescription) => {
                console.error(`Page load failed: ${errorCode} - ${errorDescription}`)
                if (mainWindow) {
                    showErrorPage(mainWindow, `Failed to load development server: ${errorDescription}`)
                }
            })
        } else {
            console.log('Loading production build')
            await mainWindow.loadFile('dist/index.html')
        }
    } catch (error) {
        console.error('Error loading window content:', error)
        if (mainWindow) {
            showErrorPage(mainWindow, error instanceof Error ? error.message : String(error))
        }
    }

    // Register IPC handlers for MCP process management
    ipcMain.handle('launch-mcp', async (_event: IpcMainInvokeEvent, config: {
        command: string;
        args?: string[];
        env?: Record<string, string>;
        projectId?: string;
    }) => {
        try {
            const { command, args = [], env = {}, projectId } = config
            
            // Add project isolation through environment variables
            const processEnv = {
                ...process.env,
                ...env,
                MCP_PROJECT_ID: projectId || 'default',
                MCP_WORKSPACE_PATH: app.getPath('userData')
            }
            
            const mcpProcess = exec(`${command} ${args.join(' ')}`, {
                env: processEnv,
            })
            
            mcpProcess.stdout?.on('data', (data) => {
                console.log(`MCP output: ${data}`)
                mainWindow?.webContents.send('mcp-output', data)
            })
            
            mcpProcess.stderr?.on('data', (data) => {
                console.error(`MCP error: ${data}`)
                mainWindow?.webContents.send('mcp-error', data)
            })
            
            return { success: true }
        } catch (error) {
            console.error('Failed to launch MCP:', error)
            throw error
        }
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(createWindow)

app.on('activate', () => {
    if (!mainWindow) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Helper function to show error page
function showErrorPage(window: BrowserWindow, errorMessage: string) {
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
    `
    window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
}

ipcMain.handle('read-config', async () => {
    try {
        const configPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
        console.log('Reading config from:', configPath)
        
        const exists = existsSync(configPath)
        console.log('Config file exists:', exists)
        
        const data = await fs.readFile(configPath, 'utf8')
        console.log('Config data:', data)
        
        const parsedData = JSON.parse(data)
        console.log('Parsed config:', parsedData)
        
        return parsedData
    } catch (error) {
        console.error('Error reading config:', error)
        throw error
    }
})

ipcMain.handle('execute-command', async (_event: IpcMainInvokeEvent, command: string) => {
    const execAsync = promisify(exec)
    try {
        const { stdout, stderr } = await execAsync(command)
        console.log('Command output:', stdout)
        if (stderr) console.error('Command stderr:', stderr)
        return { success: true, output: stdout }
    } catch (error) {
        console.error('Command error:', error)
        throw error
    }
})
