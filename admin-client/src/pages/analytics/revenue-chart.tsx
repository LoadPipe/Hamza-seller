'use client';

import { TrendingUp } from 'lucide-react';
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
    { month: 'January', earnings: 186, expenses: 80 },
    { month: 'February', earnings: 305, expenses: 200 },
    { month: 'March', earnings: 237, expenses: 120 },
    { month: 'April', earnings: 73, expenses: 190 },
    { month: 'May', earnings: 209, expenses: 130 },
    { month: 'June', earnings: 214, expenses: 140 },
];

const chartConfig = {
    earnings: {
        label: 'Earnings',
        color: 'hsl(var(--chart-1))',
    },
    expenses: {
        label: 'Expenses',
        color: 'hsl(var(--chart-2))',
    },
};

export function RevenueChart() {
    return (
        <Card className="bg-primary-black-90">
            <CardHeader>
                <CardTitle>Revenue Report</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 16,
                            right: 32,
                            left: 0,
                            bottom: 0,
                        }}
                        width={700}
                        height={300}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <Tooltip
                            content={<ChartTooltipContent />}
                            cursor={{ strokeDasharray: '3 3' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="earnings"
                            stroke="var(--color-earnings)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="var(--color-expenses)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month{' '}
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Showing total earnings and expenses for the last 6
                            months
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
