
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
  allActivities: string[];
}

const ActivityDropdown = ({ completedActivities, allActivities }: ActivityDropdownProps) => {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="View Activities" />
      </SelectTrigger>
      <SelectContent>
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
