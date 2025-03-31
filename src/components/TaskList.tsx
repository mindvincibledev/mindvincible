
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const TaskList: React.FC = () => {
  const { tasks, tags, getTasksByStatus } = useTaskContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const filterTasks = () => {
    let filteredTasks = tasks;
    
    // Filter by status tab
    if (activeTab !== 'all') {
      filteredTasks = getTasksByStatus(activeTab);
    }
    
    // Filter by tag
    if (filterTag !== 'all') {
      filteredTasks = filteredTasks.filter(task => 
        task.tags.some(tag => tag.id === filterTag)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    return filteredTasks;
  };

  const filteredTasks = filterTasks();
  
  // Get counts for each status
  const pendingCount = getTasksByStatus('pending').length;
  const inProgressCount = getTasksByStatus('in-progress').length;
  const completedCount = getTasksByStatus('completed').length;
  const allCount = tasks.length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-muted-foreground">Organize and track your tasks</p>
        </div>
        <Button onClick={handleAddTask} className="md:self-end">
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map(tag => (
              <SelectItem key={tag.id} value={tag.id}>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  {tag.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as TaskStatus | 'all')}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="relative">
            All
            <span className="ml-1 text-xs">({allCount})</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            <span className="ml-1 text-xs">({pendingCount})</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="relative">
            In Progress
            <span className="ml-1 text-xs">({inProgressCount})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            <span className="ml-1 text-xs">({completedCount})</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Task Lists */}
        <TabsContent value="all" className="mt-0">
          <TaskListContent tasks={filteredTasks} onEdit={handleEditTask} />
        </TabsContent>
        <TabsContent value="pending" className="mt-0">
          <TaskListContent tasks={filteredTasks} onEdit={handleEditTask} />
        </TabsContent>
        <TabsContent value="in-progress" className="mt-0">
          <TaskListContent tasks={filteredTasks} onEdit={handleEditTask} />
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <TaskListContent tasks={filteredTasks} onEdit={handleEditTask} />
        </TabsContent>
      </Tabs>
      
      {/* Task Form Dialog */}
      <TaskForm 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        editTask={editingTask} 
      />
    </div>
  );
};

// Separate component for the task list content
const TaskListContent: React.FC<{ tasks: Task[], onEdit: (task: Task) => void }> = ({ tasks, onEdit }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default TaskList;
