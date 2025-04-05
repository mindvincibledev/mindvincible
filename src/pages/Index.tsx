// app/page.tsx
import React from 'react';
import { TaskProvider } from '@/context/TaskContext';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';
import BackgroundWithEmojis from "@/components/BackgroundWithEmojis";

export default function Home() {
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen bg-transparent p-4 md:p-8">
        <TaskProvider>
          <Header />
          <TaskList />
        </TaskProvider>
      </div>
    </BackgroundWithEmojis>
  );
};
