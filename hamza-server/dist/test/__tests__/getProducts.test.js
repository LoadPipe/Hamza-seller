"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productService_1 = __importDefault(require("../__mocks__/productService"));
describe('All Products test suite', () => {
    let productService;
    beforeEach(() => {
        productService = new productService_1.default();
    });
    it('should call mock product array', async () => {
        const products = await productService.getAllProductsFromStoreWithPrices();
        expect(products).toEqual([
            {
                store_id: '',
                reviews: [],
                massmarket_prod_id: null,
                id: '',
                created_at: '',
                updated_at: '',
                deleted_at: null,
                title: '',
                subtitle: '',
                description: '',
                handle: '',
                is_giftcard: false,
                status: '',
                thumbnail: '',
                weight: 69,
                collection_id: '',
                metadata: null,
                variants: [{}],
            },
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UHJvZHVjdHMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0L19fdGVzdHNfXy9nZXRQcm9kdWN0cy50ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaUZBQXlEO0FBRXpELFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsSUFBSSxjQUFjLENBQUM7SUFFbkIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLGNBQWMsR0FBRyxJQUFJLHdCQUFjLEVBQUUsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QyxNQUFNLFFBQVEsR0FDVixNQUFNLGNBQWMsQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDO1FBQzdELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckI7Z0JBQ0ksUUFBUSxFQUFFLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsRUFBRSxFQUFFLEVBQUU7Z0JBQ04sVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLEtBQUssRUFBRSxFQUFFO2dCQUNULFFBQVEsRUFBRSxFQUFFO2dCQUNaLFdBQVcsRUFBRSxFQUFFO2dCQUNmLE1BQU0sRUFBRSxFQUFFO2dCQUNWLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixNQUFNLEVBQUUsRUFBRTtnQkFDVixTQUFTLEVBQUUsRUFBRTtnQkFDYixNQUFNLEVBQUUsRUFBRTtnQkFDVixhQUFhLEVBQUUsRUFBRTtnQkFDakIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2pCO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9