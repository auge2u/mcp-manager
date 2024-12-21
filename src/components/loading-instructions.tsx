type LoadingInstructionsProps = {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	onJsonInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	uploadStatus: "idle" | "success" | "error"
}

export function LoadingInstructions({
	isOpen,
	onOpenChange,
	onJsonInput,
	uploadStatus
}: LoadingInstructionsProps) {
	return (
		<div className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
			<h2 className="text-2xl">Loading Configuration</h2>
			<p>
				Paste your MCP server configuration JSON below. This should be the contents
				of your{" "}
				<code className="bg-base-200 px-2 py-1 rounded">
					~/Library/Application Support/Claude/claude_desktop_config.json
				</code>{" "}
				file.
			</p>
			<div className="form-control">
				<textarea
					className={`textarea textarea-bordered h-32 font-mono ${
						uploadStatus === "error" ? "textarea-error" : ""
					}`}
					placeholder="Paste your JSON configuration here..."
					onChange={onJsonInput}
				/>
				{uploadStatus === "error" && (
					<label className="label">
						<span className="label-text-alt text-error">
							Invalid JSON configuration
						</span>
					</label>
				)}
			</div>
		</div>
	)
}
