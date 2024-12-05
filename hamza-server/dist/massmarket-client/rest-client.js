"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassMarketClient = void 0;
const axios_1 = __importDefault(require("axios"));
const REST_URL = process.env.MASSMARKET_REST_SERVER_URL || 'http://localhost:3001';
try {
    new URL(REST_URL);
}
catch (error) {
    console.error('Invalid REST_SERVER_URL:', REST_URL);
    process.exit(1); // Exit the process if the URL is invalid
}
/**
 * Adapter for the REST API that hides the complexity of the
 * MassMarket relay client and exposes its methods.
 *
 * @author Garo Nazarian
 */
class MassMarketClient {
    constructor() {
        this.client = axios_1.default.create({
            baseURL: REST_URL,
            timeout: 13000,
        });
    }
    /**
     * Checks the status of the rest api server.
     *
     * @returns boolean, true if a-ok
     */
    async checkStatus() {
        try {
            const response = await this.client.get('/');
            return response.status === 200;
        }
        catch (error) {
            console.error('Error checking status:', error.message);
            return false;
        }
    }
    /**
     * Creates an entirely new store with a unique id, on MassMarket.
     *
     * @param options Optional parameters (store id and keycard)
     * @returns The identity & info of the new store
     */
    async createStore(options = {}) {
        // ): Promise<{ store_id: string; keycard: string }> {
        try {
            const response = await this.client.post('/api/store', options);
            // return response.data;
            return response.data.storeId;
        }
        catch (error) {
            console.error('Error creating store:', error.message);
            throw error;
        }
    }
    /**
     * Creates one or more product listings on a MassMarket store.
     *
     * @param storeId unique ID of the store to which to add products
     * @param keycard grants authorization to change things on the store
     * @param products list of product specifications (array)
     * @returns a list of product IDs of the new products
     */
    async createProducts(storeId, keycard, products) {
        try {
            const body = {
                storeId,
                keycard,
                products,
            };
            const response = await this.client.post('/api/products', body, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Creating Products');
            return response.data.productIds;
        }
        catch (error) {
            console.error('Error creating products:', error.message);
            throw error;
        }
    }
    /**
     * Updates some data on a specific product in a store.
     *
     * @param storeId Unique id of the store on which to update products.
     * @param keycard Grants authorization to the store.
     * @param productId Unique id of the product to update.
     * @param product Data to update on the product
     * @returns true on success (boolean)
     */
    async updateProduct(storeId, keycard, productId, product) {
        try {
            const body = {
                storeId,
                keycard,
                product,
            };
            const response = await this.client.put(`/api/products/${productId}`, body, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(`Updating Product: ${product.name}`);
            return response.data.success;
        }
        catch (error) {
            console.error('Error updating product:', error.message);
            throw error;
        }
    }
    /**
     * Complets checkout fully, creating a cart, adding items, and committing the cart.
     *
     * @param storeId Unique id of the store on which to run checkout.
     * @param keycard Grants authorization to the store.
     * @param items List of items and quantities to include in checkout.
     *
     * @returns Unknown at this time
     */
    async checkout(storeId, keycard, paymentCurrency, items) {
        try {
            const body = {
                storeId,
                keycard,
                paymentCurrency,
                items,
            };
            if (process.env.FAKE_CHECKOUT) {
                return {
                    success: true,
                    contractAddress: '0x3d9DbbD22E4903274171ED3e94F674Bb52bCF015',
                    payeeAddress: '0x74b7284836f753101bd683c3843e95813b381f18',
                    isPaymentEndpoint: true,
                    paymentId: '0x97ca469adfbee1dae8a61f800dc630eaa30607956273e0b568d3ffe5684c5c8c',
                    amount: '0x0000000000000000000000000000000000000000000000000000000000002904',
                    orderHash: '0x32648674fb21af6d32bd931ec228a8fa82bffd2794cce0474f2744fc1cfda7a1',
                    chainId: 11155111,
                    ttl: 1719308448,
                    currency: '0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5',
                };
            }
            else {
                const response = await this.client.post('/api/checkout', body, {
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log('Checking out');
                console.log('response:', JSON.stringify(response.data));
                return response.data;
            }
        }
        catch (error) {
            console.error('Error checking out:', error.message);
            throw error;
        }
    }
}
exports.MassMarketClient = MassMarketClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdC1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWFzc21hcmtldC1jbGllbnQvcmVzdC1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTZDO0FBSzdDLE1BQU0sUUFBUSxHQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLElBQUksdUJBQXVCLENBQUM7QUFDdEUsSUFBSSxDQUFDO0lBQ0QsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7SUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7QUFDOUQsQ0FBQztBQTBDRDs7Ozs7R0FLRztBQUNILE1BQWEsZ0JBQWdCO0lBR3pCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFdBQVc7UUFDYixJQUFJLENBQUM7WUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUM7UUFDbkMsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2RCxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLFdB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