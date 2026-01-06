import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import Taro, { useDidShow, useReachBottom, useDidHide ,useLoad} from '@tarojs/taro'
import WaterfallItem from '../../components/WaterfallItem'
import { getNavigationBarHeight } from '../../hooks/useNavigationBarHeight';

import { aiImgUserListApi, getImgInitApi } from '../../api/ai'
import './index.scss'

export default function AIListPage() {
    const { navBarHeight } = getNavigationBarHeight()

    // 状态管理
    const [imgList, setImgList] = useState([]) as any;
    const [columns, setColumns] = useState([[], []]) as any;
    const [loading, setLoading] = useState(false)
    const [noMore, setNoMore] = useState(false)

    // 请求参数
    const [param, setParam] = useState({
        page: 1,
        pageSize: 16,
        sort: 'desc'
    })

    // 轮询相关
    const pollingIds = useRef(new Set())
    const pollingInterval = useRef(null) as any;

    // 轮询处理
    const startPolling = useCallback(() => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
        }

        pollingInterval.current = setInterval(async () => {
            if (pollingIds.current.size === 0) {
                clearInterval(pollingInterval.current)
                pollingInterval.current = null
                return
            }

            const idsToPoll = Array.from(pollingIds.current)

            for (const id of idsToPoll) {
                try {
                    const { data } = await getImgInitApi({ id })
                    if (data?.result_url) {
                        // 更新图片URL
                        setImgList(prev =>
                            prev.map(img =>
                                img.id === id ? { ...img, result_url: data.result_url } : img
                            )
                        )
                        pollingIds.current.delete(id)
                    }
                } catch (err) {
                    console.error(`轮询图片ID ${id} 失败`, err)
                }
            }
        }, 2000)
    }, [])

    // 分割列（瀑布流布局）
    const splitColumns = useCallback((list = imgList) => {
        const left = [] as any;
        const right = [] as any;
        list.forEach((item, index) => {
            // 按高度分配（这里简化按数量分配）
            if (left.length <= right.length) {
                left.push(item)
            } else {
                right.push(item) 
            }
        })

        setColumns([left, right])
    }, [imgList])

    useEffect(() => {
        splitColumns(imgList)
    }, [imgList, splitColumns])

    // 删除图片
    const handleDeleted = useCallback((deletedId) => {
        const newList = imgList.filter(img => img.id !== deletedId)
        setImgList(newList)
        splitColumns(newList)
    }, [imgList, splitColumns])

    // 获取用户图片
    const getUserImages = useCallback(async (isAdd = true) => {
        if (loading || (noMore && isAdd)) return

        setLoading(true)

        try {
            // 计算本次请求的参数，避免使用状态中的过期值
            const reqParam = isAdd ? param : { ...param, page: 1 }
            if (!isAdd) {
                setParam(prev => ({ ...prev, page: 1 }))
            }
            const { data } = await aiImgUserListApi(reqParam)
            const list = data?.list || []

            if (list.length === 0) {
                setNoMore(true)
            } else {
                let newList
                if (isAdd) {
                    newList = [...imgList, ...list]
                } else {
                    newList = list
                }

                setImgList(newList)

                // 检查需要轮询的图片
                list.forEach((img) => {
                    if (!img.result_url) {
                        pollingIds.current.add(img.id)
                    }
                })

                // 开始轮询
                if (pollingIds.current.size > 0) {
                    startPolling()
                }

                // 分割列
                splitColumns(newList)

                // 更新页码（基于本次请求的参数计算下一页）
                setParam(prev => ({ ...prev, page: (isAdd ? prev.page : reqParam.page) + 1 }))
            }
        } catch (error) {
            console.error('获取图片列表失败:', error)
        } finally {
            setLoading(false)
        }
    }, [param, loading, noMore, imgList, startPolling, splitColumns])

    // 页面显示时加载
    useDidShow(() => {
        setParam(prev => ({ ...prev, page: 1 }))
        setImgList([])
        setColumns([[], []])
        setNoMore(false)
        getUserImages(false)
    })

    useLoad(() => {
        console.log('useLoad')
    })

    // 上拉加载更多
    useReachBottom(() => {
        if (!loading && !noMore) {
            getUserImages(true)
        }
    })

    // 组件卸载时清理
    useDidHide(() => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
            pollingInterval.current = null
        }
    })

    useEffect(() => {
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current)
            }
        }
    }, [])

    // 去创建页面
    const goCreate = () => {
        Taro.navigateTo({
            url: '/pages/ai/create/image'
        })
    }

    return (
        <View className='ai-list' style={{ paddingTop: navBarHeight }}>
            {/* 有数据时显示瀑布流 */}
            {columns[0].length > 0 || columns[1].length > 0 ? (
                <View>
                    <View className='waterfall'>
                        {columns.map((col, i) => (
                            <View key={i} className='column'>
                                {col.map((item, index) => {
                                    return (
                                        <WaterfallItem
                                            key={item.id}
                                            timeObj={item}
                                            isUser={true}
                                        />
                                    )
                                })}
                            </View>
                        ))}
                    </View>

                    {/* 加载状态 */}
                    {loading && <View className='loading-more'>加载中...</View>}
                    {noMore && <View className='no-more'>没有更多了</View>}
                </View>
            ) : (
                /* 空状态 */
                <View className='empty-box'>
                    <Image
                        className='empty-img'
                        src='https://box-1259309383.cos.ap-beijing.myqcloud.com/uploads/images/20251023/2025102316413812b6a7153.png'
                        mode='widthFix'
                    />
                    <Text className='empty-text'>还没有创建过图片哦～</Text>
                    <Button className='create-btn' onClick={goCreate}>
                        立即创建
                    </Button>
                </View>
            )}
        </View>
    )
}
