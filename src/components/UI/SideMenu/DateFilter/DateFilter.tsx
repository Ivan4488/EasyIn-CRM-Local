import * as React from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "~/icons/ui/Calendar";
import classNames from "classnames";
import { Popover, PopoverContent, PopoverTrigger } from "../../Popover/Popover";
import { Calendar } from "../../Calendar/calendar";
import { DateRange } from "react-day-picker";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { MenuItemId } from "../MenuItem";

interface DateFilterProps {
  dateRange: DateRange | undefined;
  id: MenuItemId;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export const DateFilter = ({
  dateRange,
  id,
  onDateRangeChange,
}: DateFilterProps) => {
  const [open, setOpen] = React.useState(false);
  // Add local state to track temporary selection before applying
  const [tempDateRange, setTempDateRange] = React.useState<DateRange | undefined>(dateRange);
  const leftMenuStore = useLeftMenuStore();

  // Update tempDateRange when dateRange from props changes
  React.useEffect(() => {
    setTempDateRange(dateRange);
  }, [dateRange]);

  // Check if we need to initialize dateRange from leftMenuStore
  React.useEffect(() => {
    if (!dateRange && leftMenuStore.activeItems.find(item => item.startsWith('date-filter-active'))) {
      // Use the store's dateRange directly
      if (leftMenuStore.dateRange && onDateRangeChange) {
        onDateRangeChange(leftMenuStore.dateRange);
      }
    }
  }, []);

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    // Only update the temporary selection
    setTempDateRange(range);

    // Remove the auto-closing behavior when a complete range is selected
    // We'll only close when Apply is clicked or user clicks outside
  };

  // Format the displayed date range
  const formatDateRange = () => {
    if (!dateRange) return "Date";

    const fromDate = dateRange.from
      ? format(dateRange.from, "MMM d")
      : "";
    const toDate = dateRange.to ? format(dateRange.to, "MMM d") : "";

    if (fromDate && toDate) {
      return `${fromDate} - ${toDate}`;
    } else if (fromDate) {
      return `From ${fromDate}`;
    }

    return "Date";
  };

  // Handler for Apply button
  const handleApply = () => {
    if (onDateRangeChange) {
      onDateRangeChange(tempDateRange);
    }
    setOpen(false);
  };
  
  // Handler for Clear button
  const handleClear = () => {
    setTempDateRange(undefined);
    if (onDateRangeChange) {
      onDateRangeChange(undefined);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger
          className="hover:ring-hover-2 data-[state=open]:ring-strong-green cursor-pointer"
          asChild
        >
          <button
            // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
            role="combobox"
            aria-expanded={open}
            className={classNames(
              "flex w-full items-center text-display-16 font-semibold hover:bg-hover-1 flex-row gap-[6px] transition-text rounded-[12px] px-[16px] py-[6px]",
              dateRange?.from ? "text-strong-green" : "text-text-weak"
            )}
          >
            <div className="p-[10px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
            </div>
            <p>{formatDateRange()}</p>
          </button>
        </PopoverTrigger>
      </div>

      <PopoverContent side="right" align="center" className="w-auto p-0 ml-4">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={tempDateRange}
          onSelect={handleDateRangeSelect}
          numberOfMonths={2}
          initialFocus
        />
        <div className="flex flex-row justify-end gap-[16px] border-t border-gray-moderate p-[16px]">
          <button 
            className="text-display-15 font-semibold text-text-weak hover:text-gray-moderate transition-text"
            onClick={handleClear}
          >
            CLEAR
          </button>
          <button 
            className="text-display-15 font-semibold text-strong-green hover:text-hover-green transition-text"
            onClick={handleApply}
          >
            APPLY
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
