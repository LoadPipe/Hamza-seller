import useSidebarStore from '@/stores/sidebar/sidebar-store';
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
import { useUserAuthStore } from '@/stores/authentication/user-auth.ts';

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
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
    const { authData } = useUserAuthStore();
    const isNewUser = authData?.isNewUser;
    const { expandedItem, toggleDropdown } = useSidebarStore();

    return (
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
                                                    onClick={(e) => {
                                                        if (isNewUser) {
                                                            e.preventDefault();
                                                            return;
                                                        }
                                                        toggleDropdown(
                                                            item.title
                                                        );
                                                    }}
                                                    className={
                                                        isNewUser
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : ''
                                                    }
                                                >
                                                    <a href="#">
                                                        <item.icon />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </a>
                                                </SidebarMenuButton>
                                                {expandedItem === item.title &&
                                                    !isNewUser && (
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
                                            <SidebarMenuButton
                                                asChild
                                                onClick={(e) => {
                                                    if (isNewUser) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className={
                                                    isNewUser
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : ''
                                                }
                                            >
                                                <a
                                                    href={
                                                        isNewUser
                                                            ? '#'
                                                            : item.url
                                                    }
                                                >
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
