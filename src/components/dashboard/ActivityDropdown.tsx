
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
      <SelectContent className="bg-white backdrop-blur-md border border-gray-200">
        <SelectGroup>
          {allActivities.map((activity) => (
            <SelectItem key={activity} value={activity} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {completedActivities.includes(activity) ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                {activity}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ActivityDropdown;
