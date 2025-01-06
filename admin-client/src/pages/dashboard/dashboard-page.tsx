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
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
    // Dummy data for charts
    const lineChartData = [
        { name: 'Jan', revenue: 400 },
        { name: 'Feb', revenue: 600 },
        { name: 'Mar', revenue: 800 },
        { name: 'Apr', revenue: 500 },
        { name: 'May', revenue: 700 },
        { name: 'Jun', revenue: 900 },
    ];

    const pieChartData = [
        { name: 'New Orders', value: 0 },
        { name: 'Others', value: 100 },
    ];

    const barChartData = [
        { name: 'Jan', logins: 5 },
        { name: 'Feb', logins: 8 },
        { name: 'Mar', logins: 10 },
        { name: 'Apr', logins: 7 },
        { name: 'May', logins: 12 },
        { name: 'Jun', logins: 9 },
    ];

    const COLORS = ['#94D42A', '#242424']; // Colors for pie chart

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
                    ].map((title, index) => (
                        <Card key={title}>
                            <CardContent className="text-center space-y-4">
                                <ResponsiveContainer width="100%" height={120}>
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={50}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {pieChartData.map((entry, i) => (
                                                <Cell
                                                    key={`cell-${i}`}
                                                    fill={
                                                        COLORS[
                                                            i % COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
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
                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData}>
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#94D42A"
                                        strokeWidth={2}
                                    />
                                    <Tooltip />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Activity with Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData}>
                                    <XAxis dataKey="name" stroke="#ffffff" />
                                    <YAxis stroke="#ffffff" />
                                    <Tooltip />
                                    <Bar dataKey="logins" fill="#94D42A" />
                                </BarChart>
                            </ResponsiveContainer>
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
                                Add your first product to your store. Provide
                                detailed descriptions, high-quality images, and
                                accurate pricing to attract more customers.
                                Don’t forget to categorize your product for easy
                                discovery!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
