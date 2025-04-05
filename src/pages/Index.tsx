
import React from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';
import BackgroundWithEmojis from "@/components/BackgroundWithEmojis";
export default function Home() {
  return (
    <BackgroundWithEmojis>
      <TaskProvider>
        <Header />
        <TaskList />
      </TaskProvider>

    </BackgroundWithEmojis>
    
  );
};


