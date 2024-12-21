import { ApplyingInstructions } from "./components/applying-instructions"
import { LoadingInstructions } from "./components/loading-instructions"
import { MCPServers } from "./components/mcp-servers"
import { SERVER_CONFIGS } from "./server-configs"
import {
	type MCPConfig,
	checkForConfigFile,
	validateServerConfig
} from "./utils"
import type React from "react"
import { useEffect, useState } from "react"

function App() {
	const [jsonContent, setJsonContent] = useState<MCPConfig>({
		mcpServers: {}
	})
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "success" | "error"
	>("idle")
	const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	// Check for config file on component mount
	useEffect(() => {
		const loadConfig = async () => {
			try {
				const config = await checkForConfigFile()
				if (config && validateServerConfig(config)) {
					setJsonContent(config)
					setUploadStatus("success")
					setIsInstructionsOpen(false)
				} else {
					setIsInstructionsOpen(true)
				}
			} catch (err) {
				setIsInstructionsOpen(true)
			} finally {
				setIsLoading(false)
			}
		}
		loadConfig()
	}, [])

	const handleJsonInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		try {
			const content = JSON.parse(e.target.value)
			if (validateServerConfig(content)) {
				setJsonContent(content)
				setUploadStatus("success")
				setIsInstructionsOpen(false)
			} else {
				throw new Error("Invalid server configuration")
			}
		} catch (error) {
			setUploadStatus("error")
		}
	}

	const handleServerAdd = (serverType: string) => {
		const serverConfig = SERVER_CONFIGS[serverType as keyof typeof SERVER_CONFIGS]

		if (!serverConfig.command || !serverConfig.args) {
			return
		}

		const newServer = {
			command: serverConfig.command,
			args: serverConfig.args,
			...(serverConfig.env && { env: serverConfig.env })
		}

		setJsonContent({
			...jsonContent,
			mcpServers: {
				...jsonContent.mcpServers,
				[serverType]: newServer
			}
		})
	}

	const handleServerRemove = (serverType: string) => {
		if (jsonContent.mcpServers[serverType]) {
			const { [serverType]: _, ...rest } = jsonContent.mcpServers
			setJsonContent({
				...jsonContent,
				mcpServers: rest
			})
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen bg-[#f2f1e9]">
				<div className="bg-white p-8 rounded-2xl shadow-lg">
					<span className="text-lg">Loading configuration...</span>
				</div>
			</div>
		)
	}

	return (
		<main className="h-screen overflow-y-auto bg-[#f2f1e9]">
			<div className="container mx-auto px-8 py-4 max-w-4xl min-h-screen">
				<div className="flex justify-between items-center mb-8">
					<div className="flex items-center gap-4">
						<div className="flex items-center justify-center rounded-xl h-8 px-4 border-2 border-black/20">
							<img
								src="/mcp-logo.svg"
								alt="MCP Manager"
								className="h-4"
							/>
						</div>
						<div className="flex items-center justify-center rounded-xl px-4 h-8 border-2 border-primary/30">
							<img
								src="/claude-logo.svg"
								alt="Claude"
								className="h-3"
							/>
						</div>
					</div>
					<button
						type="button"
						className="btn btn-ghost btn-circle"
						onClick={() => {
							const modal = document.getElementById(
								"info_modal"
							) as HTMLDialogElement
							if (modal) {
								modal.showModal()
							}
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>

				<div className="mb-8">
					<h1 className="text-3xl font-light">
						MCP-Aurelius-Kline-Claude
					</h1>
					<p className="text-sm opacity-70 mt-1">
						MCP-Tasks-Project-Vision-Conflict-Resolution
					</p>
				</div>

				<dialog id="info_modal" className="modal backdrop-blur-sm">
					<div className="modal-box rounded-3xl">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl">About</h3>
							<button
								type="button"
								className="btn btn-ghost btn-sm btn-circle"
								onClick={() => {
									const modal = document.getElementById(
										"info_modal"
									) as HTMLDialogElement
									if (modal) {
										modal.close()
									}
								}}
							>
								✕
							</button>
						</div>
						<div className="space-y-4">
							<p>
								Give Claude access to private data, APIs, and other
								services using the Model Context Protocol so it can
								answer questions and perform actions on your behalf.
							</p>
							<p>
								This is a web-based GUI to help you install and
								manage MCP servers in your Claude App.
							</p>
							<div className="flex flex-col space-y-2">
								<a
									href="https://modelcontextprotocol.io"
									className="link"
									target="_blank"
									rel="noreferrer"
								>
									MCP Documentation
								</a>
								<a
									href="https://www.anthropic.com/news/model-context-protocol"
									className="link"
									target="_blank"
									rel="noreferrer"
								>
									Anthropic's Announcement
								</a>
							</div>
						</div>
					</div>
				</dialog>

				<div className="space-y-6">
					{isInstructionsOpen && (
						<LoadingInstructions
							isOpen={isInstructionsOpen}
							onOpenChange={setIsInstructionsOpen}
							onJsonInput={handleJsonInput}
							uploadStatus={uploadStatus}
						/>
					)}

					{Object.keys(jsonContent.mcpServers).length > 0 &&
						uploadStatus === "success" && (
							<div className="space-y-6">
								<MCPServers
									jsonContent={jsonContent}
									onUpdate={setJsonContent}
									onServerAdd={handleServerAdd}
									onServerRemove={handleServerRemove}
								/>

								<ApplyingInstructions
									jsonContent={jsonContent}
								/>
							</div>
						)}
				</div>
				<div className="flex flex-col items-center mt-16 mb-8">
					<a href="https://zue.ai" target="_blank" rel="noreferrer">
						<div className="flex items-center justify-center rounded-2xl p-10 h-16 border-2 border-black/10 hover:bg-primary/20 transition-all ease-in-out duration-300 shadow-md hover:shadow-lg">
							<img
								src="/logo_zue.svg"
								alt="zue.ai"
								className="h-8"
							/>
						</div>
					</a>
				</div>
				<div className="flex justify-center my-8 flex-col">
					<span className="text-md text-center">
						Made with ❤️ by zue. You can view the{" "}
						<a
							href="https://github.com/zueai/mcp-manager"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							source code on GitHub
						</a>
						.
						<br />
						<a
							href="https://zue.ai/talk-to-us"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							Contact us
						</a>{" "}
						for custom AI automation solutions and product
						development.
					</span>
					<span className="text-sm text-center">
						<br />
						<br />
						This project is not affiliated with Anthropic. All logos
						are trademarks of their respective owners.
					</span>
				</div>
			</div>
		</main>
	)
}

export default App
