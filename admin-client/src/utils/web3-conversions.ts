import { getCurrencyPrecision } from '@/currency.config';
import { BigNumber, ethers } from 'ethers';

export function convertFromWeiToDisplay(
    amount: string | number,
    currencyCode: string,
    chainId: number
): string {
    const precision = getCurrencyPrecision(currencyCode, chainId);

    if (precision) {
        const amountString = amount.toString().padStart(precision.native, '0');
        const differential = amountString.length - precision.native;
        let output = `${amountString.substring(
            0,
            differential
        )}.${amountString.substring(differential).substring(0, precision.display)}`;

        while (
            output.endsWith('0') &&
            !output.endsWith(''.padEnd(precision.display, '0'))
        ) {
            output = output.substring(0, output.length - 1);
        }
        if (output.startsWith('.')) output = `0${output}`;
        while (output.startsWith('0') && !output.startsWith('0.')) {
            output = output.substring(1);
        }
        return output;
    }
    return '';
}

/**
 * Converts any number decimal number (expressed as string or number) to an appropriate
 * number of wei units, given the currency.
 *
 * @param amount Amount as decimal
 * @param currencyCode usdc, usdt, eth
 * @returns The value converted to smallest units of the currency (as BigNumber)
 */
export function convertToWei(
    amount: string | number,
    currencyCode: string,
    chainId: number
): BigNumber {
    try {
        const precision = getCurrencyPrecision(currencyCode, chainId);
        return precision
            ? convertToUnits(amount, precision.native)
            : BigNumber.from(0);
    } catch (e) {
        console.log(e);
    }

    return BigNumber.from(0);
}

/**
 * Converts any number decimal number (expressed as string or number) to a given number
 * of units.
 * Example: convertToUnits(3.21, 3) will return 3210.
 *
 * @param amount Amount as decimal
 * @param units Number of units
 * @param currencyCode usdc, usdt, eth
 * @returns The value converted to given number of units of the currency (as BigNumber)
 */
export function convertToUnits(
    amount: string | number,
    units: number
): BigNumber {
    try {
        const amt = amount.toString();
        const decimalPlaces = amt.includes('.') ? amt.split('.')[1].length : 0;

        return ethers.utils
            .parseUnits(amt, decimalPlaces)
            .mul(BigNumber.from(10).pow(units - decimalPlaces));
    } catch (e) {
        console.log(e);
    }

    return BigNumber.from(0);
}
