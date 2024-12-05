"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteHandler = void 0;
const request_body_1 = require("../utils/request-body");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logging/logger");
/**
 * Provides uniformity of logging and exception handling for all API routes.
 * Should be used for handling all api routes.
 */
class RouteHandler {
    constructor(req, res, method, route, inputFieldNames = []) {
        var _a;
        this.onError = null;
        this.method = method;
        this.route = route;
        this.request = req;
        this.response = res;
        this.inputParams = {};
        if (inputFieldNames === null || inputFieldNames === void 0 ? void 0 : inputFieldNames.length) {
            this.inputParams = (0, request_body_1.readRequestBody)(req.body, inputFieldNames);
        }
        // Extract parameters from URL
        if (req.params) {
            this.inputParams = { ...this.inputParams, ...req.params };
        }
        if (req.query) {
            this.inputParams = { ...this.inputParams, ...req.query };
        }
        //handle security
        this.jwtToken = jsonwebtoken_1.default.decode(req.headers.authorization);
        this.customerId = (_a = this.jwtToken) === null || _a === void 0 ? void 0 : _a.customer_id;
        //create the logger
        const logger = req.scope.resolve('logger');
        const appLogRepository = req.scope.resolve('appLogRepository');
        const loggerContext = {
            logger,
            appLogRepository,
        };
        this.logger = (0, logger_1.createLogger)(loggerContext, `${this.method} ${this.route}`);
    }
    async handle(fn) {
        try {
            this.logger.info(`Input Params: ${JSON.stringify(this.inputParams)}`);
            const response = await fn(this);
        }
        catch (err) {
            const errorInfo = `ERROR ${JSON.stringify(err)} ${err}`;
            if (this.onError) {
                if (!this.onError(err))
                    this.returnStatusWithMessage(500, errorInfo);
            }
            else {
                this.returnStatusWithMessage(500, errorInfo);
            }
        }
    }
    returnStatus(status, payload, truncateToMax = 0) {
        let payloadString = JSON.stringify(payload);
        if (truncateToMax > 0)
            payloadString = payloadString.substring(0, truncateToMax) + '...';
        if (status == 500)
            this.logger.error(`${this.method} ${this.route} Returning ${status} with ${payloadString}`);
        else
            this.logger.info(`${this.method} ${this.route} Returning ${status} with ${payloadString}`);
        return this.response.status(status).json(payload);
    }
    returnStatusWithMessage(status, message) {
        return this.returnStatus(status, { message });
    }
    enforceCustomerId(customerId = null, requireValue = false) {
        if (!process.env.ENFORCE_ROUTE_IDENTITY ||
            process.env.ENFORCE_ROUTE_IDENTITY === 'false') {
            return true;
        }
        if (!requireValue && !(customerId === null || customerId === void 0 ? void 0 : customerId.length)) {
            return true;
        }
        const unauthorized = !customerId
            ? !this.customerId
            : !this.customerId || this.customerId !== customerId;
        if (unauthorized) {
            this.logger.warn(`Unauthorized customer for route call ${this.method} ${this.route}`);
            this.response
                .status(401)
                .json({ message: 'Unauthorized customer' });
        }
        else {
            console.log('customer ', this.customerId, ' is authorized');
        }
        return !unauthorized;
    }
    requireParams(params) {
        var _a;
        const missingParams = [];
        if (process.env.VALIDATE_ROUTE_PARAMS) {
            for (let p of params) {
                if (!this.hasParam(p))
                    missingParams.push(p);
            }
            if (missingParams.length) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn(`Call rejected for missing params: ${JSON.stringify(missingParams)}`);
                const message = `missing required param(s): ${missingParams.join()}`;
                this.response.status(400).json({ message });
                return false;
            }
        }
        return true;
    }
    requireParam(param) {
        return this.requireParams([param]);
    }
    hasParam(param) {
        return this.inputParams[param] ? true : false;
    }
}
exports.RouteHandler = RouteHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvcm91dGUtaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSx3REFBd0Q7QUFDeEQsZ0VBQStCO0FBQy9CLG9EQUFnRTtBQUdoRTs7O0dBR0c7QUFDSCxNQUFhLFlBQVk7SUFXckIsWUFDSSxHQUFrQixFQUNsQixHQUFtQixFQUNuQixNQUFjLEVBQ2QsS0FBYSxFQUNiLGtCQUE0QixFQUFFOztRQVBsQyxZQUFPLEdBQXNCLElBQUksQ0FBQztRQVM5QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUV0QixJQUFJLGVBQWUsYUFBZixlQUFlLHVCQUFmLGVBQWUsQ0FBRSxNQUFNLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUEsOEJBQWUsRUFBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFFRCw4QkFBOEI7UUFDOUIsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzlELENBQUM7UUFFRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0QsQ0FBQztRQUVELGlCQUFp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