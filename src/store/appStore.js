import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Global loading
  isPageLoading: false,
  setPageLoading: (isPageLoading) => set({ isPageLoading }),

  // Mobile sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Admin panel mobile
  isAdminSidebarOpen: false,
  toggleAdminSidebar: () => set((state) => ({ isAdminSidebarOpen: !state.isAdminSidebarOpen })),

  // Search
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // Notification count
  notificationCount: 3,
  clearNotifications: () => set({ notificationCount: 0 }),
}))

export default useAppStore
