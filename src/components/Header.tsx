
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/context/TaskContext';

const Header: React.FC = () => {
  const { tasks } = useTaskContext();
  
  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const totalTasks = tasks.length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="w-full bg-accent/50 p-6 rounded-lg mb-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-md p-4 shadow-sm">
          <h3 className="font-medium text-muted-foreground">Total Tasks</h3>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </div>
        
        <div className="bg-white rounded-md p-4 shadow-sm">
          <h3 className="font-medium text-muted-foreground">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">{pendingTasks}</p>
        </div>
        
        <div className="bg-white rounded-md p-4 shadow-sm">
          <h3 className="font-medium text-muted-foreground">In Progress</h3>
          <p className="text-3xl font-bold text-blue-500">{inProgressTasks}</p>
        </div>
        
        <div className="bg-white rounded-md p-4 shadow-sm">
          <h3 className="font-medium text-muted-foreground">Completed</h3>
          <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-md p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Completion Progress</h3>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
