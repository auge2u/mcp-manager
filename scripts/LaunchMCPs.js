#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const REPOS = {
  'mcp-manager': 'https://github.com/auge2u/habitusnet/mcp-manager.git',
  'CLINE-MCP-Tasks': 'https://github.com/auge2u/CLINE-MCP-Tasks.git'
};

const BASE_DIR = path.join(process.env.HOME, 'github', 'habitusnet');

function executeCommand(command, cwd = process.cwd()) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

function cloneRepositories() {
  console.log('\n📦 Cloning repositories...');
  
  Object.entries(REPOS).forEach(([name, url]) => {
    const repoPath = path.join(BASE_DIR, name);
    
    if (!fs.existsSync(repoPath)) {
      console.log(`\nCloning ${name}...`);
      executeCommand(`git clone ${url} ${repoPath}`);
    } else {
      console.log(`\nUpdating ${name}...`);
      executeCommand('git pull', repoPath);
    }
  });
}

function cleanInstall(directory) {
  console.log(`\nCleaning ${directory}...`);
  const packageLock = path.join(directory, 'package-lock.json');
  const nodeModules = path.join(directory, 'node_modules');
  const distElectron = path.join(directory, 'dist-electron');
  
  if (fs.existsSync(packageLock)) {
    fs.unlinkSync(packageLock);
  }
  if (fs.existsSync(nodeModules)) {
    fs.rmSync(nodeModules, { recursive: true, force: true });
  }
  if (fs.existsSync(distElectron)) {
    fs.rmSync(distElectron, { recursive: true, force: true });
  }
}

function installDependencies() {
  console.log('\n📥 Installing dependencies...');
  
  // Install MCP Manager dependencies
  console.log('\nInstalling MCP Manager dependencies...');
  const mcpManagerPath = path.join(BASE_DIR, 'mcp-manager');
  
  // Clean and reinstall
  cleanInstall(mcpManagerPath);
  executeCommand('npm install', mcpManagerPath);
  
  // Install biome globally
  console.log('\nInstalling Biome globally...');
  executeCommand('npm install -g @biomejs/biome');
  
  // Install CLINE-MCP-Tasks dependencies
  console.log('\nInstalling CLINE-MCP-Tasks dependencies...');
  const tasksPath = path.join(BASE_DIR, 'CLINE-MCP-Tasks');
  cleanInstall(tasksPath);
  executeCommand('npm install', tasksPath);
}

function configureMCPs() {
  console.log('\n⚙️ Configuring MCPs...');
  
  const mcpConfigPath = path.join(process.env.HOME, 'Library/Application Support/Claude/claude_desktop_config.json');
  
  // Read existing config or create new one
  let config = { mcpServers: {} };
  if (fs.existsSync(mcpConfigPath)) {
    config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  }
  
  // Add task-manager and vision-conflict MCPs
  config.mcpServers = {
    ...config.mcpServers,
    'task-management': {
      command: 'node',
      args: [path.join(BASE_DIR, 'CLINE-MCP-Tasks/task-management/build/index.js')],
      env: {}
    },
    'vision-conflict': {
      command: 'node',
      args: [path.join(BASE_DIR, 'CLINE-MCP-Tasks/vision-conflict/build/index.js')],
      env: {}
    }
  };
  
  // Save updated config
  fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2));
  console.log('MCPs configured successfully!');
}

function startServices() {
  console.log('\n🚀 Starting services...');
  
  const mcpManagerPath = path.join(BASE_DIR, 'mcp-manager');
  process.chdir(mcpManagerPath);
  
  // Clean build artifacts
  console.log('Cleaning build artifacts...');
  executeCommand('npm run clean');
  
  // Compile TypeScript files first
  console.log('Compiling TypeScript files...');
  executeCommand('tsc -p electron/tsconfig.json');
  
  // Start Electron development server with debugging enabled
  console.log('Starting Electron development server...');
  process.env.DEBUG = 'vite-plugin-electron*';
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
  process.env.FORCE_COLOR = '1';
  
  // Use npm run electron:dev with proper error handling
  try {
    executeCommand('npm run electron:dev');
  } catch (error) {
    console.error('Failed to start development server:', error);
    console.log('Attempting to start with fallback configuration...');
    executeCommand('npm run dev');
  }
}

async function main() {
  console.log('🎉 Welcome to LaunchMCPs!');
  console.log('This script will set up MCP Manager and CLINE-MCP-Tasks...');
  
  try {
    cloneRepositories();
    installDependencies();
    configureMCPs();
    startServices();
    
    console.log('\n✨ Setup complete! MCP Manager is now running with task-manager and vision-conflict MCPs configured.');
    console.log('\nYou can now:');
    console.log('1. Open Claude Desktop');
    console.log('2. Enable the task-manager and vision-conflict MCPs');
    console.log('3. Start using the new capabilities!');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
