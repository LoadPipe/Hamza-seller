import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function TopProducts() {
    return (
        <Card className="bg-primary-black-90 lg:row-span-2">
            <CardHeader>
                <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[300px]">
                <ul className="space-y-2">
                    {[
                        { name: "Macbook Pro 14'' M3 Chip", sold: 4200 },
                        { name: "Macbook Pro 14'' M3 Chip", sold: 4100 },
                        { name: "Macbook Pro 14'' M3 Chip", sold: 4000 },
                        { name: "Macbook Pro 14'' M3 Chip", sold: 3900 },
                    ].map((product, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{product.name}</span>
                            <span>{product.sold}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
