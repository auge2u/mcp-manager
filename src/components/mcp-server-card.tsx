import { EnvConfig } from "./server-configs/env-config"
import { FilesystemConfig } from "./server-configs/filesystem-config"
import { ObsidianConfig } from "./server-configs/obsidian-config"
import { PostgresConfig } from "./server-configs/postgres-config"
import { SentryConfig } from "./server-configs/sentry-config"
import { SQLiteConfig } from "./server-configs/sqlite-config"
import { TerminalCommand } from "./terminal-command"
import { SERVER_CONFIGS } from "../server-configs"
import { ArrowUpRight, Trash2, AlertCircle } from "lucide-react"
import { validateServerConfig } from "../utils/config-validator"

type MCPServerConfig = {
	command: string
	args: string[]
	env?: Record<string, string>
}

type MCPServerCardProps = {
	serverName: string
	config: MCPServerConfig
	icon?: string
	onUpdate: (name: string, newConfig: MCPServerConfig) => void
	onDelete: (name: string) => void
}

export function MCPServerCard({
	serverName,
	config,
	icon,
	onUpdate,
	onDelete
}: MCPServerCardProps) {
	const serverConfig = SERVER_CONFIGS[serverName as keyof typeof SERVER_CONFIGS]
	const validationResult = validateServerConfig(serverName, serverConfig)

	const handleFilesystemUpdate = (paths: string[]) => {
		const newConfig = {
			...config,
			args: [...config.args.slice(0, 2), ...paths]
		}
		onUpdate(serverName, newConfig)
	}

	const handlePostgresUpdate = (url: string) => {
		const newConfig = {
			...config,
			args: [...config.args.slice(0, 2), url]
		}
		onUpdate(serverName, newConfig)
	}

	const handleEnvUpdate = (key: string, value: string) => {
		const newConfig = {
			...config,
			env: {
				...(config.env || {}),
				[key]: value
			}
		}
		onUpdate(serverName, newConfig)
	}

	const handleSqliteUpdate = (dbPath: string) => {
		const newConfig = {
			...config,
			args: [
				"--directory",
				"parent_of_servers_repo/servers/src/sqlite",
				"run",
				"mcp-server-sqlite",
				"--db-path",
				dbPath
			]
		}
		onUpdate(serverName, newConfig)
	}

	const handleObsidianUpdate = (path: string) => {
		const newConfig = {
			...config,
			args: [...config.args.slice(0, 2), path]
		}
		onUpdate(serverName, newConfig)
	}

	const handleSentryUpdate = (token: string) => {
		const newConfig = {
			...config,
			args: [...config.args.slice(0, 2), token]
		}
		onUpdate(serverName, newConfig)
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		onDelete(serverName)
	}

	const isFilesystemServer = serverName === "filesystem"
	const isPostgresServer = serverName === "postgres"
	const isSqliteServer = serverName === "sqlite"
	const isObsidianServer = serverName === "obsidian"
	const isSentryServer = serverName === "sentry"
	const iconUrl = icon || serverConfig?.icon

	return (
		<div className="join join-vertical w-full">
			<div className="collapse collapse-arrow join-item border border-base-300 bg-white p-4">
				<input type="checkbox" defaultChecked />
				<div className="collapse-title">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{iconUrl && (
								<img
									src={iconUrl}
									alt={`${serverName} icon`}
									className="w-20 h-12 object-contain"
									onError={(e) => {
										e.currentTarget.style.display = "none"
									}}
								/>
							)}
							<h3 className="text-lg capitalize">{serverName}</h3>
						</div>
						{!validationResult.isValid && (
							<div className="tooltip tooltip-left" data-tip={validationResult.errors.map(e => e.message).join('\n')}>
								<AlertCircle className="w-5 h-5 text-error" />
							</div>
						)}
					</div>
				</div>
				<div className="collapse-content">
					{!validationResult.isValid && (
						<div className="alert alert-error mb-4">
							<div>
								<h4 className="font-bold">Configuration Errors:</h4>
								<ul className="list-disc list-inside">
									{validationResult.errors.map((error, index) => (
										<li key={index}>
											{error.field}: {error.message}
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					{isFilesystemServer ? (
						<FilesystemConfig
							initialPaths={config.args.slice(2)}
							onUpdate={handleFilesystemUpdate}
						/>
					) : isPostgresServer ? (
						<PostgresConfig
							initialUrl={config.args[2]}
							onUpdate={handlePostgresUpdate}
						/>
					) : isSqliteServer ? (
						<SQLiteConfig
							initialPath={config.args[5]}
							onUpdate={handleSqliteUpdate}
						/>
					) : isObsidianServer ? (
						<ObsidianConfig
							initialPath={config.args[2]}
							onUpdate={handleObsidianUpdate}
						/>
					) : isSentryServer ? (
						<SentryConfig
							initialToken={config.args[2]}
							onUpdate={handleSentryUpdate}
						/>
					) : serverConfig?.env &&
					  Object.keys(serverConfig.env).length > 0 ? (
						<EnvConfig
							env={serverConfig.env}
							initialValues={config.env || {}}
							onUpdate={handleEnvUpdate}
						/>
					) : null}

					{serverConfig?.docsUrl ===
						"https://github.com/cloudflare/mcp-server-cloudflare" && (
						<div className="bg-base-200 rounded-xl p-4 space-y-4">
							<p className="text-sm text-gray-600">
								MCP Manager can't update this server directly,
								please run this terminal command to modify this
								server.
							</p>
							<TerminalCommand
								command={
									serverConfig?.setupCommands?.command ?? ""
								}
							/>
						</div>
					)}
				</div>
				<div className="flex justify-end">
					<div className="flex gap-2 mb-4 mr-2">
						<button
							type="button"
							onClick={() =>
								window.open(serverConfig?.docsUrl, "_blank")
							}
							className="btn btn-sm btn-secondary"
						>
							<ArrowUpRight className="w-4 h-4" />
							<span>Docs</span>
						</button>
					</div>
					<div className="flex gap-2 mb-4 mr-4 justify-end">
						<button
							type="button"
							onClick={handleDelete}
							className="btn btn-sm bg-red-50 hover:bg-red-100"
						>
							<Trash2 className="w-4 h-4" />
							<span>Delete</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
