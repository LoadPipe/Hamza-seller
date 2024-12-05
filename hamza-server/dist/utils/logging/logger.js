"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseLogger = void 0;
exports.createLogger = createLogger;
const medusa_1 = require("@medusajs/medusa");
const context_1 = require("../context");
class DatabaseLogger {
    constructor(container, prefix) {
        this.logger = container.logger;
        this.repository = container.appLogRepository;
        this.prefix = prefix !== null && prefix !== void 0 ? prefix : '';
        this.logTypesDb = process.env.LOG_TO_DATABASE ? process.env.LOG_TO_DATABASE.split(',') : [];
        this.logTypesConsole = process.env.LOG_TO_CONSOLE ? process.env.LOG_TO_CONSOLE.split(',') : [];
    }
    debug(text) {
        var _a, _b;
        text = ((_a = this.prefix) === null || _a === void 0 ? void 0 : _a.length) ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'debug');
        if (process.env.LOG_TO_CONSOLE && this.logTypesConsole.includes('debug'))
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.debug(text);
    }
    info(text) {
        var _a, _b;
        text = ((_a = this.prefix) === null || _a === void 0 ? void 0 : _a.length) ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'info');
        if (process.env.LOG_TO_CONSOLE && this.logTypesConsole.includes('info'))
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info(text);
    }
    warn(text) {
        var _a, _b;
        text = ((_a = this.prefix) === null || _a === void 0 ? void 0 : _a.length) ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'warn');
        if (process.env.LOG_TO_CONSOLE && this.logTypesConsole.includes('warn'))
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.warn(text);
    }
    error(text, error) {
        var _a, _b;
        text = ((_a = this.prefix) === null || _a === void 0 ? void 0 : _a.length) ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'error', error);
        if (process.env.LOG_TO_CONSOLE && this.logTypesConsole.includes('error'))
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.error(text, error);
    }
    saveEntry(text, log_level, content) {
        var _a;
        if (this.logTypesDb.includes(log_level)) {
            const entry = {
                text,
                session_id: context_1.sessionStorage.sessionId,
                customer_id: context_1.sessionStorage.customerId,
                request_id: context_1.sessionStorage.requestId,
                log_level,
                content,
                timestamp: Math.floor(Date.now() / 1000),
                id: (0, medusa_1.generateEntityId)()
            };
            (_a = this.repository) === null || _a === void 0 ? void 0 : _a.save(entry);
        }
    }
}
exports.DatabaseLogger = DatabaseLogger;
function createLogger(config, prefix) {
    return new DatabaseLogger(config, prefix);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2xvZ2dpbmcvbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXlFQSxvQ0FFQztBQTNFRCw2Q0FBNEQ7QUFFNUQsd0NBQTRDO0FBUzVDLE1BQWEsY0FBYztJQU92QixZQUFZLFNBQWMsRUFBRSxNQUFlO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sYUFBTixNQUFNLGNBQU4sTUFBTSxHQUFJLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1RixJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuRyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQVM7O1FBQ1gsSUFBSSxHQUFHLENBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzlELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksSUFB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