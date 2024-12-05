"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeamlessCache = void 0;
/**
 * SeamlessCache (TM)
 *
 * A utility for:
 * - keeping data in cache for a max number of seconds
 * - serving the data in such a way that there isn't a sudden rush for querying
 * - service the data in such a way that it's always available
 *
 * Usage:
 * - extend the class
 * - implement the getData method such that it retrieves data
 * - from the consumer side, call either retrieve or retrieveWithKey
 *
 * @author John R. Kosinski
 */
class SeamlessCache {
    constructor(expirationSeconds) {
        this.cache = {};
        this.expirationSeconds = expirationSeconds;
    }
    /**
     * Get the single item of cached data held in the instance.
     * The item will be retrieved by the getData function if it isn't present, and it will be
     * refreshed if expired.
     *
     * @param params Anything; these will be passed to the getData function ultimately
     * @returns cached data of a specifically defined type
     */
    async retrieve(params) {
        return await this.retrieveWithKey('default', params);
    }
    /**
     * Get a single item of cached data held in the instance defined by the given unique key.
     * The item will be retrieved by the getData function if it isn't present, and it will be
     * refreshed if expired.
     *
     * @param params Anything; these will be passed to the getData function ultimately
     * @returns cached data of a specifically defined type
     */
    async retrieveWithKey(key, params) {
        var _a, _b;
        if ((_a = this.cache[key]) === null || _a === void 0 ? void 0 : _a.data) {
            if (this.isExpired(key)) {
                //console.log('CACHE EXPIRED for key', key)
                if (!this.refreshing) {
                    //console.log('REFRESHING EXPIRED CACHE for key', key)
                    this.refreshCache(key, params);
                }
            }
        }
        else {
            //TODO: this part is NOT seamless; multiple threads can attempts this at once; can be fixed
            //console.log('CACHE EMPTY for key', key);
            await this.refreshCache(key, params);
        }
        return (_b = this.cache[key]) === null || _b === void 0 ? void 0 : _b.data;
    }
    async refreshCache(key, params) {
        this.refreshing = true;
        try {
            const data = await this.getData(params);
            this.cache[key] = {
                timestamp: Math.floor(Date.now() / 1000),
                data: data
            };
        }
        catch (e) {
            //TODO: need a logger here
            console.log('CACHE ERROR', e);
        }
        //console.log('REFRESHED CACHE for key', key)
        this.refreshing = false;
    }
    isExpired(key) {
        var _a;
        return (Math.floor(Date.now() / 1000) - this.expirationSeconds > ((_a = this.cache[key]) === null || _a === void 0 ? void 0 : _a.timestamp));
    }
}
exports.SeamlessCache = SeamlessCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhbWxlc3MtY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY2FjaGUvc2VhbWxlc3MtY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0E7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFzQixhQUFhO0lBSy9CLFlBQVksaUJBQXlCO1FBSjdCLFVBQUssR0FBaUMsRUFBRSxDQUFDO1FBSzdDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBWTtRQUN2QixPQUFPLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQVksRUFBRSxNQUFZOztRQUM1QyxJQUFJLE1BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsMENBQUUsSUFBSSxFQUFFLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RCLDJDQUEyQztnQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDbkIsc0RBQXNEO29CQUN0RCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLDJGQUEyRjtZQUMzRiwwQ0FBMEM7WUFDMUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRUQsT0FBTyxNQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLDBDQUFFLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRVMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFXLEVBQUUsTUFBVztRQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUM7WUFDRCxNQUFNLElBQUksR0FBUSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRztnQkFDZCxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUN4QyxJQUFJLEVBQUUsSUFBSTthQUNiLENBQUM7UUFDTixDQUFDO1FBQ0QsT0FBTyxDQUFNLEVBQUUsQ0FBQztZQUNaLDBCQUEwQjtZQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsNkNBQTZDO1FBQzdDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFUyxTQUFTLENBQUMsR0FBVzs7UUFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsSUFBRyxNQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLDBDQUFFLFNBQVMsQ0FBQSxDQUFDLENBQUM7SUFDakcsQ0FBQztDQVNKO0FBM0VELHNDQTJFQyJ9