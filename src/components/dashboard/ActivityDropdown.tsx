
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle } from 'lucide-react';

interface ActivityDropdownProps {
  completedActivities: string[];
}

const ActivityDropdown = ({ completedActivities }: ActivityDropdownProps) => {
  // Define all available activities from resource hub
  const allActivities = [
    'Emotional Airbnb',
    'Box Breathing',
    'Fork in the Road',
    'Grounding Technique',
    'Mirror Mirror',
    'Power of Hi'
  ];

  return (
    <Select>
      <SelectTrigger className="w-[200px] bg-white">
        <SelectValue placeholder={`${completedActivities.length}/${allActivities.length} Done`} />
      </SelectTrigger>
      <SelectContent className="bg-white backdrop-blur-md border border-gray-200 z-50">
        <SelectGroup>
          {allActivities.map((activity) => {
            const isCompleted = completedActivities.includes(activity);
            return (
              <SelectItem 
                key={activity} 
                value={activity}
              >
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-[#2AC20E]" />
                  ) : (
                    <XCircle className="h-5 w-5 text-[#FC68B3]" />
                  )}
                  <span>{activity}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ActivityDropdown;
