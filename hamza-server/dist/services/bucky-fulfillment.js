"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
class BuckyFulfillmentService extends medusa_1.AbstractFulfillmentService {
    constructor(container, options) {
        super(container);
        this.buckyService = container.buckydropService;
    }
    async getFulfillmentOptions() {
        return [
            {
                id: "bucky-fulfillment",
            },
        ];
    }
    async validateFulfillmentData(optionData, data, cart) {
        if (data.id !== BuckyFulfillmentService.identifier && optionData.id !== BuckyFulfillmentService.identifier) {
            throw new Error(`${optionData.id} invalid option id`);
        }
        return {
            ...data,
        };
    }
    async calculatePrice(optionData, data, cart) {
        if (data.id !== BuckyFulfillmentService.identifier && optionData.id !== BuckyFulfillmentService.identifier) {
            throw new Error(`${optionData.id} invalid option id`);
        }
        return await this.buckyService.calculateShippingPriceForCart(cart.id);
    }
    async canCalculate(data) {
        return data.id === BuckyFulfillmentService.identifier;
    }
    async validateOption(data) {
        return true;
    }
    async createFulfillment(data, items, order, fulfillment) {
        return null;
    }
    async cancelFulfillment(fulfillment) {
        return null;
    }
    async createReturn(returnOrder) {
        return null;
    }
    async getFulfillmentDocuments(data) {
        return null;
    }
    async retrieveDocuments(fulfillmentData, documentType) {
        return null;
    }
    async getReturnDocuments(data) {
        return null;
    }
    async getShipmentDocuments(data) {
        return null;
    }
}
BuckyFulfillmentService.identifier = 'bucky-fulfillment';
exports.default = BuckyFulfillmentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja3ktZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvYnVja3ktZnVsZmlsbG1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBaUc7QUFJakcsTUFBTSx1QkFBd0IsU0FBUSxtQ0FBMEI7SUFJNUQsWUFBWSxTQUFTLEVBQUUsT0FBTztRQUMxQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUM7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxxQkFBcUI7UUFDdkIsT0FBTztZQUNIO2dCQUNJLEVBQUUsRUFBRSxtQkFBbUI7YUFDMUI7U0FDSixDQUFBO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyx1QkFBdUIsQ0FDekIsVUFBbUMsRUFDbkMsSUFBNkIsRUFDN0IsSUFBVTtRQUVWLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyx1QkFBdUIsQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLEVBQUUsS0FBSyx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN6RyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQTtRQUN6RCxDQUFDO1FBRUQsT0FBTztZQUNILEdBQUcsSUFBSTtTQUNWLENBQUE7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFxQyxFQUFFLElBQStCLEVBQUUsSUFBVTtRQUVuRyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssdUJBQXVCLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxFQUFFLEtBQUssdUJBQXVCLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDekcsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUE7UUFDekQsQ0FBQztRQUVELE9BQU8sTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUErQjtRQUM5QyxPQUFPLElBQUksQ0FBQyxFQUFFLEtBQUssdUJBQXVCLENBQUMsVUFBVSxDQUFDO0lBQzFELENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUFDLElBQStCO1FBQ2hELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBK0IsRUFBRSxLQUFpQixFQUFFLEtBQVksRUFBRSxXQUF3QjtRQUM5RyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFdBQXNDO1FBQzFELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQTZCO1FBQzVDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBK0I7UUFDekQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxlQUF3QyxFQUFFLFlBQWlDO1FBRS9GLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBNkI7UUFDbEQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUE2QjtRQUNwRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOztBQXpFTSxrQ0FBVSxHQUFXLG1CQUFtQixDQUFDO0FBNEVwRCxrQkFBZSx1QkFBdUIsQ0FBQSJ9