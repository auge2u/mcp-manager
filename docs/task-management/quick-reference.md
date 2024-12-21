# MCP-Aurelius-Kline-Claude Quick Reference

## Server Management

### Server Types
1. Active Claude Instance (in `/Documents/Cline/MCP/`)
   - Marked with blue badge
   - Represents Claude Desktop context

2. VSCode Project Servers (in `/github/habitusnet/`)
   - Context derived from repository
   - Instance-specific isolation

### Project ID Rules
- Claude Instance: Use default project ID
- VSCode Instance: Use repository name
- Manual Override: When testing/debugging

### Server States
- Connected: Green indicator
- Connecting: Yellow pulsing indicator
- Disconnected: Red indicator

## Context Management

### Pre-Task Checklist
1. Verify correct server context
2. Check project ID assignment
3. Confirm server status
4. Review active connections

### Critical File Locations
- Config: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Logs: `/docs/logs/daily/YYYY-MM-DD.md`
- Tasks: `/docs/task-management/task-system.md`
- Context: `/docs/project-context.md`

### Command Response Protocol
1. Check server status
2. Verify project context
3. Execute command
4. Monitor response
5. Update logs

### Priority Rules
1. Active Claude tasks first
2. VSCode project tasks second
3. Cross-context tasks last
4. Emergency fixes override

## Task Selection Process
1. Check active context
2. Review priority queue
3. Verify dependencies
4. Assess resources
5. Execute task

## Pre-Task Checklist
1. Review task-system.md for current priorities
2. Check for dependencies in current tasks
3. Verify no conflicts with in-progress work
4. Ensure required resources are available
5. Validate against project vision/mission

## Critical File Locations
- Task Management: `/docs/task-management/`
  - System Overview: `task-system.md`
  - Quick Reference: `quick-reference.md`
- Daily Logs: `/docs/logs/daily/`
- Source Code: `/src/`
  - Components: `/src/components/`
  - Types: `/src/types/`
  - Assets: `/src/assets/`
- Electron: `/electron/`
- Configuration Files:
  - TypeScript: `tsconfig.json`
  - Vite: `vite.config.ts`
  - Tailwind: `tailwind.config.ts`
  - ESLint: `eslint.config.js`

## Command Response Protocol
1. "what's next" / "do next most important task" / "gsd":
   - Generate 3-6 priority options
   - Auto-select highest priority after brief analysis
   - Group parallel tasks when possible
   - Update task tracking in task-system.md

2. After Tool Use:
   - Update task status in task-system.md
   - Create/update daily log
   - Verify completion criteria
   - Record parallel execution results
   - Track time investment

3. Status Checks:
   - Verify against completion criteria
   - Review relevant log entries
   - Validate testing/documentation
   - Check dependencies
   - Update only when all criteria met

## Priority Rules
1. P1 (Critical)
   - Blocks other critical work
   - Affects system stability
   - Security-related
   - Must be addressed immediately

2. P2 (High)
   - Impacts user experience
   - Blocks non-critical work
   - Performance bottlenecks
   - Should be addressed within current sprint

3. P3 (Medium)
   - Improvements to existing features
   - Documentation updates
   - Technical debt
   - Can be scheduled flexibly

4. P4 (Low)
   - Nice-to-have features
   - Minor improvements
   - Can be deferred

## Task Selection Process
1. Initial Assessment
   - Review current tasks in task-system.md
   - Check completion status of dependencies
   - Evaluate resource availability
   - Consider parallel execution opportunities

2. Priority Evaluation
   - Apply priority rules
   - Consider project timeline
   - Check resource constraints
   - Assess impact on other tasks

3. Selection Criteria
   - Highest priority first
   - Dependencies satisfied
   - Resources available
   - Aligns with project goals
   - Can be completed with available time

4. Execution Planning
   - Break into subtasks if needed
   - Identify parallel opportunities
   - Set clear completion criteria
   - Plan verification steps

## Completion Criteria
1. Code Changes
   - Passes all tests
   - Meets style guidelines
   - Documentation updated
   - No new warnings/errors

2. Documentation
   - Clear and accurate
   - Examples provided
   - Links verified
   - Formatting consistent

3. Testing
   - Unit tests pass
   - Integration tests pass
   - Edge cases covered
   - Performance acceptable

4. Review
   - Code reviewed
   - Documentation reviewed
   - Tests verified
   - Changes logged

Last Updated: 2024-01-09
