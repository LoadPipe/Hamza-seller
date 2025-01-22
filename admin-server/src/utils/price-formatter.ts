import { getCurrencyPrecision } from '../currency.config';

export function formatCryptoPrice(
    amount: number,
    currencyCode: string
): string | number {
    try {
        if (!currencyCode?.length) currencyCode = 'usdc';
        if (!amount) amount = 0;
        const displayPrecision = getCurrencyPrecision(currencyCode).db ?? 2;
        amount = amount / 10 ** displayPrecision;

        return displayPrecision <= 2
            ? Number(amount).toFixed(2)
            : parseFloat(Number(amount).toFixed(displayPrecision));
    } catch (e) {
        console.error(e);
        return '0.00';
    }
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

        // Get the correct precision for the currency
        const precision =
            currencyCode === 'eth'
                ? (getCurrencyPrecision(currencyCode)?.native ?? 18)
                : (getCurrencyPrecision(currencyCode)?.db ?? 2);

        // Reverse the scaling by multiplying with 10 ** precision
        const originalAmount = amount * 10 ** precision;

        // Ensure no more than the required decimal places
        const roundedAmount = parseFloat(originalAmount.toFixed(precision));

        return roundedAmount;
    } catch (e) {
        console.error(e);
        return 0; // Default fallback for errors
    }
}
