import { View } from '@tarojs/components'
import { useState } from 'react'
import { useLoad } from '@tarojs/taro'
import './user_wallet.scss'
import { rechargeConfig } from '../../api/recharge'

export default function UserWallet() {
    const [rechargeConfigData, setRechargeConfigData] = useState<any>({})
    const getRechargeConfig = async () => {
        const { data } = await rechargeConfig()
        setRechargeConfigData(data)
    }

    useLoad(() => {
        getRechargeConfig()
    })

    return (
        <View className='page-container'>
            <view className="user-wallet">
                <view className="wallet-title">
                    积分余额
                </view>
                <view className="wallet-balance">
                    {(parseFloat(rechargeConfigData?.user_money || 0).toFixed(2))}
                </view>
                {/* 去充值按钮 */}
                <view className="wallet-recharge-btn">
                    去充值
                </view>
            </view>
        </View>
    )
}