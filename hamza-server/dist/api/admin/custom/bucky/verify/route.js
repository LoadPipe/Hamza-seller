"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = void 0;
const route_handler_1 = require("../../../../route-handler");
const PUT = async (req, res) => {
    const paymentVerificationService = req.scope.resolve('paymentVerificationService');
    const handler = new route_handler_1.RouteHandler(req, res, 'PUT', '/admin/custom/bucky/verify', ['order_id']);
    await handler.handle(async () => {
        let orderPayments = [];
        const buckydropService = req.scope.resolve('buckydropService');
        //me minana banana
        if (handler.hasParam('order_id')) {
            handler.logger.info(`Verifying payments for ${handler.inputParams.order_id}...`);
            orderPayments = await paymentVerificationService.verifyPayments(handler.inputParams.order_id);
        }
        else {
            handler.logger.info(`Verifying payments...`);
            orderPayments = await paymentVerificationService.verifyPayments();
        }
        return handler.returnStatus(200, {
            verified: orderPayments.map(item => {
                return {
                    order_id: item.order.id,
                    payment_id: item.payment.id,
                    amount: item.payment.amount,
                    currency: item.payment.currency_code,
                    bucky_metadata: item.order.bucky_metadata
                };
            })
        });
    });
};
exports.PUT = PUT;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9idWNreS92ZXJpZnkvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkRBQXlEO0FBTWxELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNqRSxNQUFNLDBCQUEwQixHQUErQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBRS9HLE1BQU0sT0FBTyxHQUFpQixJQUFJLDRCQUFZLENBQzFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLDRCQUE0QixFQUFFLENBQUMsVUFBVSxDQUFDLENBQzlELENBQUM7SUFFRixNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDNUIsSUFBSSxhQUFhLEdBQXlDLEVBQUUsQ0FBQztRQUM3RCxNQUFNLGdCQUFnQixHQUFxQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBRWhGLGtCQUFrQjtRQUNsQixJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUMvQixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDO1lBQ2pGLGFBQWEsR0FBRyxNQUFNLDBCQUEwQixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xHLENBQUM7YUFDSSxDQUFDO1lBQ0YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUM3QyxhQUFhLEdBQUcsTUFBTSwwQkFBMEIsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0RSxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRTtZQUM3QixRQUFRLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsT0FBTztvQkFDSCxRQUFRLEVBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNqQixVQUFVLEVBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNuQixNQUFNLEVBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO29CQUN2QixRQUFRLEVBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO29CQUM5QixjQUFjLEVBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjO2lCQUNoQyxDQUFBO1lBQ0wsQ0FBQyxDQUFDO1NBQ0wsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUF0Q1csUUFBQSxHQUFHLE9Bc0NkIn0=