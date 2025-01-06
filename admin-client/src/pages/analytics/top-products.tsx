export function TopProducts() {
    const products = [
        { item: 'Macbook Pro 14" M3 Chip', qtySold: 4200 },
        { item: 'Macbook Pro 14" M3 Chip', qtySold: 4100 },
        { item: 'Macbook Pro 14" M3 Chip', qtySold: 4000 },
        { item: 'Macbook Pro 14" M3 Chip', qtySold: 3900 },
    ];

    return (
        <div className="bg-[#1A1A1A] p-4 rounded-lg shadow-md text-white h-full flex flex-col">
            <h2 className="text-lg font-medium mb-4">Top Products</h2>
            <ul className="mt-4 space-y-2 overflow-auto">
                {products.map((product, index) => (
                    <li
                        key={index}
                        className="flex justify-between border-b border-gray-700 pb-2"
                    >
                        <span className="truncate">{product.item}</span>
                        <span className="font-bold">
                            {product.qtySold.toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
