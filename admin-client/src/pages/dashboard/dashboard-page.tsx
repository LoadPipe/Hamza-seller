import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <h1 className="text-3xl font-bold">Overview</h1>

                {/* Order Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        'New Orders',
                        'Pending Orders',
                        'Confirmed Orders',
                        'Canceled Orders',
                    ].map((title) => (
                        <Card key={title}>
                            <CardContent className="text-center space-y-2">
                                <p className="text-4xl font-semibold">00</p>
                                <p>{title}</p>
                                <p className="text-sm text-muted-foreground">
                                    Engagement: 0%
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Revenue Report */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Revenue Report</CardTitle>
                            <div className="flex items-center space-x-4">
                                <Input type="date" className="w-auto" />
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usdc">
                                            USDC
                                        </SelectItem>
                                        <SelectItem value="eth">ETH</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-40">
                            <div className="text-center text-muted-foreground">
                                <p className="text-lg">No Data Available</p>
                                <p className="text-sm">
                                    Data will be displayed here once you start
                                    receiving orders or adding products.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                <strong>Your account is logged in</strong>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Account was logged in by one of your team
                                members: John Doe
                            </p>
                            <p className="text-xs text-muted-foreground">
                                5 mins ago
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Products</h2>
                        <div className="flex space-x-2">
                            <Button variant="ghost">Filter By</Button>
                            <Button variant="ghost">Sort By</Button>
                        </div>
                    </div>
                    <Card className="flex items-center justify-center h-32">
                        <CardContent className="text-center">
                            <p className="text-lg">Add your first product</p>
                            <p className="text-sm text-muted-foreground">
                                Add your first product to your store.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
