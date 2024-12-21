type MCPServer = {
	command: string
	args: string[]
	env?: Record<string, string>
}

type MCPConfig = {
	mcpServers: {
		[key: string]: MCPServer
	}
}

type ApplyingInstructionsProps = {
	jsonContent: MCPConfig
}

export function ApplyingInstructions({ jsonContent }: ApplyingInstructionsProps) {
	const configPath = "~/Library/Application Support/Claude/claude_desktop_config.json"
	const configContent = JSON.stringify(jsonContent, null, 2)

	return (
		<div className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
			<h2 className="text-2xl">Applying Configuration</h2>
			<p>
				To apply this configuration, save the following JSON to{" "}
				<code className="bg-base-200 px-2 py-1 rounded">{configPath}</code>:
			</p>
			<pre className="bg-base-200 p-4 rounded-xl overflow-x-auto">
				<code>{configContent}</code>
			</pre>
		</div>
	)
}
