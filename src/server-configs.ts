export type ServerConfig = {
	command?: string
	args?: string[]
	env?: Record<string, string>
	icon: string
	description: string
	docsUrl: string
	defaultProjectId?: string
	setupCommands?: {
		installPath: string
		command: string
	}
}

export const getDefaultProjectId = (serverPath: string) => {
	// Extract project name from path for VSCode instances
	if (serverPath.includes('/github/habitusnet/')) {
		const match = serverPath.match(/\/github\/habitusnet\/([^/]+)/);
		return match ? match[1] : undefined;
	}
	return undefined;
}

export const SERVER_CONFIGS: Record<string, ServerConfig> = {
	"task-management": {
		icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxpc3QtdG9kbyI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIvPjxwYXRoIGQ9Im0zIDkgMTggME0zIDE1IDE4IDBNOSAzIDkgMjEiLz48L3N2Zz4=",
		description: "Task management and tracking system",
		command: "node",
		args: ["task-management/build/index.js"],
		docsUrl: "https://github.com/auge2u/CLINE-MCP-Tasks/tree/main/task-management"
	},
	"vision-conflict": {
		icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWV5ZSI+PHBhdGggZD0iTTIgMTJzMy02IDEwLTYgMTAgNiAxMCA2LTMgNi0xMCA2LTEwLTYtMTAtNloiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIi8+PC9zdmc+",
		description: "Vision and conflict management system",
		command: "node",
		args: ["vision-conflict/build/index.js"],
		docsUrl: "https://github.com/auge2u/CLINE-MCP-Tasks/tree/main/vision-conflict"
	}
}
