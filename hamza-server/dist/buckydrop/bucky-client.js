"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckyClient = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
const medusa_1 = require("@medusajs/medusa");
//TODO: comment the methods
//TODO: proper return types
class BuckyClient {
    constructor(buckyLogRepository) {
        this.BUCKY_URL = process.env.BUCKY_URL || 'https://dev.buckydrop.com';
        this.APP_CODE = process.env.BUCKY_APP_CODE || '0077651952683977';
        this.APP_SECRET =
            process.env.BUCKY_APP_SECRET || 'b9486ca7a7654a8f863b3dfbd9e8c100';
        this.client = axios_1.default.create({
            baseURL: this.BUCKY_URL,
            headers: {
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Content-Type': 'application/json',
            },
            timeout: 13000,
        });
        this.buckyLogRepository = buckyLogRepository;
    }
    async post(url, params) {
        url = this.formatApiUrl(url, JSON.stringify(params));
        const logRecord = await this.saveLogInput(url, params, null, null);
        const output = await this.client
            .post(url, params, { timeout: 600000 })
            .then((response) => response.data)
            .catch((error) => {
            throw error;
        });
        if (logRecord) {
            logRecord.output = output;
            this.saveLogOutput(logRecord);
        }
        return output;
    }
    // Method to get product details
    async getProductDetails(productLink) {
        return this.post('product/query', {
            goodsLink: productLink,
        });
    }
    async searchProducts(keyword, currentPage = 1, pageSize = 10) {
        var _a, _b;
        return (_b = (_a = (await this.post('product/search', {
            curent: currentPage, // Note the typo "curent" should be "current" if API docs are correct
            size: pageSize,
            item: { keyword: keyword },
        }))) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.records;
    }
    async searchProductByImage(base64Image, currentPage = 1, pageSize = 10) {
        const params = JSON.stringify({
            curent: currentPage,
            size: pageSize,
            item: { base64: base64Image },
        });
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);
        //TODO: get correct url for this
        return this.post('', params);
    }
    async createOrder(createOrderParams) {
        return this.post('/order/shop-order/create', createOrderParams);
    }
    async cancelShopOrder(shopOrderNo, partnerOrderNo) {
        return this.post('/order/shop-order/cancel', {
            shopOrderNo,
            partnerOrderNo,
        });
    }
    async cancelPurchaseOrder(orderCode) {
        return this.post('/order/po-cancel', { orderCode });
    }
    async getOrderDetails(shopOrderNo, partnerOrderNo) {
        return this.post('/order/detail', {
            shopOrderNo,
            partnerOrderNo,
        });
    }
    async getLogisticsInfo(packageCode) {
        return this.post('/logistics/query-info', { packageCode });
    }
    async getParcelDetails(packageCode) {
        return this.post('/pkg/detail', { packageCode });
    }
    async getShippingCostEstimate(item) {
        return this.post('/logistics/channel-carriage-list', { size: 10, item });
    }
    formatApiUrl(route, params = {}) {
        route = route.trim();
        if (!route.startsWith('/'))
            route = '/' + route;
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);
        const url = `/api/rest/v2/adapt/adaptation${route}?appCode=${this.APP_CODE}&timestamp=${timestamp}&sign=${sign}`;
        console.log(url);
        return url;
    }
    // Method to calculate MD5 signature
    generateSignature(params, timestamp) {
        const hash = (0, crypto_1.createHash)('md5');
        const data = `${this.APP_CODE}${params}${timestamp}${this.APP_SECRET}`;
        return hash.update(data).digest('hex');
    }
    //TODO: need logger also
    async saveLogInput(endpoint, input, output, context) {
        var _a;
        try {
            const entry = {
                endpoint,
                input,
                output,
                context,
                timestamp: Date.now(), // ISO formatted timestamp
                id: (0, medusa_1.generateEntityId)(),
            };
            const record = await ((_a = this.buckyLogRepository) === null || _a === void 0 ? void 0 : _a.save(entry));
            return record;
        }
        catch (e) {
            console.error(e);
        }
        return null;
    }
    //TODO: need logger also
    async saveLogOutput(record) {
        var _a;
        try {
            await ((_a = this.buckyLogRepository) === null || _a === void 0 ? void 0 : _a.save(record));
        }
        catch (e) {
            console.error(e);
        }
        return null;
    }
}
exports.BuckyClient = BuckyClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja3ktY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2J1Y2t5ZHJvcC9idWNreS1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTZDO0FBQzdDLG1DQUFvQztBQUVwQyw2Q0FBNEQ7QUE0RDVELDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFFM0IsTUFBYSxXQUFXO0lBT3BCLFlBQVksa0JBQTZDO1FBQ3JELElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksMkJBQTJCLENBQUM7UUFDdEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsSUFBSSxrQkFBa0IsQ0FBQztRQUNqRSxJQUFJLENBQUMsVUFBVTtZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLElBQUksa0NBQWtDLENBQUM7UUFFdkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUztZQUN2QixPQUFPLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFLG1DQUFtQztnQkFDakQsY0FBYyxFQUFFLGtCQUFrQjthQUNyQztZQUNELE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztJQUNqRCxDQUFDO0lBRU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFXLEVBQUUsTUFBVztRQUN2QyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXJELE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FDckMsR0FBRyxFQUNILE1BQU0sRUFDTixJQUFJLEVBQ0osSUFBSSxDQUNQLENBQUM7UUFFRixNQUFNLE1B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