import { View } from '@tarojs/components'
import { useState, useCallback } from 'react'
import { useLoad, useReachBottom } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './user_wallet.scss'
import { rechargeConfig, accountLog } from '../../api/recharge'
import Tabs from '../../components/Tabs'

export default function UserWallet() {
    const [rechargeConfigData, setRechargeConfigData] = useState<any>({})

    const getRechargeConfig = async () => {
        const { data } = await rechargeConfig()
        setRechargeConfigData(data)
    }

    const [lists, setLists] = useState<any>([])
    const [params, setParams] = useState({
        action: '' as any,
        type: 'um',
        page_no: 1,
        page_size: 16
    })
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const getAccountLogData = useCallback(
        async (index: number, pageNo: number, isLoadMore = false) => {
            if (loading || (isLoadMore && !hasMore)) return

            setLoading(true)

            const requestParams = {
                ...params,
                action: tabList[index]?.type || '',
                page_no: pageNo
            }

            const { data } = await accountLog(requestParams)

            if (isLoadMore) {
                setLists(prev => [...prev, ...(data.lists || [])])
            } else {
                setLists(data.lists || [])
            }

            if (data.lists.length < params.page_size) {
                setHasMore(false)
            } else {
                setParams(prev => ({ ...prev, page_no: pageNo + 1 }))
            }

            setLoading(false)
        },
        [loading, hasMore, params]
    )


    const changeTab = useCallback((index: number) => {
        setParams(prev => ({
            ...prev,
            page_no: 1,
            action: tabList[index]?.type || ''
        }))
        setHasMore(true)
        setLists([])

        getAccountLogData(index, 1)
    }, [getAccountLogData])


    useLoad(() => {
        getRechargeConfig()
        getAccountLogData(0, params.page_no)
    })

    const tabList = [
        {
            name: '全部',
            type: ''
        },
        {
            name: '收入',
            type: 1
        },
        {
            name: '支出',
            type: 2
        }
    ]

    useReachBottom(() => {
        console.log('reach bottom') 
        getAccountLogData(0, params.page_no, true)
    })

    return (
        <View className='page-container'>
            <View className="user-wallet-container">
                <View className="user-wallet">
                    <View className="wallet-title">
                        积分余额
                    </View>
                    <View className="wallet-balance">
                        {(parseFloat(rechargeConfigData?.user_money || 0).toFixed(2))}
                    </View>
                    {/* 去充值按钮 */}
                    <View className="wallet-recharge-btn" onClick={() => {
                        Taro.navigateTo({
                            url: '/pages/user_recharge/user_recharge'
                        })
                    }}>
                        去充值
                    </View>
                </View>
            </View>
            <View className="wallet-tabs">
                <Tabs list={tabList} onChange={(e: any) => { changeTab(e) }} />
            </View>

            <View className="wallet-log">
                {
                    lists.map((item: any, index: number) => (
                        <View className="log-item flex-init-sb" key={index + 'accountLog'}>
                            <View className="log-item-left">
                                <View className="log-item-title">
                                    {item.remark}
                                </View>
                                <View className="log-item-date">
                                    {item.create_time}
                                </View>
                            </View>
                            <View className="log-item-right">
                                <View className="log-item-amount">
                                    {item.change_amount_desc}
                                </View>
                            </View>

                        </View>
                    ))
                }
                {/* 加载更多提示 */}
                {loading && (
                    <View className="loading-more">加载中...</View>
                )}
                {!hasMore && lists.length > 0 && (
                    <View className="no-more">没有更多了</View>
                )}
            </View>
        </View>
    )
}