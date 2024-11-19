type ItemProps = {
    name: string;
    variants: string;
    quantity: number;
    subtotal: string;
    discount: string;
    total: string;
    image: string;
};
const Item: React.FC<ItemProps> = ({
    name,
    variants,
    quantity,
    subtotal,
    discount,
    total,
    image,
}) => {
    return (
        <div className="flex flex-col mb-[24px] last:mb-0">
            {/* Main Content Row */}
            <div className="flex items-start">
                {/* Image */}
                <div className="h-[48px] w-[48px] flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Details and Quantity */}
                <div className="flex flex-1 ml-4 items-center">
                    {/* Product Details */}
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-md leading-tight">
                            {name}
                        </h3>
                        <p className="text-primary-black-60 text-sm leading-relaxed">
                            {variants}
                        </p>
                    </div>

                    {/* Quantity */}
                    <div className="text-center mr-4">
                        <span className="text-white font-bold text-lg">
                            x{quantity}
                        </span>
                    </div>

                    {/* Price Breakdown */}
                    <div className="text-right text-primary-black-60 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="text-white font-semibold text-right">
                                {subtotal}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount:</span>
                            <span className="text-white font-semibold text-right">
                                {discount}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="text-white font-semibold text-right">
                                {total}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Item;
