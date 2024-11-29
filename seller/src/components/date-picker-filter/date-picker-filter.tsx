import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { DateOptions } from '@/utils/status-enum';
import DatePickerWithRange from '@/components/date-picker-filter/date-picker-with-range';

type DatePickerFilterProps = {
    title: string;
    selectedFilters?: { gte: number; lte: number } | null;
    onDateRangeChange: (
        range: { start: number; end: number } | null,
        selectedOption: string | null // Include selected option label
    ) => void;
};

export default function DatePickerFilter({
    title,
    selectedFilters,
    onDateRangeChange,
}: DatePickerFilterProps) {
    const [selectedOption, setSelectedOption] = useState<DateOptions | null>(
        null
    );
    const [isOpen, setIsOpen] = useState(false);
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

    useEffect(() => {
        console.log('[DatePickerFilter] Selected Filters:', selectedFilters);
        if (selectedFilters) {
            setCustomRange({
                start: selectedFilters.gte,
                end: selectedFilters.lte,
            });

            const optionLabel =
                'optionLabel' in selectedFilters
                    ? (selectedFilters.optionLabel as DateOptions)
                    : DateOptions.CUSTOM_DATE_RANGE;
            setSelectedOption(optionLabel);
        }
    }, [selectedFilters]);

    const getDateOptionLabel = (option: DateOptions): string => {
        const dateOptionsMap: Record<DateOptions, string> = Object.fromEntries(
            Object.entries(DateOptions).map(([value]) => [
                value as DateOptions,
                value,
            ])
        ) as Record<DateOptions, string>;

        return dateOptionsMap[option] || 'Custom Date Range';
    };

    const handleSelect = (option: DateOptions) => {
        setTemporaryOption(option);
        if (option !== DateOptions.CUSTOM_DATE_RANGE) {
            const range = calculateDateRange(option);
            setTemporaryCustomRange(range);
        }
    };

    const handleCustomRangeChange = (range: { from: Date; to?: Date }) => {
        if (range.from && range.to) {
            setTemporaryCustomRange({
                start: range.from.getTime(),
                end: range.to.getTime(),
            });
        }
    };

    const applyFilter = () => {
        setSelectedOption(temporaryOption);
        setCustomRange(temporaryCustomRange);

        const optionLabel = temporaryOption
            ? getDateOptionLabel(temporaryOption)
            : null;

        onDateRangeChange(temporaryCustomRange, optionLabel);
        setIsOpen(false);
    };

    const clearFilter = () => {
        setSelectedOption(null);
        setTemporaryOption(null);
        setCustomRange(null);
        setTemporaryCustomRange(null);
        onDateRangeChange(null, null);
        setIsOpen(false);
    };

    const getButtonLabel = () => {
        if (selectedOption === DateOptions.CUSTOM_DATE_RANGE && customRange) {
            return `${new Date(customRange.start).toLocaleDateString()} - ${new Date(
                customRange.end
            ).toLocaleDateString()}`;
        }
        return selectedOption ? getDateOptionLabel(selectedOption) : title;
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
                    <DropdownMenu.Content className="min-w-[240px] p-2 mt-2 bg-secondary-charcoal-69 rounded-lg shadow-lg text-white">
                        {Object.entries(DateOptions).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-secondary-onyx-900 rounded-md"
                                onClick={() =>
                                    handleSelect(value as DateOptions)
                                }
                            >
                                <input
                                    type="radio"
                                    id={key}
                                    checked={temporaryOption === value}
                                    onChange={() =>
                                        handleSelect(value as DateOptions)
                                    }
                                    className="form-radio h-5 w-5 text-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={key} className="cursor-pointer">
                                    {value}
                                </label>
                            </div>
                        ))}
                        {temporaryOption === DateOptions.CUSTOM_DATE_RANGE && (
                            <DatePickerWithRange
                                className="mt-4 p-2 border-t border-gray-200"
                                onRangeChange={handleCustomRangeChange}
                                selectedRange={
                                    customRange
                                        ? {
                                              from: new Date(customRange.start),
                                              to: new Date(customRange.end),
                                          }
                                        : undefined
                                }
                            />
                        )}
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
    console.log('[calculateDateRange] Received option:', option);
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
            console.warn('[calculateDateRange] Unrecognized option:', option);
            return null;
    }
};
