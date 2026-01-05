import { View, Text } from '@tarojs/components'
import { Button } from '@tarojs/components'
import useUserStore from '../../stores/user-store'
import Taro from '@tarojs/taro'

export default function UserSet() {

    const { logout } = useUserStore()

    const logoutUser = () => {
        logout()
        Taro.switchTab({ url: '/pages/index/index' })
    }

  return (
    <View className='user-set'>
      <Text>用户设置</Text>
      <Button onClick={logoutUser} > 退出登录 </Button>
    </View>
  )
}