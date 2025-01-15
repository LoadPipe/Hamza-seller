import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from '@/components/ui/card.tsx';
export function TotalRefunds() {
    return (
        <Card className="bg-primary-black-90">
            <CardHeader>
                <CardTitle>Total Refunds</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="text-4xl font-bold">612</h3>
                <p className="text-green-500">↑ +44 this month</p>
            </CardContent>
        </Card>
    );
}
