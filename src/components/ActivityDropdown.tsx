
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ActivityDropdownProps {
  completedActivities: string[];
}

const ActivityDropdown: React.FC<ActivityDropdownProps> = ({ completedActivities }) => {
  const allActivities = [
    'Digital Detox',
    'Mirror Mirror on the Wall',
    'Power of Hi',
    'Fork in Road',
    'Emotional Airbnb',
    'Box Breathing',
    '5-4-3-2-1: The Grounding Quest'
  ];

  const completedCount = completedActivities.length;
  const totalCount = allActivities.length;

  return (
    <Select>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder={`${completedCount}/${totalCount} Done`} />
      </SelectTrigger>
      <SelectContent className="bg-white backdrop-blur-md border border-gray-200 z-50">
        <SelectGroup>
          {allActivities.map((activity) => {
            const isCompleted = completedActivities.includes(activity);
            return (
              <SelectItem key={activity} value={activity}>
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
