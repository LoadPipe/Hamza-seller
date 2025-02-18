export 
function VariantsTable({ addProductForm }: { addProductForm: any }) {
    const attributes = addProductForm.getFieldValue('attributes') || [];
    const variants = addProductForm.getFieldValue('variants') || [];

    if (!variants.length) {
        return null;
    }

    return (
        <div className="bg-[#040404] p-4 rounded-md">
            {/* Header row */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                    <span className="text-gray-300">Select</span>
                    <button
                        type="button"
                        className="text-[#A3EB64] hover:underline"
                    >
                        All
                    </button>
                    <span className="text-gray-300">/</span>
                    <button
                        type="button"
                        className="text-[#A3EB64] hover:underline"
                    >
                        None
                    </button>
                </div>

                {/* One column header per attribute */}
                {attributes.map((attr) => (
                    <div
                        key={attr.name}
                        className="text-white font-semibold ml-4"
                    >
                        {attr.name}
                    </div>
                ))}

                <div className="ml-auto text-gray-400">Actions</div>
            </div>

            {/* Table body */}
            <div className="divide-y divide-[#333]">
                {variants.map((variant: any, idx: number) => {
                    const { combination } = variant;
                    return (
                        <div key={idx} className="flex items-center gap-2 py-3">
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-[#A3EB64]"
                            />

                            {/* Each attribute value in its own "column" */}
                            {combination.map((val: string, i: number) => (
                                <div
                                    key={i}
                                    className="ml-4 bg-[#121212] px-3 py-1 rounded-md text-white"
                                >
                                    {val}
                                </div>
                            ))}

                            <div className="ml-auto flex items-center gap-3">
                                <button
                                    type="button"
                                    className="p-1 text-white hover:text-gray-300"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="p-1 text-red-500 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
