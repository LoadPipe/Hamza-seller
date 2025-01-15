import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function AverageOrderValue() {
    return (
        <Card className="bg-primary-black-90">
            <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="text-4xl font-bold">$32</h3>
                <p className="text-blue-500">Average revenue per order</p>
            </CardContent>
        </Card>
    );
}
