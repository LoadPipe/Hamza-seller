// App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppSidebar } from '@/components/app-sidebar.tsx';
// Import your components
import { router } from './routes.tsx';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

// Initialize the Query Client
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex min-h-screen">
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

                <SidebarProvider>
                <AppSidebar /> {/* Sidebar Component */}
                <main className="flex-1 p-4">
                    <RouterProvider router={router}>
                        <TanStackRouterDevtools initialIsOpen={false} />
                        <SidebarTrigger />
                    </RouterProvider>
                </main>
                </SidebarProvider>
                </ThemeProvider>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
