import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
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
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';
import { getJwtStoreId } from '@/utils/authentication';
import { getSecure } from '@/utils/api-calls.ts';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { useCallback, useEffect } from 'react';

async function getDashboardData(store_id: string, wallet_address: string) {
    try {
        const dashboardDTO = await getSecure('/seller/dashboard', {
            store_id: store_id,
            wallet_address: wallet_address,
        });
        console.log(`$$$${dashboardDTO}`);
        return dashboardDTO;
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // throw new Error('Failed to fetch dashboard info');
    }
}

export default function DashboardPage() {
    const { toast } = useToast();
    const userData = useCustomerAuthStore();
    const isAuthenticated = userData.authData.status === 'authenticated';
    const hasLoggedIn = useCustomerAuthStore((state) => state.hasLoggedIn);
    const setHasLoggedIn = useCustomerAuthStore(
        (state) => state.setHasLoggedIn
    );
    const showWelcomeToast = useCallback(() => {
        toast({
            title: 'Welcome!',
            description: 'You have successfully logged in.',
        });
    }, [toast]);

    useEffect(() => {
        if (isAuthenticated && !hasLoggedIn) {
            // console.log('RUN TOAST');
            showWelcomeToast();
            setHasLoggedIn(true); // Mark as logged in
        }
    }, [isAuthenticated, hasLoggedIn, setHasLoggedIn, showWelcomeToast]);

    const { data, isLoading, error } = useQuery<{
        name: string;
        newOrders: number;
        pendingOrders: number;
        confirmedOrders: number;
        canceledOrders: number;
    }>({
        queryKey: [
            'dashboard',
            {
                store_id: getJwtStoreId(),
                wallet_address: userData.authData.wallet_address,
            },
        ],
        queryFn: () =>
            getDashboardData(getJwtStoreId(), userData.authData.wallet_address),
    });

    if (error) {
        useEffect(() => {
            toast({
                title: 'Dashboard Data Not Loading',
                description: 'Please refresh the page.',
                variant: 'destructive',
                duration: 5000,
            });
        }, [error]);
    }
    const lineChartData = [
        { name: 'Jan', revenue: 400 },
        { name: 'Feb', revenue: 600 },
        { name: 'Mar', revenue: 800 },
        { name: 'Apr', revenue: 500 },
        { name: 'May', revenue: 700 },
        { name: 'Jun', revenue: 900 },
    ];

    const totalOrders =
        (data?.newOrders || 0) +
        (data?.pendingOrders || 0) +
        (data?.confirmedOrders || 0) +
        (data?.canceledOrders || 0);

    const pieChartData =
        totalOrders > 0
            ? [
                  {
                      name: 'New Orders',
                      value: data?.newOrders || 0,
                      percentage: (data?.newOrders || 0) / totalOrders,
                  },
                  {
                      name: 'Pending Orders',
                      value: data?.pendingOrders || 0,
                      percentage: (data?.pendingOrders || 0) / totalOrders,
                  },
                  {
                      name: 'Confirmed Orders',
                      value: data?.confirmedOrders || 0,
                      percentage: (data?.confirmedOrders || 0) / totalOrders,
                  },
                  {
                      name: 'Canceled Orders',
                      value: data?.canceledOrders || 0,
                      percentage: (data?.canceledOrders || 0) / totalOrders,
                  },
              ]
            : [{ name: 'No Data', value: 1, percentage: 1 }];

    const COLOR_MAP = {
        'New Orders': { active: '#94D42A', inactive: '#d3d3d3' },
        'Pending Orders': { active: '#F4A261', inactive: '#d3d3d3' },
        'Confirmed Orders': { active: '#2A9D8F', inactive: '#d3d3d3' },
        'Canceled Orders': { active: '#E76F51', inactive: '#d3d3d3' },
    };

    const barChartData = [
        { name: 'Jan', logins: 5 },
        { name: 'Feb', logins: 8 },
        { name: 'Mar', logins: 10 },
        { name: 'Apr', logins: 7 },
        { name: 'May', logins: 12 },
        { name: 'Jun', logins: 9 },
    ];

    const { preferred_currency_code, setCustomerPreferredCurrency } =
        useCustomerAuthStore();

    const handleCurrencyChange = (value: string) => {
        setCustomerPreferredCurrency(value); // Update the store
        console.log(`Preferred Currency updated to: ${value}`); // Log for debugging
    };

    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header
                 * We can have the following in the header section.;
                 * preferred Currency - for now were just connecting to the tanstack store.
                 * The following can be one api call form customer address info.
                 * Name
                 * Email
                 * Profile Photo
                 */}
                <motion.h1
                    className="text-3xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isLoading
                        ? 'Loading...'
                        : `Welcome back, ${data?.name || 'User'}!`}
                </motion.h1>

                <div className="flex justify-end items-center space-x-2">
                    <label
                        htmlFor="preferredCurrency"
                        className="text-white text-sm"
                    >
                        Select Preferred Currency:
                    </label>
                    <Select
                        id="preferredCurrency"
                        onValueChange={handleCurrencyChange} // Sync to Zustand store
                        defaultValue={preferred_currency_code || 'eth'} // Set default from store
                    >
                        <SelectTrigger className="w-48 border-2 border-primary-purple-90 rounded-md animate-pulse-limited">
                            <SelectValue placeholder="Select Currency">
                                {preferred_currency_code?.toUpperCase() ||
                                    'ETH'}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="eth">ETH</SelectItem>
                            <SelectItem value="usdc">USDC</SelectItem>
                            <SelectItem value="usdt">USDT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <h1 className="text-3xl font-bold">Overview</h1>

                {/* Order Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'New Orders', value: data?.newOrders || 0 },
                        {
                            title: 'Pending Orders',
                            value: data?.pendingOrders || 0,
                        },
                        {
                            title: 'Confirmed Orders',
                            value: data?.confirmedOrders || 0,
                        },
                        {
                            title: 'Canceled Orders',
                            value: data?.canceledOrders || 0,
                        },
                    ].map(({ title, value }, index) => (
                        <Card key={title} className="bg-primary-black-90">
                            <CardContent className="text-center space-y-4">
                                <ResponsiveContainer width="100%" height={120}>
                                    <PieChart>
                                        {pieChartData.map((entry, i) => {
                                            const activeColor =
                                                COLOR_MAP[entry.name]?.active ||
                                                '#d3d3d3';
                                            const inactiveColor =
                                                COLOR_MAP[entry.name]
                                                    ?.inactive || '#d3d3d3';

                                            return (
                                                <Pie
                                                    key={`pie-${i}`}
                                                    data={[
                                                        {
                                                            name: entry.name,
                                                            value:
                                                                entry.percentage *
                                                                100,
                                                        },
                                                        {
                                                            name: 'Remaining',
                                                            value:
                                                                100 -
                                                                entry.percentage *
                                                                    100,
                                                        },
                                                    ]}
                                                    dataKey="value"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={50}
                                                    paddingAngle={5}
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    <Cell
                                                        key={`cell-active-${i}`}
                                                        fill={activeColor}
                                                    />
                                                    <Cell
                                                        key={`cell-inactive-${i}`}
                                                        fill={inactiveColor}
                                                    />
                                                </Pie>
                                            );
                                        })}
                                    </PieChart>
                                </ResponsiveContainer>
                                <p className="text-4xl font-semibold">
                                    {value}
                                </p>
                                <p>{title}</p>
                                <p className="text-sm text-muted-foreground">
                                    Engagement:{' '}
                                    {(
                                        (value /
                                            (data?.newOrders +
                                                data?.pendingOrders +
                                                data?.confirmedOrders +
                                                data?.canceledOrders)) *
                                            100 || 0
                                    ).toFixed(1)}
                                    %
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Revenue Report */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <Card className="lg:col-span-2 bg-primary-black-90">
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
                    <Card className="bg-primary-black-90">
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
                    <Card className="flex items-center justify-center h-32 bg-primary-black-90">
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
