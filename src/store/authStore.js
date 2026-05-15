import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
          error: null,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      updateUser: (updates) => {
        const currentUser = get().user
        set({ user: { ...currentUser, ...updates } })
      },

      addStamp: () => {
        const currentUser = get().user
        if (currentUser) {
          const newStamps = (currentUser.stamps || 0) + 1
          set({ user: { ...currentUser, stamps: newStamps } })
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'barberos-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
