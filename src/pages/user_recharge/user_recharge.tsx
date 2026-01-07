import { View, Input, Button } from '@tarojs/components'
import { rechargeConfig, recharge } from '../../api/recharge'
import { getPayWay, prepay, getPayResult } from '../../api/pay'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'

import './user_recharge.scss'

export default function UserRecharge() {


    const [rechargeConfigData, setRechargeConfigData] = useState<any>({})
    const getRechargeConfig = async () => {
        const { data } = await rechargeConfig()
        setRechargeConfigData(data)
        setWallet({
            ...wallet,
            min_amount: data.min_amount
        })
    }
    useLoad(() => {
        getRechargeConfig()
    })


    const [wallet, setWallet] = useState<any>({
        user_money: '',
        min_amount: 0
    })
    const rechargeLock = async (e: any) => {
        console.log(Number(wallet.user_money))
        if (Number(wallet.user_money) < wallet.min_amount) {
            Taro.showToast({
                title: '充值金额不能小于' + wallet.min_amount + '积分',
                icon: 'none'
            })
            return
        }

        if (Number(wallet.user_money) == 0) {
            Taro.showToast({
                title: '请输入充值金额',
                icon: 'none'
            })
            return
        }

        const { data } = await recharge({
            money: Number(wallet.user_money),
            order_type: 1,
            play_type: 1,
            title: '充值积分'
        })

        const prepayData = await prepay({
            from: data.from,
            order_id: data.order_id,
            pay_way: 2, // 微信支付
            redirect: "/packages/pages/recharge/recharge"
        })

        console.log(prepayData)

        await Taro.requestPayment({
            ...prepayData.data.config,
            success() {
                Taro.showToast({ title: '支付成功', icon: 'success' })
            },
            fail(err) {
                console.error(err)
                Taro.showToast({ title: '支付取消', icon: 'none' })
            }

        })
    }


    return (
        <View className='page-container'>
            <View className='recharge-content'>
                <View className='recharge-content-title'>
                    充值积分
                </View>
                <View className='recharge-content-input'>
                    <Input placeholder='0.00' type='digit' value={wallet.user_money} onInput={(e: any) => {
                        setWallet({
                            ...wallet,
                            user_money: e.detail.value
                        })
                    }} />
                </View>
                <View className='recharge-content-desc'>
                    当前可用余额: {rechargeConfigData?.user_money || 0} 积分
                </View>
            </View>

            <Button className='recharge-content-btn' onClick={rechargeLock}>
                立即充值
            </Button>
        </View>
    )
}