"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_test_utils_1 = require("medusa-test-utils");
const store_1 = __importDefault(require("../store"));
const mockStores = [
    {
        name: 'Medusa Store',
        owner_id: null,
        massmarket_store_id: '',
        massmarket_keycard: '',
        icon: null,
        id: 'store_01J20RCECPSPFCVM9H059M8XJS',
        created_at: '2024-07-05T06:12:55.818Z',
        updated_at: '2024-07-15T09:53:05.658Z',
        default_currency_code: 'eth',
        swap_link_template: null,
        payment_link_template: null,
        invite_link_template: null,
        default_location_id: null,
        metadata: null,
        default_sales_channel_id: 'sc_01J20RCEDRF508YB2DXQ6PB3Q5',
    },
    // Add more stores as needed
];
const eventBusService = {
    emit: jest.fn(),
    withTransaction: function () {
        return this;
    },
};
describe('StoreService', () => {
    let storeService;
    let storeRepository;
    beforeAll(() => {
        storeRepository = (0, medusa_test_utils_1.MockRepository)({
            find: jest.fn().mockResolvedValue(mockStores),
        });
        storeService = new store_1.default({
            manager: medusa_test_utils_1.MockManager,
            storeRepository,
            eventBusService,
        });
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return the stores', async () => {
        const stores = await storeService.getStores();
        expect(stores).toEqual(mockStores);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvX190ZXN0c19fL3N0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseURBQWdFO0FBQ2hFLHFEQUFvQztBQUVwQyxNQUFNLFVBQVUsR0FBRztJQUNmO1FBQ0ksSUFBSSxFQUFFLGNBQWM7UUFDcEIsUUFBUSxFQUFFLElBQUk7UUFDZCxtQkFBbUIsRUFBRSxFQUFFO1FBQ3ZCLGtCQUFrQixFQUFFLEVBQUU7UUFDdEIsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsa0NBQWtDO1FBQ3RDLFVBQVUsRUFBRSwwQkFBMEI7UUFDdEMsVUFBVSxFQUFFLDBCQUEwQjtRQUN0QyxxQkFBcUIsRUFBRSxLQUFLO1FBQzVCLGtCQUFrQixFQUFFLElBQUk7UUFDeEIscUJBQXFCLEVBQUUsSUFBSTtRQUMzQixvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLG1CQUFtQixFQUFFLElBQUk7UUFDekIsUUFBUSxFQUFFLElBQUk7UUFDZCx3QkFBd0IsRUFBRSwrQkFBK0I7S0FDNUQ7SUFDRCw0QkFBNEI7Q0FDL0IsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHO0lBQ3BCLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO0lBQ2YsZUFBZSxFQUFFO1FBQ2IsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKLENBQUM7QUFFRixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUMxQixJQUFJLFlBQTBCLENBQUM7SUFDL0IsSUFBSSxlQUFvQixDQUFDO0lBRXpCLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDWCxlQUFlLEdBQUcsSUFBQSxrQ0FBYyxFQUFDO1lBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDO1NBQ2hELENBQUMsQ0FBQztRQUNILFlBQVksR0FBRyxJQUFJLGVBQVksQ0FBQztZQUM1QixPQUFPLEVBQUUsK0JBQVc7WUFDcEIsZUFBZTtZQUNmLGVBQWU7U0FDbEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9