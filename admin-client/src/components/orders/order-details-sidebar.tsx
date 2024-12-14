import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
} from '@/components/ui/sidebar';
import { useStore } from '@tanstack/react-store';
import {
    orderSidebarStore,
    closeOrderSidebar,
} from '@/stores/order-sidebar/order-sidebar-store';
import Timeline from '@/components/orders/timeline';
import Item from '@/components/orders/item';
import Payment from '@/components/orders/payment';
import Refund from '@/components/orders/refund';
import { X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    formatStatus,
    formatDate,
    customerName,
    formatShippingAddress,
} from '@/utils/format-data.ts';
import { getSecure, putSecure } from '@/utils/api-calls';
import { formatCryptoPrice } from '@/utils/get-product-price.ts';
import { getOrderStatusName } from '@/utils/check-order-status.ts';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export function OrderDetailsSidebar() {
    // Use the store to determine if the sidebar should be open
    const { isSidebarOpen, orderId } = useStore(orderSidebarStore);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const {
        data: orderDetails,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['orderDetails', orderId],
        queryFn: async () => {
            if (!orderId) {
                throw new Error('Order ID is required');
            }
            return await getSecure('/seller/order/detail', {
                order_id: orderId,
            });
        },
        enabled: !!orderId && isSidebarOpen, // Fetch only when these conditions are met
        refetchOnWindowFocus: false, // Prevent refetching on focus
        retry: 1, // Optional: Limit retries to avoid overloading the API
        staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes
    });

    const [selectedStatus, setSelectedStatus] = useState(() =>
        getOrderStatusName(
            orderDetails?.fulfillment_status,
            orderDetails?.status,
            orderDetails?.payment_status
        )
    );

    let currencyCode = orderDetails?.payments[0]?.currency_code;

    useEffect(() => {
        currencyCode = orderDetails?.payments[0]?.currency_code;
        if (
            orderDetails?.fulfillment_status &&
            orderDetails?.status &&
            orderDetails?.payment_status
        ) {
            setSelectedStatus(
                getOrderStatusName(
                    orderDetails.fulfillment_status,
                    orderDetails.status,
                    orderDetails.payment_status
                )
            );
        }
    }, [orderDetails]);

    console.log(`STATUS IS ${selectedStatus}`);
    console.log('Details', orderDetails);

    const mutation = useMutation({
        mutationFn: async (newStatus: string) =>
            await putSecure('/seller/order/status', {
                order_id: orderId,
                status: newStatus,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['orderDetails', orderId],
            });
            // invalidate papa
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast({
                variant: 'default',
                title: 'Success!',
                description: 'Order status updated successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description:
                    error?.response?.data?.message ||
                    'Failed to update status.',
            });
        },
    });

    // Conditionally render the sidebar only when it's open
    if (!isSidebarOpen) return null;

    const handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newStatus = event.target.value;
        setSelectedStatus(newStatus);
        mutation.mutate(newStatus);
    };

    const statusDetails = orderDetails && {
        status: orderDetails.status,
        fulfillment_status: orderDetails.fulfillment_status,
        payment_status: orderDetails.payment_status,
        created_at: orderDetails.created_at,
        updated_at: orderDetails.updated_at,
    };
    const totalPrice = (orderDetails?.items || []).reduce(
        (acc: number, item: any) => {
            const unitPrice = Number(item.unit_price) || 0; // Ensure it's a number
            const quantity = Number(item.quantity) || 0; // Ensure it's a number
            return acc + unitPrice * quantity;
        },
        0 // Initial accumulator value
    );
    return (
        <div>
            <Sidebar
                side="right"
                className="fixed right-0 top-0 h-full w-order-details bg-primary-black-90"
            >
                <SidebarHeader className="bg-primary-black-85 h-[87px] p-[24px]">
                    <div className="flex justify-between">
                        <div className="flex-col">
                            <h1 className="text-xl font-bold text-white">
                                #{orderDetails?.id || 'Loading...'}
                            </h1>
                            <span className="text-sm text-primary-black-60">
                                ORDER ID
                            </span>
                        </div>
                        <div
                            onClick={closeOrderSidebar}
                            role="button"
                            tabIndex={0}
                            className="cursor-pointer text-white hover:text-primary-green-800 flex-end"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ')
                                    closeOrderSidebar();
                            }}
                        >
                            <X className="text-white hover:text-green-900" />
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-[24px]">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : isError ? (
                        <div>Error loading order details.</div>
                    ) : (
                        <>
                            {/* Order Info */}
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <span className="text-primary-black-60 text-sm leading-relaxed">
                                        CREATED AT
                                    </span>
                                    <span className="text-white text-md">
                                        {formatDate(orderDetails?.created_at)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-primary-black-60 text-sm leading-relaxed">
                                        PAYMENT
                                    </span>
                                    <span className="text-white text-md">
                                        {formatStatus(
                                            orderDetails?.payment_status
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-primary-black-60 text-sm leading-relaxed">
                                        STATUS
                                    </span>
                                    {selectedStatus ? (
                                        <select
                                            className="text-white bg-primary-black-85 rounded-md p-2"
                                            value={selectedStatus}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="Processing">
                                                Processing
                                            </option>
                                            <option value="Shipped">
                                                Shipped
                                            </option>
                                            <option value="Delivered">
                                                Delivered
                                            </option>
                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                            <option value="Refunded">
                                                Refunded
                                            </option>
                                        </select>
                                    ) : (
                                        <div>Loading status...</div>
                                    )}
                                </div>
                            </div>
                            <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                            {/* Customer Info */}
                            <div className="flex flex-col">
                                <div>
                                    <span className="text-primary-black-60 text-md leading-relaxed mb-[16px]">
                                        Customer
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <div className="w-1/3">
                                        <span className="text-primary-black-60">
                                            Name:
                                        </span>
                                    </div>
                                    <div className="w-2/3 text-left">
                                        <span className="text-white">
                                            {customerName(
                                                orderDetails?.customer
                                                    ?.first_name,
                                                orderDetails?.customer
                                                    ?.last_name
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="w-1/3">
                                        <span className="text-primary-black-60">
                                            Customer ID:
                                        </span>
                                    </div>
                                    <div className="w-2/3 text-left">
                                        <span className="text-white">
                                            {orderDetails?.customer_id}
                                        </span>
                                    </div>
                                </div>

                                {/* Wallet Address Row */}
                                <div className="flex justify-between">
                                    <div className="w-1/3">
                                        <span className="text-primary-black-60">
                                            Wallet Address:
                                        </span>
                                    </div>
                                    <div className="w-2/3 text-left break-words">
                                        <span className="text-white">
                                            {
                                                orderDetails?.customer
                                                    ?.walletAddresses?.[0]
                                                    ?.wallet_address
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="w-1/3">
                                        <span className="text-primary-black-60">
                                            Email Address:
                                        </span>
                                    </div>
                                    <div className="w-2/3 text-left">
                                        <span className="text-white">
                                            {orderDetails?.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="w-1/3">
                                        <span className="text-primary-black-60">
                                            Shipping Address:
                                        </span>
                                    </div>
                                    <div className="w-2/3 text-left">
                                        <span className="text-white">
                                            {formatShippingAddress(
                                                orderDetails?.shipping_address
                                                    ?.address_1,
                                                orderDetails?.shipping_address
                                                    ?.address_2,
                                                orderDetails?.shipping_address
                                                    ?.city,
                                                orderDetails?.shipping_address
                                                    ?.province,
                                                orderDetails?.shipping_address
                                                    ?.postal_code
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                            {/* Timeline */}
                            <Timeline orderDetails={statusDetails} />

                            <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                            <Refund
                                date={formatDate(orderDetails?.created_at)}
                                firstName={orderDetails?.customer?.first_name}
                                lastName={orderDetails?.customer?.last_name}
                                email={orderDetails?.email}
                                orderId={orderDetails?.id}
                                customerId={orderDetails?.customer_id}
                                order={orderDetails}
                            />

                            {/* Items */}
                            <div className="flex flex-col">
                                <h2 className="text-primary-black-60 text-md leading-relaxed mb-4">
                                    ITEMS
                                </h2>
                                {orderDetails.items.map(
                                    (item: any, index: number) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col"
                                        >
                                            <Item
                                                name={item.title}
                                                variants={item.variant.title}
                                                quantity={item.quantity.toString()}
                                                unitPrice={item.unit_price}
                                                discount={0} // Adjust as needed
                                                currencyCode={
                                                    orderDetails.payments[0]
                                                        .currency_code
                                                }
                                                image={item.thumbnail}
                                            />
                                            {index !==
                                                orderDetails.items.length -
                                                    1 && (
                                                <div className="border-t border-dashed border-primary-black-60 my-[16px]"></div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>

                            <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                            {/* Payment */}
                            <Payment
                                subtotal={`${formatCryptoPrice(totalPrice, currencyCode)}`}
                                discount={0} // Adjust as needed
                                shippingFee="0.00" // Adjust as needed
                                currencyCode={currencyCode}
                                total={formatCryptoPrice(
                                    orderDetails.payments[0].amount,
                                    currencyCode
                                )}
                            />

                            <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                            {/* Buttons */}
                            <div className="flex justify-between space-x-4">
                                <button className="flex-1 py-2 bg-primary-black-85 text-white text-sm font-semibold rounded">
                                    Download Invoice
                                </button>
                                <button className="flex-1 py-2 bg-primary-black-85 text-white text-sm font-semibold rounded">
                                    Message Buyer
                                </button>
                                <button className="flex-1 py-2 bg-primary-black-85 text-white text-sm font-semibold rounded">
                                    Edit Order
                                </button>
                            </div>
                        </>
                    )}
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
