
import { useState } from 'react'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { deleteImgApi } from '../../api/ai'
import './index.scss'

export default function WaterfallItem({
    timeObj = { result_url: '', prompt: '' } as any,
    isUser = false,

}) {
    // 状态管理
    const [showBtns, setShowBtns] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    const [img, setImg] = useState('')

    // 切换按钮显示
    const toggleButtons = () => {
        setShowBtns(true)
        setTimeout(() => {
            setShowBtns(false)
        }, 3000)
    }

    // 查看图片
    const handleView = () => {
        toggleButtons()
        setShowPreview(true)
    }

    // 显示删除确认
    const showDeleteConfirm = () => {
        toggleButtons()
        setShowDeleteModal(true)
    }

    // 隐藏删除确认
    const hideDeleteModal = () => {
        setShowDeleteModal(false)
    }

    // 确认删除
    const confirmDelete = async () => {
        hideDeleteModal()

        try {
            // 这里需要引入你的删除API
            await deleteImgApi({ id: timeObj.id })

            Taro.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
            })

        } catch (error) {
            Taro.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
            })
        }
    }

    // 显示详情弹窗
    const showDetailModal = () => {
        toggleButtons()
        setShowDetail(true)
    }

    // 下载图片
    const handleDownload = async () => {
        Taro.downloadFile({
            url: timeObj.result_url,
            success: (res) => {
                if (res.statusCode === 200) {
                    Taro.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: () => {
                            Taro.showToast({
                                title: '图片保存成功',
                                icon: 'none'
                            })
                        },
                        fail: (err) => {
                            console.log('保存失败:', err)
                            Taro.showToast({
                                title: '图片保存失败',
                                icon: 'none'
                            })
                        }
                    })
                }
            }
        })
    }

    // 一键同款
    const oneClickSameStyle = () => {
        const data = encodeURIComponent(JSON.stringify(timeObj))
        Taro.navigateTo({
            url: `/pages/ai/create/image?data=${data}`
        })
    }

    // 复制文本
    const handleCopy = (text) => {
        toggleButtons()
        Taro.setClipboardData({
            data: text,
            success: () => {
                Taro.showToast({
                    title: '复制成功',
                    icon: 'none'
                })
            }
        })
    }

    return (
        <View>
            {/* 瀑布流项目 */}
            <View className="waterfall-item">
                <View className="img-box" onClick={toggleButtons}>
                    <Image
                        className="waterfall-img"
                        src={timeObj?.result_url || require('@/static/images/icon/loding.webp')}
                        mode="widthFix"
                    />

                    {/* 功能按钮组 */}
                    <View className={`action-buttons ${showBtns ? 'show' : ''}`}>
                        <View className="btn" onClick={(e) => {
                            e.stopPropagation()
                            handleView()
                        }}>
                            查看 <Text className="iconfont icon-chakan" />
                        </View>

                        {isUser && (
                            <View className="btn" onClick={(e) => {
                                e.stopPropagation()
                                handleCopy(timeObj.prompt || '')
                            }}>
                                复制 <Text className="iconfont icon-fuzhi" />
                            </View>
                        )}

                        {!isUser && (
                            <View className="btn" onClick={(e) => {
                                e.stopPropagation()
                                showDetailModal()
                            }}>
                                详情 <Text className="iconfont icon-canshu" />
                            </View>
                        )}

                        {isUser && (
                            <View className="btn delete" onClick={(e) => {
                                e.stopPropagation()
                                showDeleteConfirm()
                            }}>
                                删除 <Text className="iconfont icon-shanchu1" />
                            </View>
                        )}
                    </View>
                </View>

                <View className="waterfall-info">
                    <View className="waterfall-text">{timeObj?.prompt || ''}</View>
                </View>
            </View>

            {/* 预览遮罩层 */}
            {showPreview && (
                <View className="preview-mask flex-init-c" onClick={() => setShowPreview(false)}>
                    <Image className="preview-img" src={timeObj.result_url} mode="widthFix" />
                    <View className="download-img" onClick={(e) => {
                        e.stopPropagation()
                        handleDownload()
                    }}>
                        保存图片
                    </View>
                </View>
            )}

            {/* 删除确认模态框 */}
            {showDeleteModal && (
                <View className="cu-modal show">
                    <View className="cu-dialog">
                        <View className="cu-bar bg-white justify-end">
                            <View className="content">确认删除</View>
                            <View className="action" onClick={hideDeleteModal}>
                                <Text className="cuIcon-close text-red">×</Text>
                            </View>
                        </View>
                        <View className="padding-xl">
                            确定要删除这个作品吗？删除后将无法恢复。
                        </View>
                        <View className="cu-bar bg-white justify-end">
                            <View className="action">
                                <Button className="cu-btn line-green text-green" onClick={hideDeleteModal}>
                                    取消
                                </Button>
                                <Button className="cu-btn bg-red margin-left" onClick={confirmDelete}>
                                    确定删除
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* 详情弹窗 */}
            {showDetail && (
                <View className="cu-modal show">
                    <View className="cu-dialog detail-dialog">
                        <View className="cu-bar bg-white justify-end">
                            <View className="content">AI 图片详情</View>
                            <View className="action" onClick={() => setShowDetail(false)}>
                                <Text className="cuIcon-close text-red">×</Text>
                            </View>
                        </View>

                        <ScrollView scrollY className="detail-body">
                            <View className="detail-container">
                                {/* 左边图片 */}
                                <View className="left-img-box flex-init-c-start">
                                    <Image src={timeObj.result_url} mode="aspectFit" />
                                    <View className="flex-init">
                                        <Button
                                            className="cu-btn line-blue mini margin-top-sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                oneClickSameStyle()
                                            }}
                                        >
                                            一键同款
                                        </Button>
                                    </View>
                                </View>

                                {/* 右侧信息 */}
                                <View className="right-info">
                                    <View className="info-section">
                                        <View className="flex-init-sb">
                                            <View className="info-title">提示词</View>
                                            <View
                                                className="copy-btn flex-init"
                                                onClick={() => handleCopy(timeObj.prompt || '无')}
                                            >
                                                复制 <Text className="iconfont icon-cc-copy" />
                                            </View>
                                        </View>
                                        <View className="info-content text-ellipsis-3">
                                            {timeObj.prompt || '无'}
                                        </View>
                                    </View>

                                    <View className="info-section">
                                        <View className="flex-init-sb">
                                            <View className="info-title">负向提示词</View>
                                            <View
                                                className="copy-btn flex-init"
                                                onClick={() => handleCopy(timeObj.negative_prompt || '无')}
                                            >
                                                复制 <Text className="iconfont icon-cc-copy" />
                                            </View>
                                        </View>
                                        <View className="info-content text-ellipsis-3">
                                            {timeObj.negative_prompt || '无'}
                                        </View>
                                    </View>

                                    {timeObj.models?.length > 0 && (
                                        <View className="info-section">
                                            <View className="info-title text-left">引用模型</View>
                                            {timeObj.models.map((model, i) => (
                                                <View key={i} className="model-item">
                                                    {model.logo_url && (
                                                        <Image src={model.logo_url} className="model-logo" />
                                                    )}
                                                    <View>
                                                        <View className="model-name">{model.name}</View>
                                                        <View className="model-type text-left">{model.type}</View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    <View className="info-section flex-init-sb">
                                        <View>
                                            <View className="info-title">尺寸</View>
                                            <View className="info-content">{timeObj.scale || '未知'}</View>
                                        </View>
                                        <View>
                                            <View className="info-title">模型</View>
                                            <View className="info-content">{timeObj.model?.name || '未知'}</View>
                                        </View>
                                    </View>

                                    {timeObj.tags?.length > 0 && (
                                        <View className="info-section">
                                            <View className="info-title">标签</View>
                                            <View className="tag-list">
                                                {timeObj.tags.map((tag, idx) => (
                                                    <View key={idx} className="tag">{tag}</View>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    )
}
