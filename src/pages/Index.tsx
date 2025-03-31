
import React from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <TaskProvider>
        <Header />
        <TaskList />
      </TaskProvider>
    </div>
  );
};

export default Index;
