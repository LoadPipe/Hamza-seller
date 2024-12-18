import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { DateOptions } from '@/utils/status-enum';
import DatePickerWithRange from '@/components/date-picker-filter/date-picker-with-range';

type DatePickerFilterProps = {
    title: string;
    selectedFilters?: { gte: number; lte: number; optionLabel?: string } | null;
    onDateRangeChange: (
        range: { start: number; end: number } | null,
        selectedOption: DateOptions | null
    ) => void;
};

export default function DatePickerFilter({
    title,
    selectedFilters,
    onDateRangeChange,
}: DatePickerFilterProps) {
    // Combined State for Temporary Selection
    const [temporarySelection, setTemporarySelection] = useState<{
        selectedOption: DateOptions | null;
        range: { start: number; end: number } | null;
    }>({ selectedOption: null, range: null });

    // Combined State for Selected Filters
    const [selectedSelection, setSelectedSelection] = useState<{
        selectedOption: DateOptions | null;
        range: { start: number; end: number } | null;
    }>({ selectedOption: null, range: null });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (selectedFilters) {
            const selectedOption =
                (selectedFilters.optionLabel as DateOptions) ||
                DateOptions.CUSTOM_DATE_RANGE;
            setSelectedSelection({
                selectedOption,
                range: {
                    start: selectedFilters.gte,
                    end: selectedFilters.lte,
                },
            });
            setTemporarySelection({
                selectedOption,
                range: {
                    start: selectedFilters.gte,
                    end: selectedFilters.lte,
                },
            });
        }
    }, [selectedFilters]);

    const handleSelect = (option: DateOptions) => {
        console.log('[handleSelect] Selected Option:', option);

        if (option !== DateOptions.CUSTOM_DATE_RANGE) {
            const { start, end } = calculateDateRange(option);
            setTemporarySelection({
                selectedOption: option,
                range: { start, end },
            });
        } else {
            setTemporarySelection({
                selectedOption: option,
                range: null, // Custom range will be set separately
            });
        }
    };

    const handleCustomRangeChange = (range: { from: Date; to?: Date }) => {
        setTemporarySelection((prev) => ({
            ...prev,
            range: {
                start: range.from.getTime(),
                end: (range.to ?? range.from).getTime(), // Default to `from` if `to` is undefined
            },
        }));
    };

    const applyFilter = () => {
        console.log('[applyFilter] Temporary Selection:', temporarySelection);

        setSelectedSelection(temporarySelection);
        onDateRangeChange(
            temporarySelection.range,
            temporarySelection.selectedOption
        );
        setIsOpen(false);
    };

    const clearFilter = () => {
        setSelectedSelection({ selectedOption: null, range: null });
        setTemporarySelection({ selectedOption: null, range: null });
        onDateRangeChange(null, null);
        setIsOpen(false);
    };

    const getButtonLabel = () => {
        const { selectedOption, range } = selectedSelection;
        if (selectedOption === DateOptions.CUSTOM_DATE_RANGE && range) {
            return `${new Date(range.start).toLocaleDateString()} - ${new Date(
                range.end
            ).toLocaleDateString()}`;
        }
        return selectedOption || title;
    };

    return (
        <div className="relative">
            <DropdownMenu.Root
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (open) {
                        setTemporarySelection(selectedSelection);
                    }
                }}
            >
                <DropdownMenu.Trigger asChild>
                    <button
                        className="flex items-center gap-2 px-4 py-2 border h-[44px] rounded shadow-sm bg-secondary-charcoal-69"
                        aria-label="Date Picker"
                    >
                        {getButtonLabel()}
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        forceMount
                        className="min-w-[240px] p-2 mt-2 bg-secondary-charcoal-69 rounded-lg shadow-lg text-white"
                    >
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
                                        temporarySelection.selectedOption ===
                                        value
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
                        {temporarySelection.selectedOption ===
                            DateOptions.CUSTOM_DATE_RANGE && (
                            <DatePickerWithRange
                                className="mt-4 p-2 border-t border-gray-200"
                                onRangeChange={handleCustomRangeChange}
                                selectedRange={
                                    temporarySelection.range
                                        ? {
                                              from: new Date(
                                                  temporarySelection.range.start
                                              ),
                                              to: new Date(
                                                  temporarySelection.range.end
                                              ),
                                          }
                                        : undefined
                                }
                            />
                        )}
                        <div className="flex gap-2 mt-4">
                            <button
                                className="px-4 py-2 text-sm font-medium rounded bg-primary-purple-90 hover:bg-primary-green-900 text-white border-none"
                                onClick={applyFilter}
                            >
                                Apply
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium rounded bg-transparent  border-primary-purple-90 hover:bg-red-600 hover:border-none"
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

// Calculate Date Range
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
            return {
                start: subDays(now, 7).setHours(0, 0, 0, 0),
                end: now.setHours(23, 59, 59, 999),
            };
    }
};
