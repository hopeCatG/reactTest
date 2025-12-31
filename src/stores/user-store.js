import { create } from 'zustand'

// 1. 创建 store
const useUserStore = create((set) => ({
  userInfo: null,
  token: '',
  
  // Actions（更新状态的方法）
  login: (userData) => set({ 
    userInfo: userData,
    token: userData.token 
  }),
  
  logout: () => set({ 
    userInfo: null, 
    token: '' 
  }),
  
  updateAvatar: (avatarUrl) => 
    set((state) => ({
      userInfo: { ...state.userInfo, avatar: avatarUrl }
    })),
}));

export default useUserStore;