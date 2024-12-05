"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteSwitchClient = void 0;
const ethers_1 = require("ethers");
const lite_switch_abi_1 = require("../abi/lite-switch-abi");
const contracts_config_1 = require("../../contracts.config");
class LiteSwitchClient {
    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(chainId) {
        this.tokens = {};
        this.contractAddress = (0, contracts_config_1.getContractAddress)('lite_switch', chainId);
        this.provider = new ethers_1.ethers.JsonRpcProvider(process.env.ETHERS_RPC_PROVIDER_URL);
        this.switchClient = new ethers_1.ethers.Contract(this.contractAddress, lite_switch_abi_1.liteSwitchAbi, this.provider);
    }
    async findPaymentEvents(orderId, transactionId) {
        const orderIdHash = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(orderId));
        const eventFilter = this.switchClient.filters.PaymentReceived();
        const txReceipt = await this.provider.getTransactionReceipt(transactionId);
        const events = await this.switchClient.queryFilter(eventFilter, txReceipt.blockNumber, txReceipt.blockNumber + 1);
        return events.map(e => {
            const event = e;
            return {
                orderId: event.args[0].hash,
                amount: event.args[4]
            };
        }).filter(e => e.orderId === orderIdHash);
    }
}
exports.LiteSwitchClient = LiteSwitchClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl0ZS1zd2l0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViMy9jb250cmFjdHMvbGl0ZS1zd2l0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQThDO0FBQzlDLDREQUF1RDtBQUN2RCw2REFBNEQ7QUFHNUQsTUFBYSxnQkFBZ0I7SUFPekI7OztPQUdHO0lBQ0gsWUFDSSxPQUFlO1FBUG5CLFdBQU0sR0FBc0MsRUFBRSxDQUFDO1FBUzNDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBQSxxQ0FBa0IsRUFBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBRWhGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxlQUFNLENBQUMsUUFBUSxDQUNuQyxJQUFJLENBQUMsZUFBZSxFQUNwQiwrQkFBYSxFQUNiLElBQUksQ0FBQyxRQUFRLENBQ2hCLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQWUsRUFBRSxhQUFxQjtRQUcxRCxNQUFNLFdBQVcsR0FBRyxlQUFNLENBQUMsU0FBUyxDQUFDLGVBQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNsRSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUVoRSxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFM0UsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FDOUMsV0FBVyxFQUNYLFNBQVMsQ0FBQyxXQUFXLEVBQ3JCLFNBQVMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUM1QixDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sS0FBSyxHQUFHLENBQVEsQ0FBQztZQUN2QixPQUFPO2dCQUNILE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQzNCLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUN4QixDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0o7QUE5Q0QsNENBOENDIn0=