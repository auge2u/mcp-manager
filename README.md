# MCP Manager for Claude Desktop

<center>A simple web GUI to manage Model Context Protocol (MCP) servers for the Claude Desktop app on MacOS easily. Just follow the instructions and paste a few commands to give your Claude app instant superpowers.</center>

<center>A simple web GUI to manage Model Context Protocol (MCP) servers for the Claude Desktop app on MacOS easily. Just follow the instructions and paste a few commands to give your Claude app instant superpowers.</center>

![MCP Manager for Claude Desktop](https://assets.zue.ai/mcp-manager-hero.png)

## What is MCP?

The Model Context Protocol (MCP) enables Claude to access private data, APIs, and other services to answer questions and perform actions on your behalf. Learn more about MCP at:

- [modelcontextprotocol.io](https://modelcontextprotocol.io)
- [Anthropic's MCP Announcement](https://www.anthropic.com/news/model-context-protocol)

## Features

- 🚀 Easy-to-use interface for managing MCP servers
- 🔒 Runs entirely client-side - your data never leaves your computer
- ⚡️ Quick setup for popular MCP servers:
  - Apple Notes - Access and search your Apple Notes
  - AWS Knowledge Base - Access and query AWS Knowledge Base for information retrieval
  - Brave Search - Search the web with Brave Search API
  - Browserbase - Let Claude explore the web with Browserbase
  - Cloudflare - Manage your Cloudflare workers and account resources
  - Everart - Interface with Everart API for digital art and design tools
  - Exa - Search the web with Exa
  - Filesystem - Access and manage local filesystem
  - GitHub - Access your GitHub repositories
  - GitLab - Manage GitLab repositories and resources
  - Google Drive - Access and search files in your Google Drive
  - Google Maps - Access Google Maps API for location services
  - Memory - Give Claude memory of previous conversations
  - Obsidian - Read and search files in your Obsidian vault
  - Perplexity - Search the web with Perplexity API
  - PostgreSQL - Connect and interact with PostgreSQL databases
  - Puppeteer - Automate browser interactions
  - Sequential Thinking - Enable step-by-step reasoning
  - Slack - Access your Slack workspace
  - SQLite - Manage SQLite databases
  - Todoist - Access and search your Todoist tasks
  - YouTube Transcript - Access and search YouTube transcripts
- 🛠 Simple configuration of environment variables and server settings
- 📋 One-click copying of terminal commands for installation

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**:
  - TailwindCSS for utility-first CSS
  - DaisyUI for component styling
  - Tiempos Font to match the Anthropic Design Language
- **Package Manager**: Bun
- **Deployment**: Cloudflare Pages for <60s build times

## Project Structure

```plaintext
src/
├── components/ # React components
│ ├── server-configs/ # Server-specific configuration components
│ └── ...
├── assets/ # Static assets and fonts
├── App.tsx # Main application component
├── server-configs.ts # MCP server configurations
└── utils.ts # Utility functions
```

## Development

### Installation Options

There are two ways to set up the development environment:

1. **Using LaunchMCPs Script (Recommended)**
   
   This method automatically sets up the MCP Manager along with the task-manager and vision-conflict MCPs from [CLINE-MCP-Tasks](https://github.com/auge2u/CLINE-MCP-Tasks):

   ```bash
   # Coming soon: LaunchMCPs script that will:
   # 1. Clone both repositories (mcp-manager and CLINE-MCP-Tasks)
   # 2. Install dependencies safely
   # 3. Configure the task-manager and vision-conflict MCPs
   # 4. Start all services
   ```

2. **Manual Installation**

   If you prefer to install manually or encounter security warnings:

   ```bash
   # Note: Bun may flag some postinstall scripts as untrusted
   # This is a security feature protecting against potentially harmful scripts
   # You have several options:
   
   # Option 1: Use npm/yarn instead of bun
   npm install
   # or
   yarn install

   # Option 2: Use bun but skip postinstall scripts
   bun install --no-post-install
   # Then manually install biome:
   npm install -g @biomejs/biome

   # Option 3: Use bun and explicitly trust the scripts
   bun install
   # Review and approve any security prompts
   ```

### Starting the Development Server

```bash
bun dev
```

### Building for Production

```bash
bun run build
```

### Understanding Bun Security

Bun's runtime includes security features that may flag certain postinstall scripts as untrusted, particularly those that:
- Execute shell commands (using child_process)
- Download/install binaries
- Perform filesystem operations

This is a security measure to protect against potentially malicious packages. While packages like @biomejs/biome are safe and come from trusted sources, Bun takes a cautious approach to automatically executing such scripts.

## Included MCP Servers

### Task Management MCP
The task-manager MCP provides tools for:
- Creating and managing development tasks
- Tracking task priorities and dependencies
- Organizing tasks by category
- Monitoring task completion status

### Vision Conflict MCP
The vision-conflict MCP helps maintain project alignment by:
- Managing project vision statements
- Checking task alignment with project goals
- Identifying and resolving conflicts
- Tracking vision-related metrics

Both MCPs are included in the [CLINE-MCP-Tasks](https://github.com/auge2u/CLINE-MCP-Tasks) repository and are automatically configured when using the LaunchMCPs script.

## Contributing

Contributions are extremely welcome! Please open a PR with new MCP servers or any other improvements to the codebase.
PS. I wasnt able to get fetch, time, and sentry working, if you can help me out, that would be great!

## Disclaimer

This project is not affiliated with Anthropic. All logos are trademarks of their respective owners.

## License

MIT

---
<br/>
<br/>
<p align="center">
<a href="https://zue.ai#gh-light-mode-only">
  <img src="https://assets.zue.ai/logo_zue_purple.svg" alt="zue logo" width="200" height="auto" style="display: block; margin: 0 auto;" />
</a>
<a href="https://zue.ai#gh-dark-mode-only">
  <img src="https://assets.zue.ai/logo_zue_yellow.svg" alt="zue logo" width="200" height="auto" style="display: block; margin: 0 auto;" />
</a>
</p>

<center>
[Contact us](https://zue.ai/talk-to-us) for custom AI automation solutions and product development.
</center>
