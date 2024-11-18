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
import { useStore } from '@tanstack/react-store';
import { orderSidebarStore, closeOrderSidebar } from '@/stores/order-sidebar/order-sidebar-store.ts';

export function OrderDetailsSidebar() {
    const isSidebarOpen = useStore(orderSidebarStore, (state) => state.isSidebarOpen);

    if (!isSidebarOpen) return null; // If the sidebar isn't open, do not render it

    return (
        <Sidebar side="right" isOpen={isSidebarOpen}>
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
    );
}
