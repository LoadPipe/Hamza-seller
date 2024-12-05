"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStorage = exports.asyncLocalStorage = void 0;
const async_hooks_1 = require("async_hooks");
class LocalStorageWrapper {
    get customerId() {
        var _a;
        return (_a = this.storage.getStore()) === null || _a === void 0 ? void 0 : _a.get('customerId');
    }
    set customerId(value) {
        var _a;
        (_a = this.storage.getStore()) === null || _a === void 0 ? void 0 : _a.set('customerId', value);
    }
    get sessionId() {
        var _a;
        return (_a = this.storage.getStore()) === null || _a === void 0 ? void 0 : _a.get('sessionId');
    }
    set sessionId(value) {
        var _a;
        (_a = this.storage.getStore()) === null || _a === void 0 ? void 0 : _a.set('sessionId', value);
    }
    get requestId() {
        var _a;
        return (_a = this.storage.getStore()) === null || _a === void 0 ? void 0 : _a.get('requestId');
    }
    set requestId(value) {
        var _a;
        (_a = this.storage.getStore()) === null || _a === void 0 ? void 0 : _a.set('requestId', value);
    }
    constructor(storage) {
        this.storage = storage;
    }
}
//this is the raw thing
exports.asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
//this is extended with proper properties; more user-friendly - use this one
exports.sessionStorage = new LocalStorageWrapper(exports.asyncLocalStorage);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUVoRCxNQUFNLG1CQUFtQjtJQUdyQixJQUFJLFVBQVU7O1FBQ1YsT0FBTyxNQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLDBDQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsSUFBSSxVQUFVLENBQUMsS0FBYTs7UUFDeEIsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSwwQ0FBRSxHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxJQUFJLFNBQVM7O1FBQ1QsT0FBTyxNQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLDBDQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsS0FBYTs7UUFDdkIsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSwwQ0FBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxJQUFJLFNBQVM7O1FBQ1QsT0FBTyxNQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLDBDQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsS0FBYTs7UUFDdkIsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSwwQ0FBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxZQUFZLE9BQVk7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBRUQsdUJBQXVCO0FBQ1YsUUFBQSxpQkFBaUIsR0FBRyxJQUFJLCtCQUFpQixFQUFFLENBQUM7QUFFekQsNEVBQTRFO0FBQy9ELFFBQUEsY0FBYyxHQUFHLElBQUksbUJBQW1CLENBQUMseUJBQWlCLENBQUMsQ0FBQyJ9