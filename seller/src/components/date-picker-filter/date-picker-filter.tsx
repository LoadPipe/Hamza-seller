import { useStore } from '@tanstack/react-store';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { DateOptions } from '@/utils/status-enum';
import {
    filterStore,
    setDatePickerFilter,
    clearFilter,
} from '@/stores/order-filter/order-filter-store';
import DatePickerWithRange from '@/components/date-picker-filter/date-picker-with-range';

export default function DatePickerFilter({ title }: { title: string }) {
    const { filters } = useStore(filterStore); // Fetch global filters
    const selectFilter = filters['created_at']; // Current filter state for "created_at"

    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: DateOptions) => {
        console.log('[handleSelect] Selected Option:', option);

        if (option !== DateOptions.CUSTOM_DATE_RANGE) {
            const { start, end } = calculateDateRange(option);
            setDatePickerFilter('created_at', { gte: start, lte: end }, option);
        } else {
            setDatePickerFilter('created_at', { gte: 0, lte: 0 }, option); // Default for custom
        }
    };

    const handleCustomRangeChange = (range: { from: Date; to?: Date }) => {
        if (range.from && range.to) {
            setDatePickerFilter(
                'created_at',
                { gte: range.from.getTime(), lte: range.to.getTime() },
                DateOptions.CUSTOM_DATE_RANGE
            );
        }
    };

    const clearFilters = () => {
        clearFilter('created_at');
    };

    const getButtonLabel = () => {
        if (selectFilter) {
            const { gte, lte, optionLabel } = selectFilter;
            if (optionLabel === DateOptions.CUSTOM_DATE_RANGE && gte && lte) {
                return `${new Date(gte).toLocaleDateString()} - ${new Date(
                    lte
                ).toLocaleDateString()}`;
            }
            return optionLabel || title;
        }
        return title;
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
                                    checked={
                                        selectFilter?.optionLabel === value
                                    }
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
                        {selectFilter?.optionLabel ===
                            DateOptions.CUSTOM_DATE_RANGE && (
                            <DatePickerWithRange
                                onRangeChange={handleCustomRangeChange}
                                selectedRange={
                                    selectFilter?.gte && selectFilter?.lte
                                        ? {
                                              from: new Date(selectFilter.gte),
                                              to: new Date(selectFilter.lte),
                                          }
                                        : undefined
                                }
                            />
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Apply
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Clear
                            </button>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}

// Calculate Date Range
import {
    subDays,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
} from 'date-fns';
import { useState } from 'react';

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
            return { start: null, end: null };
    }
};
