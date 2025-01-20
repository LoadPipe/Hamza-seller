import { getCurrencyPrecision } from '@/currency.config.ts';
import { convertPrice } from './price-conversion';

export function formatCryptoPrice(
    amount: number,
    currencyCode: string = 'usdc'
): string | number {
    try {
        if (!currencyCode?.length) currencyCode = 'usdc';
        if (!amount) amount = 0;
        const displayPrecision = getCurrencyPrecision(currencyCode).db ?? 2;
        amount = amount / 10 ** displayPrecision;

        let output =
            displayPrecision <= 2
                ? Number(amount).toFixed(2)
                : parseFloat(Number(amount).toFixed(displayPrecision));

        output =
            displayPrecision <= 2
                ? output
                : limitPrecision(
                      parseFloat(output.toString()),
                      getCurrencyPrecision(currencyCode).display
                  );

        return output;
    } catch (e) {
        console.error(e);
        return '0.00';
    }
}

export async function convertCryptoPrice(
    amount: number,
    from: string,
    to: string
): Promise<number> {
    return await convertPrice(amount, from, to);
}

function limitPrecision(value: number, maxDigits: number): string {
    return removeTrailingZeros(value.toFixed(maxDigits));
}

function removeTrailingZeros(value: string): string {
    if (value.indexOf('.') >= 0) {
        value = value.replace(/\.?0+$/, '');
    }
    return value;
}

export function reverseCryptoPrice(
    formattedAmount: number | string,
    currencyCode: string = 'usdc'
): number {
    try {
        console.log(`reverseCryptoPrice: ${formattedAmount}, ${currencyCode}`);
        if (!currencyCode?.length) currencyCode = 'usdc';
        if (!formattedAmount) formattedAmount = 0;

        // Ensure the formattedAmount is a number
        const amount =
            typeof formattedAmount === 'string'
                ? parseFloat(formattedAmount)
                : formattedAmount;

        // Get the db precision for the currency
        const dbPrecision = getCurrencyPrecision(currencyCode)?.db ?? 2;

        // Reverse the scaling by multiplying with 10 ** dbPrecision
        const originalAmount = amount * 10 ** dbPrecision;

        return originalAmount;
    } catch (e) {
        console.error(e);
        return 0; // Default fallback for errors
    }
}
