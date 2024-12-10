import { useEffect, useState } from 'react';
import {
    clearAllFilters,
    setFilter,
    clearFilter,
    loadStatusCountFromStorage,
    filterStore,
    orderCountStore,
} from '@/stores/order-filter/order-filter-store';
import { useStore } from '@tanstack/react-store';

const baseButtonStyles = `
    relative flex items-center bg-transparent after:content-[""]
    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full
`;

const tabs = [
    {
        key: 'all',
        label: 'All Orders',
        filters: null, // Indicates no specific filters for "All Orders"
    },
    {
        key: 'processing',
        label: 'Processing',
        filters: {
            fulfillment_status: ['not_fulfilled'],
            status: ['pending'],
        },
    },
    {
        key: 'shipped',
        label: 'Shipped',
        filters: {
            fulfillment_status: ['shipped'],
            payment_status: ['captured'],
        },
    },
    {
        key: 'delivered',
        label: 'Delivered',
        filters: {
            fulfillment_status: ['fulfilled'],
            status: ['completed'],
        },
    },
    {
        key: 'cancelled',
        label: 'Cancelled',
        filters: {
            status: ['canceled'],
            fulfillment_status: ['canceled'],
        },
    },
    {
        key: 'refunded',
        label: 'Refunded',
        filters: {
            payment_status: ['refunded'],
            fulfillment_status: ['canceled'],
        },
    },
];

const OrderTabs = ({
    setPageIndex,
}: {
    setPageIndex: (pageIndex: number) => void;
}) => {
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
        all: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0,
    });
    const { filters } = useStore(filterStore); // Subscribe to filterStore

    console.log(`$$$ WHY ARE YOU GAY`);
    const { statusCounts: storeStatusCounts } = useStore(orderCountStore);
    const getActiveTab = () => {
        for (const tab of tabs) {
            if (!tab.filters) continue; // Skip "All Orders" as it has no specific filters

            const filtersMatch = Object.entries(tab.filters).every(
                ([key, values]) =>
                    filters[key]?.in?.length === values.length &&
                    filters[key]?.in?.every((val: string) =>
                        values.includes(val)
                    )
            );

            if (filtersMatch) {
                return tab.key;
            }
        }
        return 'all'; // Default to "All Orders" if no filters match
    };

    const activeTab = getActiveTab(); // Calculate active tab dynamically

    useEffect(() => {
        // Load the status counts from local storage
        const loadedCounts = loadStatusCountFromStorage();
        setStatusCounts(loadedCounts);
    }, [storeStatusCounts]);

    const handleTabChange = (tabKey: string) => {
        console.log(`Selected Tab: ${tabKey}`);

        setPageIndex(0);
        // Clear filters for "All Orders" or apply specific filters
        if (tabKey === 'all') {
            clearFilter('status');
            clearFilter('fulfillment_status');
            clearFilter('payment_status');
            return;
        }

        // Clear all filters before applying new ones
        clearAllFilters();

        // Find the tab and apply filters
        const selectedTab = tabs.find((tab) => tab.key === tabKey);
        if (selectedTab?.filters) {
            Object.entries(selectedTab.filters).forEach(([key, values]) => {
                setFilter(key, { in: values });
            });
        }
    };

    return (
        <div className="pb-6">
            <div className="flex w-full text-[12px] gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`${baseButtonStyles} ${
                            activeTab === tab.key
                                ? 'text-primary-green-900 after:bg-primary-green-900'
                                : 'text-white after:bg-primary-black-65'
                        }`}
                    >
                        {tab.label} {/* Capitalized label */}
                        <span
                            className={`ml-2 px-2 py-1 rounded text-xs ${
                                activeTab === tab.key
                                    ? 'bg-primary-green-900 text-black'
                                    : 'bg-primary-black-70 text-white'
                            }`}
                        >
                            {statusCounts[tab.key] ?? 0}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OrderTabs;
