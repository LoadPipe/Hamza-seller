import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

type DropdownMultiselectFilterProps = {
    title: string;
    optionsEnum: Record<string, string>;
    onFilterChange: (selected: string[] | null) => void;
    selectedFilters: string[];
};

export default function DropdownMultiselectFilter({
    title,
    optionsEnum,
    onFilterChange,
    selectedFilters = [],
}: DropdownMultiselectFilterProps) {
    const [temporarySelection, setTemporarySelection] = React.useState<
        string[]
    >(selectedFilters || []);
    // console.log(
    //     `DUCK DUCK: ${title} \n ENUM: ${JSON.stringify(optionsEnum)} \n FILTER FUNC
    //    \n SELECTED FILTERS${JSON.stringify(selectedFilters)}`
    // );

    const [isOpen, setIsOpen] = React.useState(false);
    const options = Object.values(optionsEnum);

    const handleToggle = (option: string) => {
        setTemporarySelection((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const applyFilter = () => {
        console.log(`Applying filter: ${JSON.stringify(temporarySelection)}`);

        if (temporarySelection.length > 0) {
            onFilterChange(temporarySelection);
            setIsOpen(false);
        } else {
            onFilterChange(null);
            setTemporarySelection([]);
            setIsOpen(false);
        }
    };

    const clearFilter = () => {
        onFilterChange(null);
        setTemporarySelection([]);
        setIsOpen(false);
    };

    React.useEffect(() => {
        if (isOpen) {
            setTemporarySelection(selectedFilters);
        }
    }, [isOpen, selectedFilters]);

    return (
        <div className="relative">
            <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="flex items-center gap-2 px-4 py-2 border h-[44px] text-sm rounded shadow-sm bg-secondary-charcoal-69"
                        aria-label="Customize options"
                    >
                        <p className="truncate overflow-hidden text-ellipsis">
                            {title}
                        </p>

                        <ChevronDown className="h-4 w-4" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[240px] max-h-[300px] p-2 mt-2 bg-secondary-charcoal-69 rounded text-white border border-primary-purple-90 overflow-y-auto"
                        sideOffset={5}
                    >
                        {options.map((option) => (
                            <div
                                key={option}
                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-secondary-onyx-900 rounded-md"
                            >
                                <input
                                    type="checkbox"
                                    id={option}
                                    checked={temporarySelection.includes(
                                        option
                                    )} // Reflect temporary state
                                    onChange={() => handleToggle(option)}
                                    className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor={option}
                                    className="cursor-pointer"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                        <DropdownMenu.Item>
                            {/* Buttons */}
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
                                    Clear Filters
                                </button>
                            </div>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}
