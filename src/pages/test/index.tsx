import { View, Text, Button } from '@tarojs/components';
import { useState, useCallback } from 'react';
import { useLoad } from '@tarojs/taro'
import CounterButton from '../../components/CounterButton';

import useUserStore from '../../stores/user-store';

export default function Index() {
  // 父组件管理状态
  const [countA, setCountA] = useState(10);
  const [countB, setCountB] = useState(20);
  // const [param, setParam] = useState({
  //   page: 1,
  //   pageSize: 10
  // });
  const [isShow, setIsShow] = useState(true);
  const { userInfo, login } = useUserStore();

  const list = [
    { id: 1, name: '项目一' },
    { id: 2, name: '项目二' },
    { id: 3, name: '项目三' }
  ]

  const [newCount, setNewCount] = useState(0);
  const showCount = () => {
    console.log('Count:', newCount) // 闭包陷阱：count 永远是初始值
  } // 缺少 count 依赖

  // 增加 newCount
  const addNewcount = () => {
    setNewCount(newCount + 1)
    console.log('直接打印',newCount)
    showCount()
  }

  // ✅ 正确的依赖
  // const showCount = useCallback(() => {
  //   console.log('Count:', count)
  // }, [count])


  useLoad(() => {
    console.log('Page loaded.');
    console.log(userInfo);
  })

  // const handleParamChange = () => {
  //   setParam((e) => ({
  //     ...e, page: e.page + 1
  //   }))
  // }

  const upUserDate = () => {
    login({ name: '张三', age: 18 })
    console.log(userInfo);
  }

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

      <Button onClick={upUserDate}>更新用户信息</Button>
      <Text>用户信息：{JSON.stringify(userInfo)}</Text>

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

      <Button onClick={addNewcount}>useCallback</Button>
      <Text>newCount: {newCount}</Text>

    </View>
  );
}