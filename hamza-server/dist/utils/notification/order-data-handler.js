"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ordersDataParser;
const moment_1 = __importDefault(require("moment"));
const price_formatter_1 = require("../price-formatter");
function ordersDataParser(orders) {
    let parsedData = {};
    orders.forEach((order) => {
        if (parsedData[order.store_id]) {
            parsedData[order.store_id].orders.push({
                orderId: order.id,
                items: order.cart.items
                    .filter((a) => a.variant.product.store_id === order.store_id)
                    .map((a) => {
                    return {
                        thumbnail: a.thumbnail,
                        title: a.title,
                        quantity: a.quantity,
                        unit_price: `${(0, price_formatter_1.formatCryptoPrice)(a.unit_price, order.currency_code)} ${order.currency_code}`,
                    };
                }),
                orderDate: (0, moment_1.default)(order.created_at).format('MMMM Do YYYY, h:mm:ss a'),
                orderAmount: `${(0, price_formatter_1.formatCryptoPrice)(order.payments[0].amount, order.currency_code)} ${order.currency_code}`,
            });
        }
        else {
            parsedData[order.store_id] = {
                orders: [
                    {
                        orderId: order.id,
                        items: order.cart.items
                            .filter((a) => a.variant.product.store_id ===
                            order.store_id)
                            .map((a) => {
                            return {
                                thumbnail: a.thumbnail,
                                title: a.title,
                                quantity: a.quantity,
                                unit_price: `${(0, price_formatter_1.formatCryptoPrice)(a.unit_price, order.currency_code)} ${order.currency_code}`,
                            };
                        }),
                        orderDate: (0, moment_1.default)(order.created_at).format('MMMM Do YYYY, h:mm:ss a'),
                        orderAmount: `${(0, price_formatter_1.formatCryptoPrice)(order.payments[0].amount, order.currency_code)} ${order.currency_code}`,
                    },
                ],
                storeName: order.store.name,
                storeId: order.store_id,
                currencyCode: order.currency_code,
            };
        }
    });
    // console.log('parsed data');
    // console.dir(parsedData, { depth: null });
    return parsedData;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItZGF0YS1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL25vdGlmaWNhdGlvbi9vcmRlci1kYXRhLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxtQ0F1RUM7QUE1RUQsb0RBQTRCO0FBRTVCLHdEQUF1RDtBQUd2RCxTQUF3QixnQkFBZ0IsQ0FBQyxNQUFlO0lBQ3BELElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUVwQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDckIsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDN0IsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pCLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUs7cUJBQ2xCLE1BQU0sQ0FDSCxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQyxRQUFRLENBQ3ZEO3FCQUNBLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNQLE9BQU87d0JBQ0gsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTO3dCQUN0QixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7d0JBQ2QsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO3dCQUNwQixVQUFVLEVBQUUsR0FBRyxJQUFBLG1DQUFpQixFQUM1QixDQUFDLENBQUMsVUFBVSxFQUNaLEtBQUssQ0FBQyxhQUFhLENBQ3RCLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRTtxQkFDN0IsQ0FBQztnQkFDTixDQUFDLENBQUM7Z0JBQ04sU0FBUyxFQUFFLElBQUEsZ0JBQU0sRUFBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUN0Qyx5QkFBeUIsQ0FDNUI7Z0JBQ0QsV0FBVyxFQUFFLEdBQUcsSUFBQSxtQ0FBaUIsRUFDN0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQ3hCLEtBQUssQ0FBQyxhQUFhLENBQ3RCLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRTthQUM3QixDQUFDLENBQUM7UUFDUCxDQUFDO2FBQU0sQ0FBQztZQUNKLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7Z0JBQ3pCLE1BQU0sRUFBRTtvQkFDSjt3QkFDSSxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2pCLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUs7NkJBQ2xCLE1BQU0sQ0FDSCxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ0YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUTs0QkFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FDckI7NkJBQ0EsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7NEJBQ1AsT0FBTztnQ0FDSCxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVM7Z0NBQ3RCLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztnQ0FDZCxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7Z0NBQ3BCLFVBQVUsRUFBRSxHQUFHLElBQUEsbUNBQWlCLEVBQzVCLENBQUMsQ0FBQyxVQUFVLEVBQ1osS0FBSyxDQUFDLGFBQWEsQ0FDdEIsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFOzZCQUM3QixDQUFDO3dCQUNOLENBQUMsQ0FBQzt3QkFDTixTQUFTLEVBQUUsSUFBQSxnQkFBTSxFQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQ3RDLHlCQUF5QixDQUM1Qjt3QkFDRCxXQUFXLEVBQUUsR0FBRyxJQUFBLG1DQUFpQixFQUM3QixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFDeEIsS0FBSyxDQUFDLGFBQWEsQ0FDdEIsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO3FCQUM3QjtpQkFDSjtnQkFDRCxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJO2dCQUMzQixPQUFPLEVBQUUsS0FBSyxDQUFDLFFBQVE7Z0JBQ3ZCLFlBQVksRUFBRSxLQUFLLENBQUMsYUFBYTthQUNwQyxDQUFDO1FBQ04sQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsOEJBQThCO0lBQzlCLDRDQUE0QztJQUM1QyxPQUFPLFVBQVUsQ0FBQztBQUN0QixDQUFDIn0=