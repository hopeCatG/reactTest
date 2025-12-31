taro文档链接
核心概念转换：Vue 到 React/Taro
概念	在 Vue 中的体现	在 Taro/React 中的体现
模板 & 渲染	template
 模板语法，v-
 指令。	JSX：在 JavaScript 中直接编写类似 HTML 的结构
组件定义	单文件组件 (.vue
)，包含 template
, script
, style	函数组件：一个返回 JSX 的 JavaScript 函数
。类组件：继承 Component
 的类
状态管理	data()
 返回响应式对象，通过 this
 访问/修改。	useState
 Hook：const [state, setState] = useState(initialValue)
，通过 setState
生命周期	created
, mounted
, updated
 等选项。	useEffect
 Hook：处理副作用（数据请求、事件监听），依赖项数组控制执行时机
类组件中则有 componentDidMount等方法
事件绑定	v-on:click
 或 @click="handler"	以 on
 开头的属性，如 onClick={handleClick}
样式	style
 标签，支持 scoped
。	独立的 CSS/SCSS
 文件，通过 className
 引用
。Taro 的 px
 单位在编译时会转换为小程序 rpx
useState数据双向绑定
import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react';
import './index.scss'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
    setNum(1001);
    console.log(num)

  })

  const [num, setNum] = useState(100);
  const btnRef = useRef(null) as any;
  const addNum = () => {
    setNum(num + 1);
    console.log(num)
    console.log('dom对象：',btnRef.current)
  }

  // 对象
  const [param, setParam] = useState({
    page: 1,
    pageSize: 10
  });
  const handleParamChange = () => {
    setParam((e) => ({
      ...e, page: e.page + 1
    }))
  }

  return (
    <View className='index'>
      <Text>Hello world! {num}</Text>
      <Button ref={btnRef} onClick={addNum}>add 双向绑定</Button >
    </View>
  )
}

 react中的v-if和v-for
v-if/v-for 对应 JSX 中的 &&、map；
import { View, Text, Button } from '@tarojs/components';
import { useState } from 'react';



export default function Index() {

  const [isShow, setIsShow] = useState(true);


  const list = [
    { id: 1, name: '项目一' },
    { id: 2, name: '项目二' },
    { id: 3, name: '项目三' }
  ]

  return (
    <View className='index'>
    

      <view className='footer'>
        <Text>对于vue的v-if 和 v-for</Text>
      </view>
      <Button onClick={() => setIsShow(!isShow)}>切换显示/隐藏</Button>

      {isShow ?
        <Text>显示内容</Text> : <Text>隐藏内容</Text>}

        {isShow && <Text>显示内容2</Text>}


        {
          list.map(item => (
            <View key={item.id}>
              <Text>{item.name}</Text>
            </View>
          ))
        }


    </View>
  );
}
组件定义和props形式传参
1. 子组件：/components/CounterButton/index.jsx
jsx
import { Button, Text } from '@tarojs/components';
import './index.scss';

// 接收三个 props：初始值、变化步长、和自定义点击事件
export default function CounterButton({ initialValue = 0, step = 1, onChange }) {
  const handleClick = () => {
    // 调用父组件传来的函数，并传递新值回去
    if (onChange) {
      onChange(initialValue + step);
    }
  };

  return (
    <View className='counter-btn'>
      <Button type='primary' onClick={handleClick}>
    点我增加 {step}
  </Button>
    <Text className='value'>当前值：{initialValue}</Text>
    </View>
      );
}
2. 父组件：/pages/index/index.jsx
jsx
import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import CounterButton from '../../components/CounterButton';

export default function Index() {
  // 父组件管理状态
  const [countA, setCountA] = useState(10);
  const [countB, setCountB] = useState(20);
  
  return (
    <View className='index'>
      <Text>组件通信示例</Text>
      
      {/* 组件1：每次点击加1 */}
      <CounterButton 
        initialValue={countA}
        step={1}
        onChange={setCountA} // 直接传递 useState 的 setter 函数
      />
      
      {/* 组件2：每次点击加5，展示不同的配置 */}
      <CounterButton 
        initialValue={countB}
        step={5}
        onChange={setCountB}
      />
      
      <View className='summary'>
        <Text>总计：{countA + countB}</Text>
      </View>
    </View>
  );
}
状态管理库 zustand
1. 安装并创建 store
 npm install zustand
● zustand: ^5.0.8
● @tarojs/taro: 4.1.8
中编译小程序启动时也出现了该问题，在 config/dev.ts 中添加 debugReact: true 可以解决（注意修改了后需要重新运行才会生效）

// stores/user-store.js
import create from 'zustand';

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
2. 在组件中使用
// 任意组件中，无需包裹 Provider
import { View, Text } from '@tarojs/components';
import useUserStore from '../../stores/user-store';

export default function Header() {
  // 2. 直接使用，可按需选择状态片段
  const { userInfo, login, logout } = useUserStore();

  // 也可以单独订阅某个字段，减少重渲染
  const userName = useUserStore((state) => state.userInfo?.name);

  return (
    <View>
    <Text>{userName || '游客'}</Text>
  {/* ... */}
  </View>
);
}
	
Taro的生命周期
import { useLoad, useReady, useShow, useHide } from '@tarojs/taro'
生命周期	对应 Vue 钩子	用途	使用场景
useLoad	onLoad	页面加载时触发	页面级：获取页面参数、初始化数据
useReady	onReady	页面首次渲染完成时触发	操作页面 DOM（如获取元素尺寸）
useShow	onShow	页面显示/切入前台时触发	页面显示时刷新数据、监听事件
useHide	onHide	页面隐藏/切入后台时触发	清除定时器、暂停动画
usePullDownRefresh	onPullDownRefresh	监听用户下拉刷新	下拉刷新数据
useReachBottom	onReachBottom	监听用户上拉触底	加载更多（分页）
usePageScroll	onPageScroll	监听页面滚动	滚动时隐藏/显示元素
useResize	onResize	页面尺寸变化时触发	响应式布局调整
