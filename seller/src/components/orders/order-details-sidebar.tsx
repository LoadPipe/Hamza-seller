// order-details-sidebar.tsx
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    // SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useStore } from '@tanstack/react-store'; // Import useStore to read the store state
import {
    orderSidebarStore,
    closeOrderSidebar,
} from '@/stores/order-sidebar/order-sidebar-store.ts';
import Timeline from '@/components/orders/timeline.tsx';
import Item from '@/components/orders/item.tsx';
import Payment from '@/components/orders/payment.tsx';
import { X, Clock, ShoppingCart, CheckCircle, Loader } from 'lucide-react'; // Icons from lucide-react

const items = [
    {
        name: '2024 MacBook Pro 14” M3 Chip 8GB Unified Memory 512GB SSD',
        variants: 'Variants: 8GB Ram | 512GB SSD | Space Gray',
        quantity: 1,
        subtotal: '$1499.99',
        discount: '$29.99',
        total: '$1479.99',
        image: '/path-to-image.jpg', // Replace with your image path
    },
    {
        name: '2024 MacBook Pro 14” M3 Chip 8GB Unified Memory 512GB SSD',
        variants: 'Variants: 8GB Ram | 512GB SSD | Space Gray',
        quantity: 1,
        subtotal: '$1499.99',
        discount: '$29.99',
        total: '$1479.99',
        image: '/path-to-image.jpg',
    },
];

export function OrderDetailsSidebar() {
    // Use the store to determine if the sidebar should be open
    const isSidebarOpen = useStore(
        orderSidebarStore,
        (state) => state.isSidebarOpen
    );

    // Conditionally render the sidebar only when it's open
    if (!isSidebarOpen) return null;

    return (
        <div>
            {' '}
            {/* Sidebar container */}
            <Sidebar
                side="right"
                className="fixed right-0 top-0 h-full w-order-details bg-primary-black-90 "
            >
                <SidebarHeader className="bg-primary-black-85 h-[87px] p-[24px]">
                    <div className="flex justify-between">
                        <div className="flex-col">
                            <h1 className="text-xl font-bold text-white">
                                #237341
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
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <span className="text-primary-black-60 text-sm leading-relaxed">
                                CREATED AT
                            </span>
                            <span className="text-white text-md">
                                Aug 28, 2024, 4:50 PM
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-primary-black-60 text-sm leading-relaxed">
                                PAYMENT
                            </span>
                            <span className="text-white text-md">
                                Awaiting Payment
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-primary-black-60 text-sm leading-relaxed">
                                STATUS
                            </span>
                            <span className="text-white text-md">
                                Processing
                            </span>
                        </div>
                    </div>
                    <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                    <div className="flex flex-col space-y-[24px]">
                        {/* Header Row */}
                        <div>
                            <span className="text-primary-black-60 text-md leading-relaxed">
                                Customer
                            </span>
                        </div>

                        {/* Name Row */}
                        <div className="flex justify-between">
                            <div className="w-1/3">
                                <span className="text-primary-black-60">
                                    Name:
                                </span>
                            </div>
                            <div className="w-2/3 text-left">
                                <span className="text-white">
                                    Garo Nazarian
                                </span>
                            </div>
                        </div>

                        {/* Customer ID Row */}
                        <div className="flex justify-between">
                            <div className="w-1/3">
                                <span className="text-primary-black-60">
                                    Customer ID:
                                </span>
                            </div>
                            <div className="w-2/3 text-left">
                                <span className="text-white">
                                    cust_01JC4ZPC5KERFMBPXWJFH53PXZ
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
                            <div className="w-2/3 text-left">
                                <span className="text-white">
                                    1AcLZzPvlczGBj4pDzZtsIerCiPoTxEish
                                </span>
                            </div>
                        </div>

                        {/* Email Address Row */}
                        <div className="flex justify-between">
                            <div className="w-1/3">
                                <span className="text-primary-black-60">
                                    Email Address:
                                </span>
                            </div>
                            <div className="w-2/3 text-left">
                                <span className="text-white">
                                    katebuhay@gmail.com
                                </span>
                            </div>
                        </div>

                        {/* Shipping Address Row */}
                        <div className="flex justify-between">
                            <div className="w-1/3">
                                <span className="text-primary-black-60">
                                    Shipping Address:
                                </span>
                            </div>
                            <div className="w-2/3 text-left">
                                <span className="text-white">
                                    3362 Jakubowski Points, Williamston, VA
                                    92904
                                </span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                    <Timeline />

                    <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                    <div className="flex flex-col">
                        <h2 className="text-primary-black-60 text-md leading-relaxed mb-4">
                            ITEM
                        </h2>
                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                {/* Render the Item */}
                                <Item {...item} />

                                {/* Dashed Divider for all except the last Item */}
                                {index !== items.length - 1 && (
                                    <div className="border-t border-dashed border-primary-black-60 my-[16px]"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

                    <Payment
                        subtotal="1,499.99"
                        discount="4.99"
                        shippingFee="24.99"
                        total="1,529.97"
                    />

                    <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />

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
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
