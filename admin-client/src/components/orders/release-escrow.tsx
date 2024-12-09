import { useStore } from '@tanstack/react-store';
import { orderEscrowStore, closeOrderEscrowDialog } from '@/stores/order-escrow/order-escrow-store.ts';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ShieldQuestion } from 'lucide-react';
import { releaseOrderEscrow } from '@/utils/order-escrow.ts';

export function ReleaseEscrow() {
    const { isOpen, orderId } = useStore(orderEscrowStore);

    if (!isOpen || !orderId) return null;

    return (
        <Dialog open={isOpen} onOpenChange={closeOrderEscrowDialog} >
            <DialogContent  className="sm:max-w-[448.97px] bg-primary-black-90 text-white m-['40px'] [&>button]:hidden">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <ShieldQuestion size={64} className="text-primary-green-900" />
                    </div>
                    <DialogTitle className='text-center pb-[32px]'>Confirm Refund Request</DialogTitle>
                    <DialogDescription className='text-center text-white'>
                        Are you sure you want to request a refund for order{' '}
                        <strong>{orderId}</strong>? Refund requests will be reviewed based
                        on our refund policy.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex text-white pt-[32px]">
                    <Button
                        className="w-[200px] h-[52px] rounded-[53px] border-primary-purple-90 text-primary-purple-90 hover:bg-red-600"
                        variant="outline" onClick={closeOrderEscrowDialog}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-primary-purple-90 rounded-[53px] w-[200px] h-[52px] hover:bg-primary-green-900"
                        onClick={() => {
                            console.log(`Refund requested for order ID: ${orderId}`);
                            releaseOrderEscrow(orderId);
                            closeOrderEscrowDialog();
                        }}
                    >
                        Confirm Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
