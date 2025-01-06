import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from '@/components/ui/card.tsx';

export function TotalOrders() {
    return (
        <Card className="bg-primary-black-90">
            <CardHeader>
                <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="text-4xl font-bold">612</h3>
                <p className="text-red-500">↓ -23 this month</p>
            </CardContent>
        </Card>
    );
}
