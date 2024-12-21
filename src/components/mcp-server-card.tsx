import { capitalizeFirstLetter } from "../utils"
import { getDefaultProjectId } from "../server-configs"
import { useEffect, useState } from "react"

type MCPServer = {
	command: string
	args: string[]
	env?: Record<string, string>
	projectId?: string
}

type MCPServerCardProps = {
	serverName: string
	config: MCPServer
	icon?: string
	onUpdate: (name: string, config: MCPServer) => void
	onDelete: (name: string) => void
}

export function MCPServerCard({
	serverName,
	config,
	icon,
	onUpdate,
	onDelete
}: MCPServerCardProps) {
    const [isRunning, setIsRunning] = useState(false)
    const [output, setOutput] = useState<string[]>([])
    const [projectId, setProjectId] = useState(config.projectId || getDefaultProjectId(config.args[0]) || '')
    const [showOutput, setShowOutput] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null)

    useEffect(() => {
        if (isRunning) {
            setConnectionStatus('connecting')
            const removeOutputListener = window.electron.onMCPOutput((data) => {
                setOutput(prev => [...prev, `[OUT] ${data}`])
                // Update connection status based on output
                if (data.includes('Server started') || data.includes('Listening')) {
                    setConnectionStatus('connected')
                    setLastHeartbeat(new Date())
                }
            })
            
            const removeErrorListener = window.electron.onMCPError((data) => {
                setOutput(prev => [...prev, `[ERR] ${data}`])
                if (data.includes('Error') || data.includes('Failed')) {
                    setConnectionStatus('disconnected')
                }
            })

            // Heartbeat check interval
            const heartbeatInterval = setInterval(() => {
                if (lastHeartbeat) {
                    const timeSinceHeartbeat = Date.now() - lastHeartbeat.getTime()
                    if (timeSinceHeartbeat > 10000) { // 10 seconds
                        setConnectionStatus('disconnected')
                    }
                }
            }, 5000)

            return () => {
                removeOutputListener()
                removeErrorListener()
                clearInterval(heartbeatInterval)
                setConnectionStatus('disconnected')
            }
        } else {
            setConnectionStatus('disconnected')
        }
    }, [isRunning, lastHeartbeat])

    const handleStart = async () => {
        try {
            const result = await window.electron.launchMCP({
                ...config,
                projectId
            })
            if (result.success) {
                setIsRunning(true)
                setOutput([])
            }
        } catch (error) {
            console.error(`Failed to start ${serverName}:`, error)
            setOutput(prev => [...prev, `Failed to start: ${error}`])
        }
    }
    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-green-500'
            case 'connecting':
                return 'bg-yellow-500 animate-pulse'
            case 'disconnected':
                return 'bg-red-500'
        }
    }

    return (
        <div className={`bg-white rounded-3xl p-6 relative shadow-lg hover:shadow-xl transition-shadow duration-300 ${
            config.args[0].includes('/Documents/Cline/MCP/') ? 'border-2 border-primary' : ''
        }`}>
            {config.args[0].includes('/Documents/Cline/MCP/') && (
                <div className="absolute -top-3 left-6 bg-primary text-white px-3 py-1 rounded-full text-xs">
                    Active Claude Instance
                </div>
            )}
            {/* Status Indicator */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <span className="text-sm capitalize">{connectionStatus}</span>
                {lastHeartbeat && connectionStatus === 'connected' && (
                    <span className="text-xs opacity-50">
                        Last heartbeat: {lastHeartbeat.toLocaleTimeString()}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-6">
                <div className="my-auto">
                    {icon && (
                        <img
                            src={icon}
                            alt={`${serverName} icon`}
                            className="w-10 h-10 object-contain"
                        />
                    )}
                </div>
                <div className="flex flex-col flex-grow">
                    <span className="text-xl font-normal mb-1">
                        {capitalizeFirstLetter(serverName)}
                    </span>
                    <div className="space-y-1">
                        <div className="text-sm opacity-80">
                            <code className="bg-base-300 px-2 py-1 rounded">
                                {config.command} {config.args.join(" ")}
                            </code>
                        </div>
                        {config.args[0].includes('/github/habitusnet/') && (
                            <div className="text-xs opacity-60">
                                VSCode Project: {getDefaultProjectId(config.args[0])}
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="Project ID (optional)"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="input input-sm input-bordered w-48 mr-2"
                        />
                        <button
                            type="button"
                            className={`btn btn-sm ${isRunning ? 'btn-error' : 'btn-primary'} mr-2`}
                            onClick={isRunning ? () => setIsRunning(false) : handleStart}
                        >
                            {isRunning ? 'Stop' : 'Start'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setShowOutput(!showOutput)}
                        >
                            {showOutput ? 'Hide Output' : 'Show Output'}
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onDelete(serverName)}
                >
                    Remove
                </button>
            </div>
            {showOutput && (
                <div className="mt-4">
                    <div className="bg-base-300 rounded p-2 max-h-40 overflow-y-auto">
                        {output.length === 0 ? (
                            <p className="text-sm opacity-50">No output yet</p>
                        ) : (
                            output.map((line, i) => (
                                <pre key={i} className="text-sm whitespace-pre-wrap">{line}</pre>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
