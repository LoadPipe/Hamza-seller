import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function OrderOverview() {
    return (
        <Card className="bg-primary-black-90">
            <CardHeader>
                <CardTitle>Order Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="text-4xl font-bold">112</h3>
                <p className="text-green-500">↑ +32 orders were completed</p>
            </CardContent>
        </Card>
    );
}
