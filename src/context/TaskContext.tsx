
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskTag } from '@/types/task';
import { useToast } from '@/components/ui/use-toast';

// Default tags
const defaultTags: TaskTag[] = [
  { id: '1', name: 'Work', color: '#4f46e5' },
  { id: '2', name: 'Personal', color: '#16a34a' },
  { id: '3', name: 'Urgent', color: '#dc2626' },
  { id: '4', name: 'Learning', color: '#ca8a04' },
];

// Create context types
type TaskContextType = {
  tasks: Task[];
  tags: TaskTag[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addTag: (tag: Omit<TaskTag, 'id'>) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByTag: (tagId: string) => Task[];
};

// Create context with default values
const TaskContext = createContext<TaskContextType>({
  tasks: [],
  tags: defaultTags,
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  addTag: () => {},
  getTasksByStatus: () => [],
  getTasksByTag: () => [],
});

// Hook for using the task context
export const useTaskContext = () => useContext(TaskContext);

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
        return [];
      }
    }
    return [];
  });

  const [tags, setTags] = useState<TaskTag[]>(() => {
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : defaultTags;
  });

  const { toast } = useToast();

  // Save to localStorage whenever tasks or tags change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  // Add a new task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast({
      title: 'Task added',
      description: `"${newTask.title}" has been added to your tasks.`,
    });
  };

  // Update an existing task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
    toast({
      title: 'Task updated',
      description: `The task has been updated successfully.`,
    });
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    
    if (taskToDelete) {
      toast({
        title: 'Task deleted',
        description: `"${taskToDelete.title}" has been removed.`,
        variant: 'destructive'
      });
    }
  };

  // Add a new tag
  const addTag = (tagData: Omit<TaskTag, 'id'>) => {
    const newTag: TaskTag = {
      ...tagData,
      id: crypto.randomUUID(),
    };

    setTags((prevTags) => [...prevTags, newTag]);
    toast({
      title: 'Tag created',
      description: `Tag "${newTag.name}" has been created.`,
    });
  };

  // Get tasks by status
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  // Get tasks by tag
  const getTasksByTag = (tagId: string): Task[] => {
    return tasks.filter((task) => task.tags.some((tag) => tag.id === tagId));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        tags,
        addTask,
        updateTask,
        deleteTask,
        addTag,
        getTasksByStatus,
        getTasksByTag,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
