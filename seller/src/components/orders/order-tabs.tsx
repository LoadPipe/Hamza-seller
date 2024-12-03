import { useEffect, useState } from 'react';
import {
    clearAllFilters,
    setFilter,
    clearFilter,
    loadStatusCountFromStorage,
} from '@/stores/order-filter/order-filter-store';

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
        },
    },
    {
        key: 'refunded',
        label: 'Refunded',
        filters: {
            payment_status: ['refunded'],
        },
    },
];

const OrderTabs = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
        all: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0,
    });
    useEffect(() => {
        // Load the status counts from local storage
        const loadedCounts = loadStatusCountFromStorage();
        setStatusCounts(loadedCounts);
    }, []);
    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
        console.log(`Selected Tab: ${tabKey}`);

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
