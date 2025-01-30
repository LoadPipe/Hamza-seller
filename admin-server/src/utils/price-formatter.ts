import { getCurrencyPrecision } from '../currency.config';

export function formatCryptoPrice(
    amount: number,
    currencyCode: string
): string | number {
    try {
        if (!currencyCode?.length) currencyCode = 'usdc';
        if (!amount) amount = 0;

        const displayPrecision = getCurrencyPrecision(currencyCode).db ?? 2;

        // Scale down the amount
        amount = amount / 10 ** displayPrecision;

        // Format based on display precision
        return displayPrecision <= 2
            ? amount.toFixed(2)
            : parseFloat(amount.toFixed(displayPrecision));
    } catch (e) {
        console.error(e);
        return '0.00';
    }
}

export function reverseCryptoPrice(
    formattedAmount: number | string,
    currencyCode: string = 'eth',
    chainId: number = 1
): number {
    try {
        // Set precision: default to 8 for eth, otherwise 2
        const precision =
            getCurrencyPrecision(currencyCode, chainId)?.db ??
            (currencyCode === 'eth' ? 8 : 2);

        return Math.floor(
            parseFloat(formattedAmount.toString()) * 10 ** precision
        );
    } catch (e) {
        console.error('Error in reverseCryptoPrice:', e.message);
        return 0;
    }
}
