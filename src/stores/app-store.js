import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { getConfig } from '../api/app'

// 1. 创建 store
const useAppStore = create((set) => ({
    config: null, 
    getImageUrl:  (url) => {
        return url.indexOf('http') ? `${useAppStore.getState().config?.domain}${url}` : url;
    },
    // 获取配置
    getConfig: async () => {
        const res = await getConfig()
        if (res.code === 1) {
            set({
                config: res.data
            })
        }
    } 
}));

export default useAppStore;