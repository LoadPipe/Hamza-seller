import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerWithRangeProps = React.HTMLAttributes<HTMLDivElement> & {
    onRangeChange?: (range: { from: Date; to?: Date }) => void;
    selectedRange?: DateRange; // DateRange type from react-day-picker
};

export default function DatePickerWithRange({
    className,
    onRangeChange,
    selectedRange,
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(
        selectedRange
    );

    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (selectedRange) {
            setDate(selectedRange); // Sync the internal state with the parent state
        }
    }, [selectedRange]);

    const handleDateChange = (range: DateRange | undefined) => {
        setDate(range);

        // Ensure `from` is defined before calling `onRangeChange`
        if (range?.from) {
            onRangeChange?.({
                from: range.from,
                to: range.to,
            });
        }
    };

    const handleOpen = () => {
        setIsOpen(false);
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} -{' '}
                                    {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                    />
                    <div className="flex justify-end p-2 border-t">
                        <Button
                            variant="default"
                            className="bg-primary-purple-90 hover:bg-blue-600 text-white"
                            onClick={() => setIsOpen(false)} // Close the popover
                        >
                            Accept
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
