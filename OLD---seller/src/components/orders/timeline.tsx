import React from 'react';
import { formatDate, formatStatus } from '@/utils/format-data.ts';

interface TimelineEvent {
    title: string;
    details: string;
    timestamp?: string; // Optional since some statuses won't have timestamps
}

interface TimelineProps {
    orderDetails: {
        created_at: string;
        updated_at: string;
        status: string;
        fulfillment_status: string;
        payment_status: string;
    };
}

const Timeline: React.FC<TimelineProps> = ({ orderDetails }) => {
    // Map order statuses to timeline events
    const events: TimelineEvent[] = [
        {
            title: 'Order Placed',
            details: 'The order was created.',
            timestamp: formatDate(orderDetails.created_at),
        },
        {
            title: 'Order Status Updated',
            details: `Status changed to ${formatStatus(orderDetails.status)}.`,
            timestamp:
                orderDetails.updated_at !== orderDetails.created_at
                    ? formatDate(orderDetails.updated_at)
                    : undefined,
        },
        {
            title: 'Fulfillment Status',
            details: `Fulfillment is currently ${formatStatus(orderDetails.fulfillment_status)}.`,
        },
        {
            title: 'Payment Status',
            details: `Payment is currently ${formatStatus(orderDetails.payment_status)}.`,
        },
    ];

    return (
        <div className="flex flex-col">
            <h2 className="text-primary-black-60 text-sm leading-relaxed mb-4">
                TIMELINE
            </h2>
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute top-0 left-2.5 h-full border-l border-primary-black-60"></div>
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="flex items-start mb-[24px] last:mb-0"
                    >
                        {/* Dot */}
                        <div className="relative flex items-center justify-center h-5 w-5 bg-black rounded-full border-2 border-white">
                            <div className="h-2.5 w-2.5 bg-primary-black-60 rounded-full"></div>
                        </div>
                        {/* Event Content */}
                        <div className="ml-4 flex-1">
                            <div className="flex justify-between mb-[16px]">
                                <h3 className="text-white font-bold">
                                    {event.title}
                                </h3>
                                {event.timestamp && (
                                    <span className="text-primary-black-60 text-sm">
                                        {event.timestamp}
                                    </span>
                                )}
                            </div>
                            <p className="text-primary-black-60 text-sm">
                                {event.details}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
