import React, { useState, useEffect } from 'react';
import fs from 'fs/promises';
import path from 'path';
import { MarkdownParser, TaskSection } from '../../utils/markdown-parser';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'pending' | 'in-progress' | 'completed';
  subtasks: Task[];
  timeInvested: number;
}

interface LogEntry {
  date: string;
  tasks: {
    completed: string[];
    inProgress: string[];
  };
  timeInvested: Record<string, number>;
  notes: string[];
}

export const TaskManager: React.FC = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentLog, setCurrentLog] = useState<LogEntry | null>(null);

  const taskSystemPath = path.join(process.cwd(), 'docs', 'task-management', 'task-system.md');

  // Load tasks from task-system.md
  const loadTasks = async (): Promise<void> => {
    try {
      const content = await fs.readFile(taskSystemPath, 'utf-8');
      const parsedTasks = MarkdownParser.parseTaskSystem(content);
      
      // Convert TaskSection to Task recursively
      const convertToTask = (section: TaskSection): Task => ({
        id: section.title.toLowerCase().replace(/\s+/g, '-'),
        title: section.title,
        category: section.title.split(' ')[0], // Extract category from first word of title
        priority: section.priority,
        status: section.status,
        subtasks: section.subtasks.map(convertToTask),
        timeInvested: 0
      });

      setTasks(parsedTasks.map(convertToTask));
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Update daily log
  const updateDailyLog = async (task: Task): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const logPath = path.join(process.cwd(), 'docs', 'logs', 'daily', `${today}.md`);
      
      // Create or update log entry
      const logEntry: LogEntry = currentLog || {
        date: today,
        tasks: {
          completed: [],
          inProgress: []
        },
        timeInvested: {},
        notes: []
      };

      // Update task status in log
      if (task.status === 'completed') {
        logEntry.tasks.completed.push(task.title);
      } else if (task.status === 'in-progress') {
        logEntry.tasks.inProgress.push(task.title);
      }

      // Update time investment
      logEntry.timeInvested[task.category] = 
        (logEntry.timeInvested[task.category] || 0) + task.timeInvested;

      // Format log content
      const logContent = `# Daily Log: ${today}

## Tasks Completed
${logEntry.tasks.completed.map(task => `- ${task}`).join('\n')}

## Tasks In Progress
${logEntry.tasks.inProgress.map(task => `- ${task}`).join('\n')}

## Time Investment
${Object.entries(logEntry.timeInvested)
  .map(([category, time]) => `- ${category}: ${time} hours`)
  .join('\n')}

## Notes
${logEntry.notes.join('\n')}`;

      await fs.writeFile(logPath, logContent);
      setCurrentLog(logEntry);
    } catch (error) {
      console.error('Error updating daily log:', error);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: string, status: Task['status']): Promise<void> => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status };
        updateDailyLog(updatedTask);
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    
    try {
      // Read current content
      const content = await fs.readFile(taskSystemPath, 'utf-8');
      
      // Update content with new status
      const updatedContent = MarkdownParser.updateTaskStatus(
        content,
        tasks.find(t => t.id === taskId)?.title || '',
        status
      );
      
      // Write updated content back to file
      await fs.writeFile(taskSystemPath, updatedContent);
    } catch (error) {
      console.error('Error updating task-system.md:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = (taskId: string, newStatus: Task['status']): void => {
    updateTaskStatus(taskId, newStatus);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'P1': return 'text-red-600';
      case 'P2': return 'text-orange-500';
      case 'P3': return 'text-yellow-500';
      case 'P4': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="task-manager p-4">
      <h2 className="text-2xl font-semibold mb-4">Task Manager</h2>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-3">In Progress</h3>
          {tasks
            .filter(task => task.status === 'in-progress')
            .map(task => (
              <div key={task.id} className="border-b py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="ml-2">{task.title}</span>
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                {task.subtasks.length > 0 && (
                  <div className="ml-4 mt-2">
                    {task.subtasks.map((subtask, index) => (
                      <div key={`${task.id}-${index}`} className="flex items-center justify-between py-1">
                        <span>{subtask.title}</span>
                        <select
                          value={subtask.status}
                          onChange={(e) => handleStatusChange(
                            `${task.id}-${index}`,
                            e.target.value as Task['status']
                          )}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-3">Pending</h3>
          {tasks
            .filter(task => task.status === 'pending')
            .map(task => (
              <div key={task.id} className="border-b py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="ml-2">{task.title}</span>
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
