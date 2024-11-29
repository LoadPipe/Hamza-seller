import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { DateOptions } from '@/utils/status-enum';
import DatePickerWithRange from '@/components/date-picker-filter/date-picker-with-range';

type DatePickerFilterProps = {
    title: string;
    onDateRangeChange: (range: { start: number; end: number }) => void;
};

export default function DatePickerFilter({
    title,
    onDateRangeChange,
}: DatePickerFilterProps) {
    const [selectedOption, setSelectedOption] = useState<DateOptions | null>(
        DateOptions.WEEK // Default selection
    );
    // const [customRange, setCustomRange] = useState<{
    //     start: number;
    //     end: number;
    // } | null>(null);

    const handleSelect = (option: DateOptions) => {
        setSelectedOption(option);
        if (option !== DateOptions.CUSTOM_DATE_RANGE) {
            const range = calculateDateRange(option);
            onDateRangeChange(range);
        }
    };

    const handleCustomRangeChange = (range: {
        from: Date | null;
        to?: Date | null;
    }) => {
        if (range.from && range.to) {
            const formattedRange = {
                start: range.from.getTime(),
                end: range.to.getTime(),
            };
            // setCustomRange(formattedRange);
            onDateRangeChange(formattedRange);
        }
    };

    return (
        <div className="relative">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="flex items-center gap-2 px-4 py-2 border h-[34px] rounded-full shadow-sm bg-secondary-charcoal-69"
                        aria-label="Date Picker"
                    >
                        {title}
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[240px] p-2 mt-2 bg-secondary-charcoal-69 rounded-lg shadow-lg text-white"
                        sideOffset={5}
                    >
                        {Object.entries(DateOptions).map(([key, label]) => (
                            <div
                                key={key}
                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-secondary-onyx-900 rounded-md"
                                onClick={() => handleSelect(key as DateOptions)}
                            >
                                <input
                                    type="radio"
                                    id={key}
                                    checked={selectedOption === key}
                                    className="form-radio h-5 w-5 text-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={key} className="cursor-pointer">
                                    {label}
                                </label>
                            </div>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {selectedOption === DateOptions.CUSTOM_DATE_RANGE && (
                <DatePickerWithRange
                    className="mt-4 p-2 border-t border-gray-200"
                    onRangeChange={handleCustomRangeChange}
                />
            )}
        </div>
    );
}

import {
    subDays,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
} from 'date-fns';

const calculateDateRange = (option: DateOptions) => {
    const now = new Date();
    switch (option) {
        case DateOptions.WEEK:
            return { start: subDays(now, 7).getTime(), end: now.getTime() };
        case DateOptions.TWO_WEEKS:
            return { start: subDays(now, 14).getTime(), end: now.getTime() };
        case DateOptions.MONTH:
            return {
                start: startOfMonth(now).getTime(),
                end: endOfMonth(now).getTime(),
            };
        case DateOptions.LAST_MONTH:
            const lastMonth = subDays(startOfMonth(now), 1);
            return {
                start: startOfMonth(lastMonth).getTime(),
                end: endOfMonth(lastMonth).getTime(),
            };
        case DateOptions.YEAR:
            return {
                start: startOfYear(now).getTime(),
                end: endOfYear(now).getTime(),
            };
        case DateOptions.LAST_YEAR:
            const lastYear = new Date(now.getFullYear() - 1, 0, 1);
            return {
                start: startOfYear(lastYear).getTime(),
                end: endOfYear(lastYear).getTime(),
            };
        default:
            return { start: 0, end: 0 }; // Default empty range
    }
};
