import { BigNumber } from 'ethers';

export function convertAmountToSmallestUnit(amount, decimals) {
    const multiplier = BigNumber.from(10).pow(decimals);
    const amountInSmallestUnit = BigNumber.from(amount).mul(multiplier);
    return amountInSmallestUnit.toString(); // Returns the amount as a string
}
