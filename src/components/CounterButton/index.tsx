import { View,Button, Text } from '@tarojs/components';
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
        组件点我增加 {step}
      </Button>
      <Text className='value'>当前值：{initialValue}</Text>
    </View>
  );
}