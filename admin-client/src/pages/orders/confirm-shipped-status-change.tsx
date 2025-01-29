// src/components/ConfirmShippedStatusChange.tsx

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OctagonAlert } from 'lucide-react';
import { useState } from 'react';

interface ConfirmShippedStatusChange {
    isOpen: boolean;
    newStatus: string | null;
    onConfirm: (note: string, trackingNumber: string) => void;
    onCancel: () => void;
}

export function ConfirmShippedStatusChange({
    isOpen,
    newStatus,
    onConfirm,
    onCancel,
}: ConfirmShippedStatusChange) {
    const [note, setNote] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    const handleConfirm = () => {
        onConfirm(note, trackingNumber);
        setNote('');
        setTrackingNumber('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[448.97px] bg-primary-black-90 text-white m-['40px'] [&>button]:hidden border-primary-purple-90">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <OctagonAlert
                            size={64}
                            className="text-primary-yellow-900 animate-pulse"
                        />
                    </div>
                    <DialogTitle className="text-center pb-[32px]">
                        Confirm Status Change
                    </DialogTitle>
                    <DialogDescription className="text-center text-white">
                        Are you sure you want to change the order status to{' '}
                        <strong>{newStatus}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-primary-black-60">
                            Tracking Number (optional)
                        </label>
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="mt-1 w-full p-2 bg-primary-black-80 border border-primary-black-60 rounded text-black"
                            placeholder="Enter the tracking number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary-black-60">
                            Private Note (optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mt-1 w-full p-2 bg-primary-black-80 border border-primary-black-60 rounded text-black"
                            placeholder="Enter a private note (optional)"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-4 mt-6">
                    <Button
                        variant="outline"
                        className="w-[200px] h-[52px] rounded-[53px] hover:border-none border-primary-purple-90 text-primary-purple-90 hover:bg-red-600"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-primary-purple-90 rounded-[53px] hover:border-none w-[200px] h-[52px] hover:bg-primary-green-900"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
