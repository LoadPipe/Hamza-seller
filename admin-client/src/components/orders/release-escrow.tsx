import { useStore } from '@tanstack/react-store';
import {
    orderEscrowStore,
    closeOrderEscrowDialog,
} from '@/stores/order-escrow/order-escrow-store.ts';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Rocket } from 'lucide-react';
import {
    getEscrowPayment,
    releaseEscrowPayment,
} from '@/utils/order-escrow.ts';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { validateSeller } from '@/utils/validation-functions/validate-seller';

export function ReleaseEscrow() {
    const { isOpen, order } = useStore(orderEscrowStore);
    const { toast } = useToast();

    const releaseEscrowMutation = useMutation({
        mutationFn: async (order: any) => {
            // Escrow release logic
            await releaseEscrowPayment(order);
        },
        onSuccess: () => {
            toast({
                variant: 'default',
                title: 'Success!',
                description: 'The escrow has been successfully released.',
            });
        },
        onError: (error: any) => {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description:
                    error?.response?.data?.message ||
                    'Failed to release the escrow. Please try again.',
            });
        },
    });

    const handleConfirm = async () => {
        const payment = await getEscrowPayment(order);
        const isValid = await validateSeller(payment, toast);
        closeOrderEscrowDialog();
        if (isValid) {
            releaseEscrowMutation.mutate(order);
        }
    };

    if (!isOpen || !order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={closeOrderEscrowDialog}>
            <DialogContent className="sm:max-w-[448.97px] bg-primary-black-90 text-white m-['40px'] [&>button]:hidden border-primary-purple-90">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <Rocket
                            size={64}
                            className="text-primary-green-900 animate-pulse"
                        />
                    </div>
                    <DialogTitle className="text-center pb-[32px]">
                        Release Escrow
                    </DialogTitle>
                    <DialogDescription className="text-center text-white">
                        Are you sure you want to release escrow for order{' '}
                        <strong>{order.id}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex text-white pt-[32px]">
                    <Button
                        className="w-[200px] h-[52px] rounded-[53px] hover:border-none border-primary-purple-90 text-primary-purple-90 hover:bg-red-600"
                        variant="outline"
                        onClick={closeOrderEscrowDialog}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-primary-purple-90 rounded-[53px] hover:border-none w-[200px] h-[52px] hover:bg-primary-green-900"
                        onClick={handleConfirm}
                    >
                        Confirm Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
