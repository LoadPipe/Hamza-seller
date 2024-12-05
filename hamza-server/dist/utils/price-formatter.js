"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCryptoPrice = formatCryptoPrice;
const currency_config_1 = require("../currency.config");
function formatCryptoPrice(amount, currencyCode) {
    var _a;
    try {
        if (!(currencyCode === null || currencyCode === void 0 ? void 0 : currencyCode.length))
            currencyCode = 'usdc';
        if (!amount)
            amount = 0;
        const displayPrecision = (_a = (0, currency_config_1.getCurrencyPrecision)(currencyCode).db) !== null && _a !== void 0 ? _a : 2;
        amount = amount / 10 ** displayPrecision;
        return displayPrecision <= 2
            ? Number(amount).toFixed(2)
            : parseFloat(Number(amount).toFixed(displayPrecision));
    }
    catch (e) {
        console.error(e);
        return '0.00';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtZm9ybWF0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3ByaWNlLWZvcm1hdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQWtCQztBQXBCRCx3REFBMEQ7QUFFMUQsU0FBZ0IsaUJBQWlCLENBQzdCLE1BQWMsRUFDZCxZQUFvQjs7SUFFcEIsSUFBSSxDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUEsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLE1BQU0sQ0FBQTtZQUNyQixZQUFZLEdBQUcsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNO1lBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN4QixNQUFNLGdCQUFnQixHQUFHLE1BQUEsSUFBQSxzQ0FBb0IsRUFBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLG1DQUFJLENBQUMsQ0FBQztRQUNwRSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQztRQUV6QyxPQUFPLGdCQUFnQixJQUFJLENBQUM7WUFDeEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7QUFDTCxDQUFDIn0=