import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

type DropdownMultiselectFilterProps = {
    title: string;
    optionsEnum: Record<string, string>; // Dynamically accept any enum type
};

export default function DropdownMultiselectFilter({
    title,
    optionsEnum,
}: DropdownMultiselectFilterProps) {
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    const [temporarySelection, setTemporarySelection] = React.useState<
        string[]
    >([]);
    const options = Object.values(optionsEnum);

    const handleToggle = (option: string) => {
        setTemporarySelection((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const applyFilter = () => {
        setSelectedOptions(temporarySelection);
    };

    const cancelFilter = () => {
        setTemporarySelection(selectedOptions); // Reset to last applied state
    };

    return (
        <div className="relative">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="flex items-center gap-2 px-4 py-2 border h-[34px] text-sm rounded-full shadow-sm bg-secondary-charcoal-69"
                        aria-label="Customise options"
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
                                    )}
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

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                onClick={applyFilter}
                            >
                                Filter
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={cancelFilter}
                            >
                                Cancel
                            </button>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}
