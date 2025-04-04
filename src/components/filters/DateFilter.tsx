
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type DateFilterOption = 'day' | 'week' | 'month' | 'year' | 'all';

interface DateFilterProps {
  filterOption: DateFilterOption;
  selectedDate: Date;
  onFilterChange: (option: DateFilterOption) => void;
  onDateChange: (date: Date) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  filterOption,
  selectedDate,
  onFilterChange,
  onDateChange
}) => {
  // Format the displayed date based on the filter type
  const getFormattedDate = () => {
    switch (filterOption) {
      case 'day':
        return format(selectedDate, 'PPP');
      case 'week':
        // Get the start of the week (Monday) and end of the week (Sunday)
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'year':
        return format(selectedDate, 'yyyy');
      default:
        return 'All Time';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 mb-2">
      <Select
        value={filterOption}
        onValueChange={(value) => onFilterChange(value as DateFilterOption)}
      >
        <SelectTrigger className="w-[140px] bg-black/40 border-white/20 text-white">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 backdrop-blur-lg border-white/20 text-white">
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>

      {filterOption !== 'all' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-black/40 border-white/20 text-white hover:bg-white/10 hover:text-white",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getFormattedDate()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-lg border-white/20 text-white">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className="bg-transparent pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateFilter;
