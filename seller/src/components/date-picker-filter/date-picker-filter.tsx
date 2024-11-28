import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { DateOptions } from '@/utils/status-enum';
import DatePickerWithRange from '@/components/date-picker-filter/date-picker-with-range';

type DatePickerFilterProps = {
    title: string;
    selectedFilters?: { gte: number; lte: number } | null;
    onDateRangeChange: (range: { start: number; end: number } | null) => void;
};

export default function DatePickerFilter({
    title,
    selectedFilters,
    onDateRangeChange,
}: DatePickerFilterProps) {
    const [selectedOption, setSelectedOption] = useState<DateOptions | null>(
        null // Default selection is null
    );
    const [isOpen, setIsOpen] = useState(false); // Manage dropdown state
    const [temporaryOption, setTemporaryOption] = useState<DateOptions | null>(
        null
    );
    const [customRange, setCustomRange] = useState<{
        start: number;
        end: number;
    } | null>(null);
    const [temporaryCustomRange, setTemporaryCustomRange] = useState<{
        start: number;
        end: number;
    } | null>(null);

    // Initialize from local storage or selectedFilters
    useEffect(() => {
        const storedFilters = localStorage.getItem('created_at');
        if (storedFilters) {
            const parsedFilters = JSON.parse(storedFilters);
            setCustomRange(parsedFilters);
            onDateRangeChange(parsedFilters);
        } else if (selectedFilters) {
            setCustomRange(selectedFilters);
        }
    }, [selectedFilters, onDateRangeChange]);

    const handleSelect = (option: DateOptions) => {
        setTemporaryOption(option);
        if (option !== DateOptions.CUSTOM_DATE_RANGE) {
            const range = calculateDateRange(option);
            setTemporaryCustomRange(range); // Update temporary range
        }
    };

    const handleCustomRangeChange = (range: { from: Date; to?: Date }) => {
        if (range.from && range.to) {
            const formattedRange = {
                start: range.from.getTime(),
                end: range.to.getTime(),
            };
            setTemporaryCustomRange(formattedRange); // Save temporary custom range
        }
    };

    const applyFilter = () => {
        setSelectedOption(temporaryOption); // Finalize selection
        setCustomRange(temporaryCustomRange); // Save finalized range
        onDateRangeChange(temporaryCustomRange); // Notify parent with selected range

        // Save to local storage
        if (temporaryCustomRange) {
            localStorage.setItem(
                'created_at',
                JSON.stringify(temporaryCustomRange)
            );
        }
        setIsOpen(false); // Close dropdown after applying the filter
    };

    const clearFilter = () => {
        setSelectedOption(null); // Clear selected option
        setTemporaryOption(null); // Reset temporary selection
        setCustomRange(null); // Clear range
        setTemporaryCustomRange(null); // Clear temporary range
        onDateRangeChange(null); // Notify parent to clear filter

        // Clear from local storage
        localStorage.removeItem('created_at');
        setIsOpen(false); // Close dropdown after clearing the filter
    };

    const getButtonLabel = () => {
        if (selectedOption === DateOptions.CUSTOM_DATE_RANGE && customRange) {
            return `${new Date(customRange.start).toLocaleDateString()} - ${new Date(
                customRange.end
            ).toLocaleDateString()}`;
        }
        return selectedOption ? DateOptions[selectedOption] : title;
    };

    return (
        <div className="relative">
            <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="flex items-center gap-2 px-4 py-2 border h-[34px] rounded-xl shadow-sm bg-secondary-charcoal-69"
                        aria-label="Date Picker"
                    >
                        {getButtonLabel()}
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
                                    checked={temporaryOption === key}
                                    onChange={() =>
                                        handleSelect(key as DateOptions)
                                    }
                                    className="form-radio h-5 w-5 text-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={key} className="cursor-pointer">
                                    {label}
                                </label>
                            </div>
                        ))}

                        {temporaryOption === DateOptions.CUSTOM_DATE_RANGE && (
                            <DatePickerWithRange
                                className="mt-4 p-2 border-t border-gray-200"
                                onRangeChange={handleCustomRangeChange}
                            />
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                onClick={applyFilter}
                            >
                                Apply
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={clearFilter}
                            >
                                Clear Filter
                            </button>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
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
            return {
                start: subDays(now, 7).setHours(0, 0, 0, 0),
                end: now.setHours(23, 59, 59, 999),
            };
        case DateOptions.TWO_WEEKS:
            return {
                start: subDays(now, 14).setHours(0, 0, 0, 0),
                end: now.setHours(23, 59, 59, 999),
            };
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
            return null;
    }
};
