export interface TaskSection {
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  subtasks: TaskSection[];
}

export class MarkdownParser {
  private static priorityRegex = /\((P[1-4])\)/;
  private static statusRegex = /\[([ x]|IN PROGRESS)\]/;

  static parseTaskSystem(content: string): TaskSection[] {
    const lines = content.split('\n');
    const tasks: TaskSection[] = [];
    let currentTask: TaskSection | null = null;
    let currentSubtasks: TaskSection[] = [];

    for (const line of lines) {
      if (line.startsWith('### In Progress') || line.startsWith('### Pending')) {
        continue;
      }

      if (line.startsWith('- ')) {
        const priorityMatch = line.match(this.priorityRegex);
        const statusMatch = line.match(this.statusRegex);
        
        if (priorityMatch && statusMatch) {
          if (currentTask) {
            currentTask.subtasks = currentSubtasks;
            tasks.push(currentTask);
            currentSubtasks = [];
          }

          const title = line
            .replace(this.priorityRegex, '')
            .replace(this.statusRegex, '')
            .replace('- ', '')
            .trim();

          currentTask = {
            title,
            priority: priorityMatch[1] as 'P1' | 'P2' | 'P3' | 'P4',
            status: this.parseStatus(statusMatch[1]),
            subtasks: []
          };
        } else if (line.startsWith('  - ') && currentTask) {
          const statusMatch = line.match(this.statusRegex);
          if (statusMatch) {
            const title = line
              .replace(this.statusRegex, '')
              .replace('  - ', '')
              .trim();

            currentSubtasks.push({
              title,
              status: this.parseStatus(statusMatch[1]),
              priority: currentTask.priority,
              subtasks: []
            });
          }
        }
      }
    }

    if (currentTask) {
      currentTask.subtasks = currentSubtasks;
      tasks.push(currentTask);
    }

    return tasks;
  }

  private static parseStatus(status: string): 'pending' | 'in-progress' | 'completed' {
    if (status === 'x') return 'completed';
    if (status === 'IN PROGRESS') return 'in-progress';
    return 'pending';
  }

  static generateMarkdown(tasks: TaskSection[]): string {
    let markdown = '';

    // In Progress section
    markdown += '### In Progress\n';
    for (const task of tasks.filter(t => t.status === 'in-progress')) {
      markdown += this.formatTask(task, 0);
    }

    // Pending section
    markdown += '\n### Pending\n';
    for (const task of tasks.filter(t => t.status === 'pending')) {
      markdown += this.formatTask(task, 0);
    }

    return markdown;
  }

  private static formatTask(task: TaskSection, indent: number): string {
    const indentation = '  '.repeat(indent);
    const status = this.formatStatus(task.status);
    const line = `${indentation}- [${status}] ${task.title} (${task.priority})\n`;

    let result = line;
    for (const subtask of task.subtasks) {
      result += this.formatTask(subtask, indent + 1);
    }

    return result;
  }

  private static formatStatus(status: string): string {
    switch (status) {
      case 'completed': return 'x';
      case 'in-progress': return 'IN PROGRESS';
      default: return ' ';
    }
  }

  static updateTaskStatus(
    content: string,
    taskTitle: string,
    newStatus: 'pending' | 'in-progress' | 'completed'
  ): string {
    const lines = content.split('\n');
    const updatedLines = lines.map(line => {
      if (line.includes(taskTitle)) {
        const statusMatch = line.match(this.statusRegex);
        if (statusMatch) {
          const newStatusMark = this.formatStatus(newStatus);
          return line.replace(this.statusRegex, `[${newStatusMark}]`);
        }
      }
      return line;
    });

    return updatedLines.join('\n');
  }
}
