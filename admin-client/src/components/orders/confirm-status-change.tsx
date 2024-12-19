import React from 'react';
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

interface ConfirmStatusChangeProps {
    isOpen: boolean;
    newStatus: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmStatusChange({
    isOpen,
    newStatus,
    onConfirm,
    onCancel,
}: ConfirmStatusChangeProps) {
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
                <DialogFooter className="flex text-white pt-[32px]">
                    <Button
                        variant="outline"
                        className="w-[200px] h-[52px] rounded-[53px] hover:border-none border-primary-purple-90 text-primary-purple-90 hover:bg-red-600"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-primary-purple-90 rounded-[53px] hover:border-none w-[200px] h-[52px] hover:bg-primary-green-900"
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
