import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
    expandedItem: string | null;
    toggleDropdown: (title: string) => void;
    resetDropdown: () => void;
}

const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            expandedItem: null, // Initially, no dropdown is expanded
            toggleDropdown: (title) =>
                set((state) => ({
                    expandedItem: state.expandedItem === title ? null : title,
                })),
            resetDropdown: () =>
                set(() => ({
                    expandedItem: null,
                })),
        }),
        {
            name: 'sidebar-store', // LocalStorage key for persistence
        }
    )
);

export default useSidebarStore;
