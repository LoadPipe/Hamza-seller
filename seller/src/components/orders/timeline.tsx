const Timeline = () => {
    const events = [
        {
            title: 'Order delivered',
            details: 'Delivery confirmation from courier.',
            reference: 'Reference no. 984366608123',
            timestamp: 'Aug. 28, 2024, 4:54 PM',
        },
        {
            title: 'Order in transit',
            details: 'Status changed from Processing to In Transit.',
            reference: 'Aug. 28, 2024, 4:54 PM',
            timestamp: 'Aug. 28, 2024, 4:54 PM',
        },
        {
            title: 'Processing',
            details: 'Status changed from Packing to Processing.',
            reference: 'Aug. 28, 2024, 4:54 PM',
            timestamp: 'Aug. 28, 2024, 4:54 PM',
        },
        {
            title: 'Order received',
            details: 'Status changed from In Transit to Order Received.',
            reference: 'Aug. 28, 2024, 4:54 PM',
            timestamp: 'Aug. 28, 2024, 4:54 PM',
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
                                <span className="text-primary-black-60 text-sm">
                                    {event.timestamp}
                                </span>
                            </div>
                            <div className="">
                                <p className="text-primary-black-60 text-sm">
                                    {event.details}
                                </p>
                                <p className="text-primary-black-60 text-sm font-medium">
                                    {event.reference}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
