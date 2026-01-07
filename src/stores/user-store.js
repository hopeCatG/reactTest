import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { getUserCenter } from '../api/user'

// 1. 创建 store
const useUserStore = create((set) => ({
  userInfo: null,
  token: Taro.getStorageSync('token') || '',
  login: (userData) => {
    Taro.setStorageSync('token', userData.token)
    set({
      userInfo: userData,
      token: userData.token
    })
  },
  getUserCenter: async () => {
    const res = await getUserCenter()
    set({
      userInfo: res.data 
    })
    if (!(res.data?.id) && Taro.getStorageSync('token')) { 
      Taro.showToast({ title: '登录过期，请重新登录', icon: 'none' });
      Taro.removeStorageSync('token')
    }
  },
  logout: () => {
    Taro.removeStorageSync('token')
    set({
      userInfo: null,
      token: ''
    })
  },
  isLogin: () => {
    return Taro.getStorageSync('token') != ''
  },
  updateAvatar: (avatarUrl) =>
    set((state) => ({
      userInfo: { ...state.userInfo, avatar: avatarUrl }
    })),
}));

export default useUserStore;