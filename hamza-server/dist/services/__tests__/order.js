"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_test_utils_1 = require("medusa-test-utils");
const order_1 = __importDefault(require("../order"));
const mockOrders = [{
        id: 'order01',
        status: 'AWAITING',
        customer_id: 'cust01',
    }];
function createMockRepository(mockData) {
    const repo = (0, medusa_test_utils_1.MockRepository)();
    repo.findOne = jest.fn().mockImplementation((id) => {
        return mockOrders.find((item) => item.id === id);
    });
    repo.find = jest.fn().mockImplementation((query) => {
        console.log("QUERY:", query);
        if (!(query === null || query === void 0 ? void 0 : query.where))
            return mockData;
        return mockData.filter((item) => Object.keys(query).every((key) => item[key] === query.where[key]));
    });
    return repo;
}
const eventBusService = {
    emit: jest.fn(),
    withTransaction: function () {
        return this;
    },
};
describe('OrderService', () => {
    let orderService;
    let orderRepository;
    beforeAll(() => {
        orderRepository = createMockRepository(mockOrders);
        //orderRepository.setData(mockOrders);
        orderService = new order_1.default({
            manager: medusa_test_utils_1.MockManager,
            orderRepository,
            eventBusService,
        });
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    /*
    it('get orders for nonexistent customer', async () => {
        const orders = await orderService.getCustomerOrders('abc');
        console.log(orders);
        expect(orders.length).toEqual(0);
    });
*/
    it('get orders for existing customer', async () => {
        const orders = await orderService.getCustomerOrders('cust01');
        expect(orders.length).toEqual(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvX190ZXN0c19fL29yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseURBQWdFO0FBQ2hFLHFEQUFvQztBQUVwQyxNQUFNLFVBQVUsR0FBRyxDQUFDO1FBQ2hCLEVBQUUsRUFBRSxTQUFTO1FBQ2IsTUFBTSxFQUFFLFVBQVU7UUFDbEIsV0FBVyxFQUFFLFFBQVE7S0FDeEIsQ0FBQyxDQUFDO0FBRUgsU0FBUyxvQkFBb0IsQ0FBQyxRQUFRO0lBQ2xDLE1BQU0sSUFBSSxHQUFHLElBQUEsa0NBQWMsR0FBRSxDQUFDO0lBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM1QixJQUFJLENBQUMsQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxDQUFBO1lBQUUsT0FBTyxRQUFRLENBQUM7UUFDbkMsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ3BFLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLGVBQWUsR0FBRztJQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtJQUNmLGVBQWUsRUFBRTtRQUNiLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSixDQUFDO0FBRUYsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDMUIsSUFBSSxZQUEwQixDQUFDO0lBQy9CLElBQUksZUFBb0IsQ0FBQztJQUV6QixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ1gsZUFBZSxHQUFHLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRW5ELHNDQUFzQztRQUN0QyxZQUFZLEdBQUcsSUFBSSxlQUFZLENBQUM7WUFDNUIsT0FBTyxFQUFFLCtCQUFXO1lBQ3BCLGVBQWU7WUFDZixlQUFlO1NBQ2xCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQztJQUVIOzs7Ozs7RUFNRjtJQUNFLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=