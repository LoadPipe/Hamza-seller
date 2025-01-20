import { useState } from 'react';
import {
    Home,
    Settings,
    BarChart,
    Box,
    Wallet,
    Headset,
    MessageSquareText,
    Archive,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Home,
    },
    {
        title: 'Products',
        url: '/products',
        icon: Box,
        isDropdown: true,
        submenu: [
            { title: 'All Products', url: '/products' },
            { title: 'Add Product', url: '/add-product' },
            { title: 'Product Categories', url: '/product-category' },
        ],
    },
    {
        title: 'Orders',
        url: '/orders',
        icon: Archive,
    },
    {
        title: 'Wallet',
        url: '#',
        icon: Wallet,
    },
    {
        title: 'Messages',
        url: '#',
        icon: MessageSquareText,
    },
    {
        title: 'Analytics',
        url: '/analytics',
        icon: BarChart,
    },
    {
        title: 'Help Center',
        url: '#',
        icon: Headset,
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const toggleDropdown = (title: string) => {
        setExpandedItem(expandedItem === title ? null : title);
    };

    return (
        // <Sidebar side="left" className="w-navigation-sidebar">
        <Sidebar side="left">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="my-4">
                        <img
                            src="/Hamza-logo.svg"
                            alt="Logo"
                            width="106"
                            height="37"
                        />
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <div key={item.title}>
                                    <SidebarMenuItem>
                                        {item.isDropdown ? (
                                            <>
                                                <SidebarMenuButton
                                                    asChild
                                                    onClick={() =>
                                                        toggleDropdown(
                                                            item.title
                                                        )
                                                    }
                                                >
                                                    <a href="#">
                                                        <item.icon />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </a>
                                                </SidebarMenuButton>
                                                {expandedItem ===
                                                    item.title && (
                                                    <div className="pl-4">
                                                        <ul>
                                                            {item.submenu.map(
                                                                (
                                                                    submenuItem
                                                                ) => (
                                                                    <SidebarMenuItem
                                                                        key={
                                                                            submenuItem.title
                                                                        }
                                                                    >
                                                                        <SidebarMenuButton
                                                                            asChild
                                                                        >
                                                                            <a
                                                                                href={
                                                                                    submenuItem.url
                                                                                }
                                                                            >
                                                                                {
                                                                                    submenuItem.title
                                                                                }
                                                                            </a>
                                                                        </SidebarMenuButton>
                                                                    </SidebarMenuItem>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                </div>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
