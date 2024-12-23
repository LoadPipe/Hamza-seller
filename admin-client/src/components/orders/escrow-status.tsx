import React, { useState } from 'react';

const EscrowStatus = () => {
    const escrowStatusOptions = [
        '-',
        'in escrow',
        'buyer released',
        'released',
        'fully refunded',
    ];
    const [reason, setReason] = useState('');

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    return (
        <div>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex">
                    <h2 className="text-lg font-bold">Escrow Status</h2>
                </div>
            </div>
            <div className="mt-2">
                <select
                    value={reason}
                    onChange={handleReasonChange}
                    className="block w-full mt-2 p-2 rounded text-white bg-primary-black-90"
                >
                    {escrowStatusOptions.map((escrowStatus) => (
                        <option key={escrowStatus} value={escrowStatus}>
                            {escrowStatus}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default EscrowStatus;
