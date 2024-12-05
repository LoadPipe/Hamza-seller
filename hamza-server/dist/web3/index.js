"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentForOrder = verifyPaymentForOrder;
exports.getAmountPaidForOrder = getAmountPaidForOrder;
const lite_switch_1 = require("./contracts/lite-switch");
async function verifyPaymentForOrder(chainId, transactionId, orderId, amount) {
    const total = await getAmountPaidForOrder(chainId, transactionId, orderId, amount);
    return (total >= BigInt(amount));
}
async function getAmountPaidForOrder(chainId, transactionId, orderId, amount) {
    const switchClient = new lite_switch_1.LiteSwitchClient(chainId);
    const events = await switchClient.findPaymentEvents(orderId, transactionId);
    //console.log('events: ', events);
    let total = BigInt(0);
    if (events.length) {
        events.map(e => total = total + BigInt(e.amount.toString()));
    }
    return (BigInt(total));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2ViMy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLHNEQVFDO0FBRUQsc0RBZ0JDO0FBN0JELHlEQUEyRDtBQUdwRCxLQUFLLFVBQVUscUJBQXFCLENBQ3ZDLE9BQWUsRUFDZixhQUFxQixFQUNyQixPQUFlLEVBQ2YsTUFBb0I7SUFFcEIsTUFBTSxLQUFLLEdBQVcsTUFBTSxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRixPQUFPLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFTSxLQUFLLFVBQVUscUJBQXFCLENBQ3ZDLE9BQWUsRUFDZixhQUFxQixFQUNyQixPQUFlLEVBQ2YsTUFBb0I7SUFFcEIsTUFBTSxZQUFZLEdBQUcsSUFBSSw4QkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUUsa0NBQWtDO0lBRWxDLElBQUksS0FBSyxHQUFXLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzQixDQUFDIn0=