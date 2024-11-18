// order-details-sidebar.tsx
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useStore } from '@tanstack/react-store'; // Import useStore to read the store state
import { orderSidebarStore, closeOrderSidebar } from '@/stores/order-sidebar/order-sidebar-store.ts';

export function OrderDetailsSidebar() {
    // Use the store to determine if the sidebar should be open
    const isSidebarOpen = useStore(orderSidebarStore, (state) => state.isSidebarOpen);

    // Conditionally render the sidebar only when it's open
    if (!isSidebarOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-80 z-50"> {/* Sidebar container */}
            <Sidebar side="right">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <button onClick={closeOrderSidebar}>Close Sidebar</button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {/* Additional content for the sidebar can go here */}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
