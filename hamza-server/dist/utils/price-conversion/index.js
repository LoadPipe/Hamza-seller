"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceConverter = void 0;
const rest_client_1 = require("../../currency-conversion/rest-client");
const currency_config_1 = require("../../currency.config");
const seamless_cache_1 = require("../cache/seamless-cache");
const EXTENDED_LOGGING = false;
//TODO: move to SeamlessCache
const cache = {};
class PriceConverter {
    constructor(logger, cachedExchangeRateRepository) {
        this.restClient = new rest_client_1.CurrencyConversionClient();
        this.MEMORY_CACHE_EXPIRATION_SECONDS = 120;
        this.logger = logger;
        this.cachedExchangeRateRepository = cachedExchangeRateRepository;
    }
    async convertPrice(baseAmount, baseCurrency, toCurrency) {
        return await this.getPrice({ baseAmount, baseCurrency, toCurrency });
    }
    async getPrice(price) {
        var _a, _b, _c, _d;
        if (price.baseAmount === 0)
            return 0;
        //if identity, return as such
        if (price.baseCurrency == price.toCurrency)
            return price.baseAmount;
        // Step 1: Try to get the rate from the cache
        let rate = this.getFromCache(price);
        let usingRateFromDb = false;
        if (!rate) {
            // Step 2: Try to get the rate from the API
            rate = await this.getFromApi(price);
            if (EXTENDED_LOGGING)
                console.log("GOT RATE FROM API");
            if (rate) {
                if (EXTENDED_LOGGING)
                    console.log("CACHING RATE");
                // Step 3: Write to cache & save to DB
                this.writeToCache(price, rate);
            }
            else {
                // Step 5: If API fails, fallback to database
                const dbResult = await this.getFromDatabase(price);
                if (dbResult) {
                    usingRateFromDb = true;
                    if (EXTENDED_LOGGING)
                        console.log("USING RATE FROM DB");
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info(`Using DB-cached rate for ${price.baseCurrency} to ${price.toCurrency}: ${dbResult.rate}`);
                    rate = dbResult.rate;
                }
                else {
                    // If the rate is not found in the database, throw an error
                    (_b = this.logger) === null || _b === void 0 ? void 0 : _b.error(`Unable to retrieve exchange rate for ${price.baseCurrency} to ${price.toCurrency}`);
                    throw new Error(`Unable to retrieve exchange rate for ${price.baseCurrency} to ${price.toCurrency}`);
                }
            }
        }
        this.refreshDbCache();
        // Now handle currency precisions
        const basePrecision = (_c = (0, currency_config_1.getCurrencyPrecision)(price.baseCurrency)) !== null && _c !== void 0 ? _c : {
            db: 2,
        };
        const toPrecision = (_d = (0, currency_config_1.getCurrencyPrecision)(price.toCurrency)) !== null && _d !== void 0 ? _d : { db: 2 };
        // Convert the amount
        const baseFactor = Math.pow(10, basePrecision.db);
        if (EXTENDED_LOGGING) {
            console.log('price:', price);
            console.log('baseFactor:', baseFactor);
            console.log('basePrecision:', basePrecision);
            console.log('toPrecision:', toPrecision);
            console.log('rate:', rate);
        }
        const displayAmount = price.baseAmount / baseFactor;
        if (EXTENDED_LOGGING) {
            console.log('displayAmount:', displayAmount);
        }
        return Math.floor(displayAmount * rate * Math.pow(10, toPrecision.db));
    }
    async getFromApi(price) {
        //convert to addresses
        let baseAddr = (0, currency_config_1.getCurrencyAddress)(price.baseCurrency, 1);
        let toAddr = (0, currency_config_1.getCurrencyAddress)(price.toCurrency, 1);
        if (baseAddr.length === 0)
            baseAddr = price.baseCurrency;
        if (toAddr.length === 0)
            toAddr = price.toCurrency;
        return await this.restClient.getExchangeRate(baseAddr, toAddr);
    }
    async getFromDatabase(price) {
        var _a;
        try {
            const id = `${price.baseCurrency}-${price.toCurrency}`.toLowerCase();
            const cachedRate = await this.cachedExchangeRateRepository.findOne({
                where: { id },
            });
            if (cachedRate) {
                return cachedRate;
            }
        }
        catch (error) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(`Failed to fetch exchange rate from DB for ${price.baseCurrency} to ${price.toCurrency}`, error);
        }
        return null;
    }
    async refreshDbCache() {
        var _a, _b;
        const args = [];
        for (let key in cache) {
            const parts = key.split('-');
            const baseCurrency = parts[0];
            const toCurrency = parts[1];
            args.push({
                key,
                toCurrency,
                baseCurrency,
                rate: (_b = (_a = cache[key]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0
            });
        }
        dbCache.retrieve({
            cachedExchangeRateRepository: this.cachedExchangeRateRepository,
            logger: this.logger,
            args
        });
        if (EXTENDED_LOGGING)
            console.log("SAVED TO DB");
    }
    getFromCache(price) {
        var _a;
        const key = this.getKey(price.baseCurrency, price.toCurrency);
        if (cache[key] &&
            this.getTimestamp() - cache[key].timestamp >=
                this.MEMORY_CACHE_EXPIRATION_SECONDS) {
            cache[key] = null;
        }
        return (_a = cache[key]) === null || _a === void 0 ? void 0 : _a.value;
    }
    writeToCache(price, rate) {
        const key = this.getKey(price.baseCurrency, price.toCurrency);
        cache[key] = { value: rate, timestamp: this.getTimestamp() };
    }
    getKey(base, to) {
        return `${base.trim().toLowerCase()}-${to.trim().toLowerCase()}`;
    }
    getTimestamp() {
        return Date.now() / 1000;
    }
}
exports.PriceConverter = PriceConverter;
class ExchangeRateDbCache extends seamless_cache_1.SeamlessCache {
    constructor() {
        super(60);
        this.sharedMem = new SharedArrayBuffer(64);
        this.saving = new BigInt64Array(this.sharedMem);
    }
    async retrieve(params) {
        return await super.retrieve(params);
    }
    async getData(params) {
        var _a, _b, _c, _d;
        const output = [];
        const random = Math.random();
        try {
            const result = (Atomics.compareExchange(this.saving, 0, BigInt(0), BigInt(1)));
            if (result === BigInt(0)) {
                //console.log('INSIDE OF THE MUTEX', random);
                try {
                    for (let args of params.args) {
                        if (args.rate) {
                            // check if we need to save to the database (every 5 minutes max)
                            let existingRate = await params.cachedExchangeRateRepository.findOne({
                                where: { id: args.key },
                            });
                            if (((_a = existingRate === null || existingRate === void 0 ? void 0 : existingRate.updated_at) !== null && _a !== void 0 ? _a : 0) < new Date(Date.now() - 60 * 1000)) {
                                // Insert a new entry
                                //check once before before insert
                                existingRate = await params.cachedExchangeRateRepository.findOne({
                                    where: { id: args.key },
                                });
                                //console.log('SAVING ', args.key, random);
                                output.push(await params.cachedExchangeRateRepository.save({
                                    id: args.key,
                                    to_currency_code: args.toCurrency,
                                    from_currency_code: args.baseCurrency,
                                    rate: args.rate,
                                }));
                                (_b = params.logger) === null || _b === void 0 ? void 0 : _b.debug(`Saved rate ${args.rate} for ${args.key} in DB`);
                            }
                        }
                    }
                }
                catch (e) {
                    (_c = params.logger) === null || _c === void 0 ? void 0 : _c.error(`Failed to save exchange rate to DB`, e);
                }
                //console.log('RESETTNG FLAG', random);
                this.saving[0] = BigInt(0);
            }
        }
        catch (error) {
            (_d = params.logger) === null || _d === void 0 ? void 0 : _d.error(`Failed to save exchange rates to DB`, error);
        }
        return output;
    }
}
const dbCache = new ExchangeRateDbCache();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcHJpY2UtY29udmVyc2lvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1RUFBaUY7QUFDakYsMkRBQWlGO0FBR2pGLDREQUF3RDtBQVN4RCxNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQztBQUUvQiw2QkFBNkI7QUFDN0IsTUFBTSxLQUFLLEdBRVAsRUFBRSxDQUFDO0FBRVAsTUFBYSxjQUFjO0lBT3ZCLFlBQ0ksTUFBZ0IsRUFDaEIsNEJBQWtFO1FBUnJELGVBQVUsR0FDdkIsSUFBSSxzQ0FBd0IsRUFBRSxDQUFDO1FBQ2xCLG9DQUErQixHQUFXLEdBQUcsQ0FBQztRQVEzRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsNEJBQTRCLEdBQUcsNEJBQTRCLENBQUM7SUFDckUsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQ2QsVUFBa0IsRUFDbEIsWUFBb0IsRUFDcEIsVUFBa0I7UUFFbEIsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBYTs7UUFFeEIsSUFBSSxLQUFLLENBQUMsVUFBVSxLQUFLLENBQUM7WUFDdEIsT0FBTyxDQUFDLENBQUM7UUFFYiw2QkFBNkI7UUFDN0IsSUFBSSxLQUFLLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxVQUFVO1lBQ3RDLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUU1Qiw2Q0FBNkM7UUFDN0MsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QyxJQUFJLGVBQWUsR0FBWSxLQUFLLENBQUM7UUFFckMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFD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