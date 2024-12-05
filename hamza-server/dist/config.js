"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    static get checkoutMode() {
        var _a, _b;
        return (_b = (_a = process.env.CHECKOUT_MODE) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    }
    static get dataSeed() {
        var _a, _b;
        return (_b = (_a = process.env.DATASEED) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    }
    static get allConfig() {
        return {
            checkout_mode: this.checkoutMode,
            data_seed: this.dataSeed
        };
    }
}
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFDUixNQUFNLEtBQUssWUFBWTs7UUFDMUIsT0FBTyxNQUFBLE1BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLDBDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBRU0sTUFBTSxLQUFLLFFBQVE7O1FBQ3RCLE9BQU8sTUFBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSwwQ0FBRSxJQUFJLEVBQUUsMENBQUUsV0FBVyxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUVNLE1BQU0sS0FBSyxTQUFTO1FBQ3ZCLE9BQU87WUFDSCxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDaEMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQzNCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFmRCx3QkFlQyJ9