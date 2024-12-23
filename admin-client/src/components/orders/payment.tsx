import currencyIcons from '../../../public/currencies/crypto-currencies.ts';
import { convertCryptoPrice } from '@/utils/get-product-price.ts';
import React from 'react';

type PaymentProps = {
    subtotal: string | number;
    discount: number;
    currencyCode: string;
    shippingFee: string;
    total: string | number;
};

const Payment: React.FC<PaymentProps> = ({
    subtotal,
    discount,
    currencyCode,
    shippingFee,
    total,
}) => {
    const [convertedPrice, setConvertedPrice] = React.useState<string | null>(
        null
    );

    React.useEffect(() => {
        const fetchConvertedPrice = async () => {
            const result = await convertCryptoPrice(
                Number(total),
                'eth',
                'usdc'
            );
            const formattedResult = Number(result).toFixed(2);
            setConvertedPrice(formattedResult);
        };

        if (currencyCode === 'eth') {
            fetchConvertedPrice();
        }
    }, [currencyCode]);

    return (
        <div className="flex flex-col">
            {/* Payment Header */}
            <div>
                <h2 className="text-primary-black-60 text-sm uppercase pb-[16px]">
                    Payment
                </h2>
            </div>

            {/* Subtotal, Discount, Shipping Fee Rows */}
            <div className="flex flex-col ">
                <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-semibold">
                        Subtotal
                    </span>
                    <img
                        className="ml-auto mr-1 h-[12px] w-[12px] md:h-[16px] md:w-[16px]"
                        src={currencyIcons[currencyCode ?? 'usdc']}
                        alt={currencyCode ?? 'usdc'}
                    />
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
                        className="ml-auto mr-1 h-[12px] w-[12px] md:h-[16px] md:w-[16px]"
                        src={currencyIcons[currencyCode ?? 'usdc']}
                        alt={currencyCode ?? 'usdc'}
                    />
                    <span className="text-white font-bold text-xl">
                        {total}
                    </span>
                </div>
            </div>
            {currencyCode === 'eth' && (
                <div className="flex items-center">
                    <img
                        className="ml-auto mr-1 h-[12px] w-[12px] md:h-[16px] md:w-[16px]"
                        src={currencyIcons['usdc']}
                        alt={'usdt'}
                    />
                    <span className="text-white opacity-60 font-bold text-l">
                        ≅ {convertedPrice}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Payment;
