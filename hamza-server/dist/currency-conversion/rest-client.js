"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyConversionClient = void 0;
const axios_1 = __importDefault(require("axios"));
const REST_URL = process.env.CURRENCY_CONVERSION_REST_URL || 'http://localhost:3000/convert';
try {
    new URL(REST_URL);
}
catch (error) {
    console.error('Invalid REST_SERVER_URL:', REST_URL);
    process.exit(1); // Exit the process if the URL is invalid
}
class CurrencyConversionClient {
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
            const response = await this.client.get('/health');
            return response.status === 200;
        }
        catch (error) {
            console.error('Error checking status:', error.message);
            return false;
        }
    }
    async getExchangeRate(baseCurrency, toCurrency) {
        try {
            const url = `/exch?base=${baseCurrency}&to=${toCurrency}`;
            //console.log('getting exchange rate', url);
            if (baseCurrency === toCurrency)
                return 1;
            if (process.env.CURRENCY_CONVERSION_REST_URL) {
                const response = await this.client.get(url);
                return response.status === 200 ? response.data : 0;
            }
            //default: hard-coded rates
            switch (baseCurrency) {
                case '0x0000000000000000000000000000000000000000':
                    return 2517.26;
                case 'cny':
                    if (toCurrency !==
                        '0x0000000000000000000000000000000000000000')
                        return 0.14;
                    else
                        return 0.000051;
                default:
                    if (toCurrency !==
                        '0x0000000000000000000000000000000000000000') {
                        if (toCurrency === 'cny')
                            return 7.14;
                        return 1;
                    }
                    return 0.00041;
            }
        }
        catch (error) {
            console.error('Error getting exchange rate:', error.message);
            return 0;
        }
    }
}
exports.CurrencyConversionClient = CurrencyConversionClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdC1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3VycmVuY3ktY29udmVyc2lvbi9yZXN0LWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBNkM7QUFJN0MsTUFBTSxRQUFRLEdBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsSUFBSSwrQkFBK0IsQ0FBQztBQUNoRixJQUFJLENBQUM7SUFDRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztJQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDcEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHlDQUF5QztBQUM5RCxDQUFDO0FBRUQsTUFBYSx3QkFBd0I7SUFHakM7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsV0FBVztRQUNiLElBQUksQ0FBQztZQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEQsT0FBTyxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQztRQUNuQyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FDakIsWUFBb0IsRUFDcEIsVUFBa0I7UUFFbEIsSUFBSSxDQUFDO1lBQ0QsTUFBTSxHQUFHLEdBQUcsY0FBYyxZQUFZLE9BQU8sVUFBVSxFQUFFLENBQUM7WUFDMUQsNENBQTRDO1lBRTVDLElBQUksWUFBWSxLQUFLLFVBQVU7Z0JBQUUsT0FBTyxDQUFDLENBQUM7WUFFMUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLENBQUM7Z0JBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxDQUFDO1lBRUQsMkJBQTJCO1lBQzNCLFFBQVEsWUFBWSxFQUFFLENBQUM7Z0JBQ25CLEtBQUssNENBQTRDO29CQUM3QyxPQUFPLE9BQU8sQ0FBQztnQkFDbkIsS0FBSyxLQUFLO29CQUNOLElBQ0ksVUFBVTt3QkFDViw0Q0FBNEM7d0JBRTVDLE9BQU8sSUFBSSxDQUFDOzt3QkFDWCxPQUFPLFFBQVEsQ0FBQztnQkFDekI7b0JBQ0ksSUFDSSxVQUFVO3dCQUNWLDRDQUE0QyxFQUM5QyxDQUFDO3dCQUNDLElBQUksVUFBVSxLQUFLLEtBQUs7NEJBQUUsT0FBTyxJQUFJLENBQUM7d0JBQ3RDLE9BQU8sQ0FBQyxDQUFDO29CQUNiLENBQUM7b0JBQ0QsT0FBTyxPQUFPLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0QsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBbEVELDREQWtFQyJ9