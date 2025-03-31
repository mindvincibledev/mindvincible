
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, CheckCircle, Clock, InProgress } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTaskContext();

  const statusIcons = {
    'pending': <Clock className="h-4 w-4 mr-1" />,
    'in-progress': <InProgress className="h-4 w-4 mr-1" />,
    'completed': <CheckCircle className="h-4 w-4 mr-1" />
  };

  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };

  const toggleStatus = () => {
    const newStatus = task.status === 'completed' 
      ? 'pending' 
      : task.status === 'pending' 
        ? 'in-progress' 
        : 'completed';
    
    updateTask(task.id, { status: newStatus });
  };

  return (
    <Card className={cn("task-card animate-slide-in", 
      task.status === 'completed' ? "opacity-75" : "")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className={cn("font-medium text-lg", 
            task.status === 'completed' ? "completed-task" : "")}>
            {task.title}
          </h3>
          <Badge 
            variant="outline" 
            className={cn("ml-2 flex items-center px-2 py-1", statusClasses[task.status])}
            onClick={toggleStatus}
          >
            {statusIcons[task.status]}
            {task.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className={cn("text-sm text-muted-foreground mt-1", 
            task.status === 'completed' ? "completed-task" : "")}>
            {task.description}
          </p>
        )}
        
        {task.dueDate && (
          <div className="text-xs text-muted-foreground mt-3">
            Due: {format(task.dueDate, 'PPP')}
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.map((tag) => (
            <Badge 
              key={tag.id} 
              style={{ backgroundColor: tag.color, color: 'white' }}
              className="mr-1"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-1">
        <div className="text-xs text-muted-foreground">
          Created: {format(task.createdAt, 'PP')}
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
