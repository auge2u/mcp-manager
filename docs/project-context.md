# Project Context Management

## Overview

The MCP-Aurelius-Kline-Claude system manages multiple MCP servers with different contexts:

1. **Active Claude Instance Server**
   - Located in `/Documents/Cline/MCP/`
   - Marked with a blue badge and border
   - Represents the MCP server running within Claude Desktop

2. **VSCode Project Servers**
   - Located in `/github/habitusnet/`
   - Project ID automatically derived from repository name
   - Maintains isolated context per VSCode instance

## Server Types

### Task Management Server
- **Claude Instance**: `/Documents/Cline/MCP/task-management-server/`
- **VSCode Instance**: `/github/habitusnet/CLINE-MCP-Tasks/task-management/`
- Handles task tracking and management
- Each instance maintains its own task context

### Vision Conflict Server
- **VSCode Instance**: `/github/habitusnet/CLINE-MCP-Tasks/vision-conflict/`
- Manages project vision and conflict resolution
- Context tied to specific VSCode workspace

## Project ID Management

Project IDs are used to maintain context isolation:

1. **Automatic Detection**
   - VSCode project servers automatically detect project ID from repository name
   - Claude instance servers use a default project ID

2. **Manual Override**
   - Users can override the project ID for any server
   - Useful for testing or specific use cases

## Context Isolation

The system ensures proper context isolation through:

1. **Visual Indicators**
   - Active Claude instance servers clearly marked
   - VSCode project context displayed
   - Connection status indicators

2. **Separate State**
   - Each server maintains its own state
   - No cross-contamination between different VSCode instances
   - Clear separation between Claude and VSCode contexts

## Best Practices

1. **Project Organization**
   - Keep Claude instance servers separate from VSCode project servers
   - Use meaningful project IDs that reflect the context
   - Document any custom project ID assignments

2. **Multiple VSCode Instances**
   - Each VSCode instance should use its own set of servers
   - Maintain clear separation between different project contexts
   - Use the project ID field to ensure proper isolation

3. **Context Switching**
   - Stop servers before switching contexts
   - Verify correct project ID when starting servers
   - Monitor connection status for proper initialization
