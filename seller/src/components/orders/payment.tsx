type PaymentProps = {
    subtotal: string;
    discount: string;
    shippingFee: string;
    total: string;
};

const Payment: React.FC<PaymentProps> = ({
    subtotal,
    discount,
    shippingFee,
    total,
}) => {
    return (
        <div className="flex flex-col">
            {/* Payment Header */}
            <div>
                <h2 className="text-primary-black-60 text-sm uppercase pb-[16px]">
                    Payment
                </h2>
            </div>

            {/* Subtotal, Discount, Shipping Fee Rows */}
            <div className="flex flex-col">
                <div className="flex justify-between">
                    <span className="text-white text-sm font-semibold">
                        Subtotal
                    </span>
                    <span className="text-white font-semibold text-lg">
                        {subtotal}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white font-semibold text-sm">
                        Discount
                    </span>
                    <span className="text-white font-semibold text-lg">
                        {discount}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white font-semibold text-sm">
                        Shipping fee
                    </span>
                    <span className="text-white font-semibold text-lg">
                        {shippingFee}
                    </span>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-[20px]">
                <span className="text-white font-bold text-lg uppercase">
                    Total
                </span>
                <div className="flex items-center">
                    <img
                        src="" // Replace with your icon path
                        alt="Currency Icon"
                        className="h-6 w-6 mr-2"
                    />
                    <span className="text-white font-bold text-xl">
                        {total}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Payment;
