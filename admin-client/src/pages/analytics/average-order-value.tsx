import { Select } from '@/components/ui/select';

export function AverageOrderValue() {
    return (
        <div className="bg-[#1A1A1A] p-4 rounded-lg shadow-md text-white">
            <h2 className="text-lg font-medium">Average Order Value</h2>
            <p className="text-4xl font-bold mt-2">$32</p>
            <Select defaultValue="USD">
                {/*<Select.Item value="USD">USD</Select.Item>*/}
                {/*<Select.Item value="EUR">EUR</Select.Item>*/}
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
                Average revenue per order
            </p>
        </div>
    );
}
