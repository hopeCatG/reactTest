export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/test/index',
    'pages/create/image/index',
    'pages/list/index',
    'pages/user/index',
    'pages/login/index',
    'pages/news/news',
    'pages/news_detail/news_detail',
    'pages/user_wallet/user_wallet',
    'pages/customer_service/customer_service',
    'pages/user_set/user_set',
    'pages/user_recharge/user_recharge',
  ], 
  permission: {
    "scope.userInfo": {
      "desc": "用于完善用户资料"
    } 
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  // TabBar 配置（与 UniApp 类似但语法不同）
  tabBar: {
    color: '#333333',           // 未选中字体颜色
    selectedColor: '#6FDCFD',   // 选中字体颜色
    backgroundColor: '#ffffff', // TabBar 背景色
    borderStyle: 'black',       // 上边框颜色
    // 位置：bottom（底部）或 top（顶部）
    position: 'bottom',
    // Tab 列表
    list: [
      {
        // ⚠️ 注意：Taro 中的路径不需要 "static/" 前缀
        iconPath: 'assets/images/tabbar/home.png',          // 未选中图标
        selectedIconPath: 'assets/images/tabbar/home_s.png', // 选中图标
        pagePath: 'pages/index/index',                      // 页面路径
        text: '首页'                                         // 文字
      },
      {
        iconPath: 'assets/images/tabbar/news.png',
        selectedIconPath: 'assets/images/tabbar/news_s.png',
        pagePath: 'pages/list/index',
        text: 'AI创作'
      },
      {
        iconPath: 'assets/images/tabbar/user.png',
        selectedIconPath: 'assets/images/tabbar/user_s.png',
        pagePath: 'pages/user/index',
        text: '我的'
      }
    ]
  }
})
