"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const confirmation_token_1 = __importDefault(require("../repositories/confirmation-token"));
const customer_1 = __importDefault(require("../repositories/customer"));
const moment_1 = __importDefault(require("moment"));
const ethers_1 = require("ethers");
const smtp_mail_1 = __importDefault(require("./smtp-mail"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../utils/logging/logger");
dotenv_1.default.config();
class ConfirmationTokenService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.confirmationTokenRepository_ = confirmation_token_1.default;
        this.customerRepository_ = customer_1.default;
        this.logger = (0, logger_1.createLogger)(container, 'ConfirmationTokenService');
        this.eventBus_ = container.eventBusService;
    }
    async createConfirmationToken({ customer_id, email, }) {
        if (email)
            email = email.trim().toLowerCase();
        let emailCheck = await this.customerRepository_.findOne({
            where: { email },
        });
        if (emailCheck) {
            console.log('ERROR: email arready exists');
            return {
                status: 'error',
                message: 'Email already associated with a different account',
            };
        }
        let token = ethers_1.ethers.keccak256(ethers_1.ethers.randomBytes(32));
        this.logger.debug('token is ' + token);
        let confirmationToken = await this.confirmationTokenRepository_.save({
            id: token,
            customer: { id: customer_id },
            email_address: email,
            token: token,
        });
        // Send confirmation email
        let smtpService = new smtp_mail_1.default();
        await smtpService.sendMail({
            from: process.env.SMTP_FROM,
            subject: 'Email Verification',
            templateName: 'verify-email',
            to: email,
            //TODO: note that the 'en' here is hard-coded
            mailData: {
                url: `${process.env.STORE_URL}/en/verify-confirmation-token/${token}`,
            },
        });
        return {
            status: 'success',
            message: 'Token created successfully',
            token,
        };
    }
    async getConfirmationToken(token) {
        return await this.confirmationTokenRepository_.findOne({
            where: { token: token },
        });
    }
    async verifyConfirmationToken(token) {
        var _a, _b;
        let tokenCheck = await this.confirmationTokenRepository_.findOne({
            where: { token: token },
        });
        //check for existence of token
        if (!tokenCheck) {
            throw new Error('Token not found');
        }
        //check if already used
        if (tokenCheck.redeemed) {
            throw new Error('Token redeemed already');
        }
        //check for token expiration
        if ((0, moment_1.default)().diff(tokenCheck.created_at, 'hour') >
            tokenCheck.expiration_hours) {
            throw new Error('Token Expired');
        }
        //get the customer & verify
        let customerData = await this.customerRepository_.findOne({
            where: { id: tokenCheck.customer_id },
            relations: { walletAddresses: true },
        });
        if (customerData.walletAddresses.length == 0) {
            throw new Error('Please link a wallet before email verification');
        }
        //update customer record
        await this.customerRepository_.update({ id: customerData.id }, { is_verified: true, email: (_b = (_a = tokenCheck === null || tokenCheck === void 0 ? void 0 : tokenCheck.email_address) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase() });
        await this.confirmationTokenRepository_.update({ token: tokenCheck.token }, { redeemed: true });
        //sending email for the confirmation
        await this.eventBus_.emit([
            {
                data: { email: tokenCheck.email_address, id: customerData.id },
                eventName: 'customer.verified',
            },
        ]);
    }
}
exports.default = ConfirmationTokenService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybWF0aW9uLXRva2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbmZpcm1hdGlvbi10b2tlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZDQUkwQjtBQUMxQiw0RkFBNkU7QUFDN0Usd0VBQTBEO0FBQzFELG9EQUE0QjtBQUM1QixtQ0FBZ0M7QUFDaEMsNERBQTBDO0FBQzFDLG9EQUE0QjtBQUM1QixvREFBZ0U7QUFFaEUsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQixNQUFxQix3QkFBeUIsU0FBUSwrQkFBc0I7SUFNeEUsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsNEJBQTRCLEdBQUcsNEJBQTJCLENBQUM7UUFDaEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBQSxxQkFBWSxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsS0FBSyxDQUFDLHVCQUF1QixDQUFDLEVBQzFCLFdBQVcsRUFDWCxLQUFLLEdBSVI7UUFDRyxJQUFJLEtBQUs7WUFDTCxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXZDLElBQUksVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztZQUNwRCxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUU7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUMzQyxPQUFPO2dCQUNILE1BQU0sRUFBRSxPQUFPO2dCQUNmLE9BQU8s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