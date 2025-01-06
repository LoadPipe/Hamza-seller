import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LineChart, BarChart, Legend, Tooltip } from 'recharts';
import { RevenueChart } from '@/pages/analytics/revenue-chart.tsx';
import { TotalOrders } from '@/pages/analytics/total-orders.tsx';
import { TotalRefunds } from '@/pages/analytics/total-refunds.tsx';
import { OrderOverview } from '@/pages/analytics/order-overview.tsx';
import { AverageOrderValue } from '@/pages/analytics/average-order-value.tsx';
import { TopProducts } from '@/pages/analytics/top-products.tsx';

export default function AnalyticsPage() {
    // Dummy data

    const countrySales = [
        { country: 'China', unitsSold: 2800 },
        { country: 'Philippines', unitsSold: 2700 },
        { country: 'Thailand', unitsSold: 2600 },
        { country: 'Malaysia', unitsSold: 2500 },
    ];

    const trafficSource = [
        { source: 'Organic Search', percentage: 32 },
        { source: 'Paid Search', percentage: 31 },
        { source: 'Social Media', percentage: 24 },
        { source: 'Others', percentage: 13 },
    ];

    return (
        <div className="bg-black text-white px-8 py-12">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="This month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">This month</SelectItem>
                            <SelectItem value="week">This week</SelectItem>
                            <SelectItem value="day">Today</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Card className="bg-primary-black-90">
                        <CardHeader>
                            <CardTitle>Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h2 className="text-xl font-bold">$1,311,034.73</h2>
                            <p className="text-green-500">
                                + $4,245.45 this month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-black-90">
                        <CardHeader>
                            <CardTitle>Net Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h2 className="text-xl font-bold">$912,034.73</h2>
                            <p className="text-green-500">
                                + $4,245.45 this month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-black-90">
                        <CardHeader>
                            <CardTitle>Total Store Visitors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h2 className="text-xl font-bold">320</h2>
                            <p className="text-green-500">
                                + 80 visitors this month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-black-90">
                        <CardHeader>
                            <CardTitle>Total Conversion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h2 className="text-xl font-bold">72%</h2>
                            <p className="text-red-500">- 12% this month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Report */}
                <Card className="bg-primary-black-90">
                    <CardHeader>
                        <CardTitle>Revenue Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Jan - Jun 2024" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="jan-jun">
                                        Jan - Jun 2024
                                    </SelectItem>
                                    <SelectItem value="jul-dec">
                                        Jul - Dec 2024
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="By Product Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="product-category">
                                        By Product Category
                                    </SelectItem>
                                    <SelectItem value="region">
                                        By Region
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="USD" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usd">USD</SelectItem>
                                    <SelectItem value="eur">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <RevenueChart />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Sales by Country */}
                    <Card className="bg-primary-black-90">
                        <CardHeader>
                            <CardTitle>Sales by Country</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {countrySales.map((data, index) => (
                                <div key={index} className="mb-4">
                                    <span className="block mb-1">
                                        {data.country}
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <Progress
                                            value={
                                                (data.unitsSold / 3000) * 100
                                            }
                                            className="flex-grow"
                                        />
                                        <span className="w-12 text-right">
                                            {data.unitsSold}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Traffic Source */}
                    <Card className="bg-primary-black-90">
                        <CardHeader>
                            <CardTitle>Traffic Source</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {trafficSource.map((data, index) => (
                                <div key={index} className="mb-4">
                                    <span className="block mb-1">
                                        {data.source}
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <Progress
                                            value={data.percentage}
                                            className="flex-grow"
                                        />
                                        <span className="w-12 text-right">
                                            {data.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <TotalOrders />
                    <TotalRefunds />
                    <OrderOverview />
                    <AverageOrderValue />
                    <TopProducts />
                </div>
            </div>
        </div>
    );
}
