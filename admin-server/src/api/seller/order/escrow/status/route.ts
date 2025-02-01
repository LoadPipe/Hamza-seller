import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import StoreOrderService from '../../../../../services/store-order';
import {
    EscrowPaymentDefinition,
    PaymentDefinition,
} from 'src/web3/contracts/escrow';
import { getCurrencyPrecision } from 'src/currency.config';
import { BigNumberish, ethers } from 'ethers';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeOrderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/order/escrow/status'
    );

    const getRefundableAmount = (payment: PaymentDefinition) => {
        const refundedAmount = BigInt(
            payment.amountRefunded?.toString() ?? '0'
        );
        const refundableAmount =
            BigInt(payment.amount?.toString() ?? '0') -
            BigInt(payment.amountRefunded?.toString() ?? '0');

        return refundableAmount;
    };

    const validateRequest = (
        orderId: string,
        payment: EscrowPaymentDefinition,
        validateRefund: boolean = false,
        validateRelease: boolean = false
    ) => {
        if (!payment) {
            //order was not even found
            return `A payment escrow for order ${orderId} was not found.`;
        }

        //order was found but escrow wasn't
        if (!payment.payment) {
            return `A payment escrow for order ${orderId} was not found in escrow ${payment.escrow_address} on chain ${payment.chain_id}.`;
        }

        //if full released, cannot be refunded or released
        if (payment.payment.released) {
            return `A payment escrow for order ${orderId} in escrow ${payment.escrow_address} on chain ${payment.chain_id} has already been released.`;
        }

        //if caller is not the receiver, then nothing will work
        if (handler.inputParams.wallet_address?.length) {
            if (
                handler.inputParams.wallet_address.trim().toLowerCase() !==
                payment.payment.receiver.trim().toLowerCase()
            ) {
                return `Only the owner of wallet ${payment.payment.receiver} can modify the escrow.`;
            }
        }

        if (validateRefund) {
            //validate refund amount
            if (handler.inputParams.refund_amount) {
                const amount = BigInt(
                    handler.inputParams.refund_amount.toString()
                );
                const refundableAmount = getRefundableAmount(payment.payment);
                if (amount >= refundableAmount) {
                    return `The amount of ${handler.inputParams.refund_amount} exceeds the refundable amount of ${refundableAmount}.`;
                }
            }
        } else if (validateRelease) {
            //cannot be released by receiver if already released by receiver
            if (payment.payment.receiverReleased) {
                return `A payment escrow for order ${orderId} in escrow ${payment.escrow_address} on chain ${payment.chain_id} has already been released by the receiver.`;
            }
        }

        return null;
    };

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('order_id')) {
            return;
        }

        handler.onError = (err: any) => {
            handler.logger.error('Error in getting escrow', err);
            return handler.returnStatus(200, {
                error: 'An unknown error occurred',
            });
        };

        const orderId = handler.inputParams.order_id;

        //should validate?
        let { validate_refund, validate_release } = handler.inputParams;
        validate_refund = validate_refund === 'true' ? true : false;
        validate_release = validate_release === 'true' ? true : false;

        //get the payment
        const payment: EscrowPaymentDefinition =
            await storeOrderService.getEscrowPayment(orderId);

        //validate?
        const error =
            validate_refund || validate_release
                ? validateRequest(
                      orderId,
                      payment,
                      validate_refund,
                      validate_release
                  )
                : null;

        // Return the updated order details in the response
        return handler.returnStatus(200, {
            ...payment,
            error,
        });
    });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeOrderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(
        req,
        res,
        'PUT',
        '/seller/order/escrow/status',
        ['order_id']
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('order_id')) {
            return;
        }

        // Return the updated order details in the response

        // Return the updated order details in the response
        return handler.returnStatus(
            200,
            await storeOrderService.syncEscrowPayment(
                handler.inputParams.order_id
            )
        );
    });
};
