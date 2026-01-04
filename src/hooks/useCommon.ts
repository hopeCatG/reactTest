import Taro from '@tarojs/taro'

/**
 * 返回上一页
 * 如果跳转失败，则跳转至首页
 */
export function goBack() {
    Taro.navigateBack({
        delta: 1,
    }).catch(() => {
        Taro.navigateTo({
            url: '/pages/index/index',
        })
    })
}