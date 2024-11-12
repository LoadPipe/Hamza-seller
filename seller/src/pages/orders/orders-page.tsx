import { Payment, columns } from "@/components/orders/columns";
import { DataTable } from "@/components/orders/data-table.tsx";
import { useQuery } from "@tanstack/react-query";

// Define the function that fetches the data
async function getData(): Promise<Payment[]> {
    // Replace this with actual API call
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "d4c8f25e",
            amount: 200,
            status: "processing",
            email: "test@domain.com",
        },
        {
            id: "c3b92f4a",
            amount: 300,
            status: "success",
            email: "user@provider.com",
        },
        {
            id: "ab6a9d12",
            amount: 400,
            status: "failed",
            email: "failed@error.com",
        },
    ];
}

// Define the OrdersPage component
export default function OrdersPage() {
    // Use TanStack Query to fetch data
    const { data, isLoading, error } = useQuery<Payment[], Error>({
        queryKey: ['payments'],
        queryFn: getData, // Function to fetch data
    });

    // Handle loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (error instanceof Error) {
        return <div>{error.message}</div>;
    }

    // Render the data table once data is loaded
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data ?? []} />
        </div>
    );
}
