"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const awilix_1 = require("awilix");
const customer_wallet_address_1 = __importDefault(require("../repositories/customer-wallet-address"));
const logger_1 = require("../utils/logging/logger");
class CustomerService extends medusa_1.CustomerService {
    constructor(container) {
        super(container);
        this.customerRepository_ = container.customerRepository;
        this.customerNotificationService_ = container.customerNotificationService;
        this.logger = (0, logger_1.createLogger)(container, 'CustomerService');
    }
    async create(input) {
        this.logger.debug(`CustomerService.create() method running with input; ${input}`);
        if (input === null || input === void 0 ? void 0 : input.wallet_address)
            input.wallet_address = input.wallet_address.trim().toLowerCase();
        if (input === null || input === void 0 ? void 0 : input.email)
            input.email = input.email.trim().toLowerCase();
        let existingWalletAddress = await customer_wallet_address_1.default.findOne({
            where: { wallet_address: input.wallet_address },
            relations: { customer: { preferred_currency: true } },
            select: { wallet_address: true },
        });
        if (existingWalletAddress) {
            this.logger.debug(`Customer with wallet address ${input.wallet_address} already exists`);
            return {
                customer: existingWalletAddress.customer,
                customerWalletAddress: existingWalletAddress,
                customerPreferredCurrency: existingWalletAddress.customer.preferred_currency,
            };
        }
        else {
            this.logger.debug(`Customer with wallet address ${input.wallet_address} not found`);
        }
        this.logger.debug(`creating Customer with input ${JSON.stringify(input)}`);
        try {
            //create customer
            const _customer = await super.create(input);
            //save customer wallet 
            const _customerWalletAddress = await customer_wallet_address_1.default.save({
                customer: { id: _customer.id },
                wallet_address: input.wallet_address,
            });
            //save preferred currency 
            let _customerPreferredCurrency = await this.customerRepository_.findOne({
                where: { id: _customer.id },
                relations: { preferred_currency: true },
                select: { id: true },
            });
            //set default notification types 
            this.customerNotificationService_.setDefaultNotifications(_customer.id);
            this.logger.debug(`Extending Customer with wallet address: ${_customer.wallet_address}`);
            return {
                customer: _customer,
                customerWalletAddress: _customerWalletAddress,
                customerPreferredCurrency: _customerPreferredCurrency.preferred_currency,
            };
        }
        catch (e) {
            this.logger.error(`Error creating customer: ${e}`);
        }
        // lets add a try catch for actually creating a customer?
    }
    async updateCurrency(customerId, currency) {
        this.logger.debug('CustomerService UpdateCurrency method running');
        let customer = await this.customerRepository_.findOne({
            where: { id: customerId },
            select: { id: true },
        });
        if (!customer) {
            this.logger.debug(`Customer with id ${customerId} not found`);
            return null;
        }
        this.logger.debug(`Customer Selected ${JSON.stringify(customer)}`);
        try {
            let updatedCustomer = await this.customerRepository_.save({
                ...customer,
                preferred_currency_id: currency,
            });
            this.logger.debug(`Customer with id ${currency} updated with currency ID ${currency}`);
            return updatedCustomer;
        }
        catch (e) {
            this.logger.error(`Error updating customer currency: ${e}`);
            throw e; // It might be helpful to rethrow the error for further handling by the caller.
        }
    }
    async getCustomerCurrency(customerId) {
        this.logger.debug('CustomerService getCustomerCurrency method running');
        // Find the customer by ID
        let customer = await this.customerRepository_.findOne({
            where: { id: customerId },
            select: { preferred_currency_id: true },
        });
        // Check if the customer exists
        if (!customer) {
            this.logger.debug(`Customer with id ${customerId} not found`);
            return null;
        }
        this.logger.debug(`Customer Selected ${JSON.stringify(customer)}`);
        // Return the preferred currency ID
        try {
            const currency = customer.preferred_currency_id;
            this.logger.debug(`Customer with id ${customerId} has preferred currency ID ${currency}`);
            return currency;
        }
        catch (e) {
            this.logger.error(`Error retrieving customer currency: ${e}`);
            throw e; // Rethrow the error for further handling by the caller.
        }
    }
    async isVerified(customer_id) {
        const customer = await this.customerRepository_.findOne({
            where: { id: customer_id },
        });
        if (!customer) {
            throw new Error('Customer not found');
        }
        this.logger.debug(`Customer Email is: ${customer.email}`);
        // Returns true if the email does NOT include '@evm.blockchain'
        return customer.email.includes('@evm.blockchain');
    }
}
CustomerService.LIFE_TIME = awilix_1.Lifetime.SINGLETON; // default, but just to show how to change it
exports.default = CustomerService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvY3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2Q0FHMEI7QUFFMUIsbUNBQWtDO0FBRWxDLHNHQUFzRjtBQUN0RixvREFBZ0U7QUFPaEUsTUFBcUIsZUFBZ0IsU0FBUSx3QkFBcUI7SUFPOUQsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDO1FBQ3hELElBQUksQ0FBQyw0QkFBNEIsR0FBRyxTQUFTLENBQUMsMkJBQTJCLENBQUM7UUFDMUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBMEI7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2IsdURBQXVELEtBQUssRUFBRSxDQUNqRSxDQUFDO1FBRUYsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsY0FBYztZQUNyQixLQUFLLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFckUsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSztZQUNaLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuRCxJQUFJLHFCQUFxQixHQUNyQixNQUFNLGlDQUErQixDQUFDLE9BQU8sQ0FBQztZQUMxQyxLQUFLLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUMvQyxTQUFTLEVBQUUsRUFBRSxRQUFRLEVB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