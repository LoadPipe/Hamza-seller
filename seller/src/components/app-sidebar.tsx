import { useState } from "react"
import { Home, Settings, BarChart, Box, Wallet, Headset, MessageSquareText, Archive } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: Home,
    },
    {
        title: "Products",
        url: "#",
        icon: Box,
        isDropdown: true,
        submenu: [
            { title: "All Products", url: "#all-products" },
            { title: "Add Product", url: "#add-product" },
            { title: "Product Categories", url: "#categories" },
        ],
    },
    {
        title: "Orders",
        url: "#",
        icon: Archive,
    },
    {
        title: "Wallet",
        url: "#",
        icon: Wallet,
    },
    {
        title: "Messages",
        url: "#",
        icon: MessageSquareText,
    },
    {
        title: "Analytics",
        url: "#",
        icon: BarChart,
    },
    {
        title: "Help Center",
        url: "#",
        icon: Headset,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    const [expanded, setExpanded] = useState<boolean>(false)

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="my-4">
                        <img src="/Hamza-logo.svg" alt="Logo" width="106" height="37" />

                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {/* Main Menu Item */}
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>

                                    {/* Dropdown for Products */}
                                    {item.isDropdown && (
                                        <div>
                                            <SidebarMenuButton
                                                asChild
                                                onClick={() => setExpanded(!expanded)}
                                            >
                                                <a href="#">
                                                    <item.icon />
                                                    <span>Products</span>
                                                </a>
                                            </SidebarMenuButton>

                                            {/* Render Submenu */}
                                            {expanded && (
                                                <div className="pl-4">
                                                    {item.submenu?.map((submenuItem) => (
                                                        <SidebarMenuItem key={submenuItem.title}>
                                                            <SidebarMenuButton asChild>
                                                                <a href={submenuItem.url}>
                                                                    <span>{submenuItem.title}</span>
                                                                </a>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
