import { View, Image, Text } from '@tarojs/components'
import { useState } from 'react'
import { useLoad } from '@tarojs/taro'
import { getNavigationBarHeight } from '../../hooks/useNavigationBarHeight'
import useUserStore from '../../stores/user-store'
import { getDecorate } from '../../api/app'
import useAppStore from '../../stores/app-store'
import Taro from '@tarojs/taro'
import './index.scss'
import defaultAvatar from '../../assets/images/user/default_avatar.png'

export default function User() {
    const { navBarHeight } = getNavigationBarHeight()
    const { userInfo, isLogin, getUserCenter } = useUserStore()
    const { getImageUrl } = useAppStore();
    const [decorate, setDecorate] = useState([]) as any[]


    const getDecorateFun = async () => {
        const res = await getDecorate({ id: 2 })
        if (res.code === 1) {
            let data = JSON.parse(res.data.data);
            console.log(data[1].content.data)
            setDecorate(data[1].content.data)
        }
    }

    const goWhere = (path: string) => {
        if (path == '/packages/pages/user_wallet/user_wallet') {
            path = '/pages/user_wallet/user_wallet'
        }
        Taro.navigateTo({ url: path })
    }

    useLoad(() => {
        console.log('User Page loaded.')
        getUserCenter()
        getDecorateFun();
    })

    return (
        <View className='user-page'>
            {/* 顶部区域 */}
            <View className='header-section'>
                {/* 背景图 */}
                {/* <Image className='bg-image' src={bgImage} mode='aspectFill' /> */}
                <View className='user-info-box' style={{ marginTop: navBarHeight }}>
                    <View className='left-info' onClick={() => { isLogin() ? '' : Taro.navigateTo({ url: '/pages/login/index' }) }}>
                        <Image
                            className='avatar'
                            src={userInfo?.avatar || defaultAvatar}
                            mode='aspectFill'
                        />
                        <View className='text-info'>
                            <Text className='nickname'>
                                {userInfo?.nickname || '未登录'}
                            </Text>
                            {userInfo?.account && (
                                <Text className='account'>账号：{userInfo.account}</Text>
                            )}
                        </View>
                    </View>

                    <View className='setting-btn'>
                        {
                            isLogin() ? <Text className='iconfont icon-shezhi' onClick={() => Taro.navigateTo({ url: '/pages/user_set/user_set' })}></Text> : ''
                        }
                    </View>
                </View>
            </View>

            {/* 服务卡片 */}
            <View className='service-card'>
                <View className='card-title'>我的服务</View>
                <View className='service-list'>
                    {decorate.map(item => (
                        <View className='service-item' key={item.image} onClick={() => goWhere(item.link.path)}>
                            <View className='item-left'>
                                <Image className='item-icon' src={getImageUrl(item.image)} mode='aspectFit' />
                                <Text className='item-text'>{item.name}</Text>
                            </View>
                            {/* 右箭头，这里用 > 符号代替或者用图标 */}
                            <Text className='arrow-icon' style={{ fontSize: '20px', color: '#999' }}>{'>'}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}
