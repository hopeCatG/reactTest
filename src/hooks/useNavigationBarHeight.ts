import Taro from '@tarojs/taro'

export function getNavigationBarHeight() {
  // 获取系统信息
  const systemInfo = Taro.getSystemInfoSync()
  
  // 获取菜单按钮（胶囊按钮）的位置信息
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
  
  // 状态栏高度
  const statusBarHeight = systemInfo.statusBarHeight || 0
  
  // 胶囊按钮距离顶部的距离
  const menuButtonTop = menuButtonInfo.top
  
  // 导航栏总高度 = 状态栏高度 + (胶囊按钮到状态栏的距离 * 2) + 胶囊按钮高度
  const navBarHeight = statusBarHeight + (menuButtonTop - statusBarHeight) * 2 + menuButtonInfo.height
  
  return {
    statusBarHeight,      // 状态栏高度
    menuButtonInfo,       // 胶囊按钮信息
    navBarHeight,         // 导航栏总高度（状态栏 + 导航栏）
    navBarContentHeight: navBarHeight - statusBarHeight, // 导航栏内容高度（不含状态栏）
    paddingTop: navBarHeight // 页面内容上边距
  }
}