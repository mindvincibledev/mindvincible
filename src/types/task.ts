
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type TaskTag = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  tags: TaskTag[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
};
