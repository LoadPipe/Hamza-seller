import { OrderSchema, columns } from "@/components/orders/columns";
import { DataTable } from "@/components/orders/data-table.tsx";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { z } from 'zod';

type Order = z.infer<typeof OrderSchema>;

// Define the function to fetch seller orders using axios
async function getSellerOrders(): Promise<Order[]> {
    try {
        const response = await axios.post("http://localhost:9000/seller/order", {
            store_id: "store_01JCG0V7CDSB1QWV7111KJ1DDY",
            page: 0,
            count: 0,
            sort: { created_at: "ASC" },
            filter: { status: { eq: "pending" } },
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });

        // Ensure the response conforms to the Order schema
        const data = response.data;
        return OrderSchema.array().parse(data); // Validate using Zod
    } catch (error) {
        console.error("Failed to fetch seller orders:", error);
        throw new Error("Failed to fetch seller orders");
    }
}

// Define the OrdersPage component
export default function OrdersPage() {
    // Use TanStack Query to fetch data
    const { data, isLoading, error } = useQuery<typeof OrderSchema[], Error>({
        queryKey: ['orders'],
        queryFn: getSellerOrders, // Function to fetch data
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
