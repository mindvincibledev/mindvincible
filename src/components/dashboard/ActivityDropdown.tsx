
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActivityDropdownProps {
  activities: string[];
  completedActivities: string[];
}

const ActivityDropdown = ({ activities, completedActivities }: ActivityDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-between w-full px-4 py-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50">
        <span>Activities ({completedActivities.length})</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white">
        {activities.map((activity) => (
          <DropdownMenuItem key={activity} className="flex items-center justify-between px-4 py-2">
            <span>{activity}</span>
            {completedActivities.includes(activity) && (
              <Check className="h-4 w-4 text-[#2AC20E]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActivityDropdown;
