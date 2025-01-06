import { Select } from '@/components/ui/select';

export function OrderOverview() {
    return (
        <div className="bg-[#1A1A1A] p-4 rounded-lg shadow-md text-white">
            <h2 className="text-lg font-medium">Order Overview</h2>
            <p className="text-4xl font-bold mt-2">112</p>
            <Select defaultValue="Completed">
                {/*<Select.Item value="Completed">Completed</Select.Item>*/}
                {/*<Select.Item value="Pending">Pending</Select.Item>*/}
            </Select>
            <p className="text-sm text-green-500 mt-2">
                ↑ +32 orders were completed
            </p>
        </div>
    );
}
