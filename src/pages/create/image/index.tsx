// pages/ai/create/index.jsx
import { View, Text, Image, Textarea, Button, Video } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { getNavigationBarHeight } from '../../../hooks/useNavigationBarHeight';
import { useState, useEffect, useRef } from 'react'
import useUserStore from '../../../stores/user-store'

import NavBar from '../../../components/NavBar'
import {
    getModelsApi,
    getAiImgListApi,
    aiImgCreateApi,
    aiImgUserListApi,
    getImgInitApi,
    aiPrpmptPolish
} from '../../../api/ai'
import './index.scss'

export default function AICreatePage() {
    const router = useRouter()

    const { navBarHeight } = getNavigationBarHeight();
    const { userInfo,getUserCenter } = useUserStore()


    // 状态管理
    const [prompt, setPrompt] = useState('')
    const [negativePrompt, setNegativePrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [imageList, setImageList] = useState([]) as any;

    // 模型相关
    const [modelList, setModelList] = useState([]) as any;
    const [loraList, setLoraList] = useState([]) as any;
    const [currentModel, setCurrentModel] = useState({ name: '选择模型', uuid: '' })
    const [lora, setLora] = useState({ uuid: '', weight: 0 })
    const [width, setWidth] = useState(768)
    const [height, setHeight] = useState(1024)

    // 比例配置
    const ratioList = [
        { label: '16:9', value: '16:9' },
        { label: '9:16', value: '9:16' },
        { label: '21:9', value: '21:9' },
        { label: '3:2', value: '3:2' },
        { label: '4:3', value: '4:3' },
        { label: '1:1', value: '1:1' },
        { label: '3:4', value: '3:4' },
        { label: '2:3', value: '2:3' }
    ]
    const [currentRatio, setCurrentRatio] = useState(ratioList[0])

    // 弹窗
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [conversationId, setConversationId] = useState('')



    // 初始化
    useLoad(async (options) => {
        // 获取用户信息
        await getUserCenter()
        await getModels()

        // 处理路由参数
        if (options.data) {
            try {
                const timeObj = JSON.parse(decodeURIComponent(options.data))
                setNegativePrompt(timeObj.negative_prompt || '')
                setPrompt(timeObj.prompt || '')
                setCurrentModel(timeObj.model || { name: '选择模型', uuid: '' })

                if (timeObj?.models) {
                    timeObj.models.forEach((item) => {
                        if (item.type === 'LoRA') {
                            setLora(item)
                        }
                    })
                }

                const ratioItem = ratioList.find(ratio => ratio.value === timeObj.ratio)
                if (ratioItem) {
                    setCurrentRatio(ratioItem)
                    const [w, h] = timeObj.scale.split('x').map(Number)
                    setWidth(w)
                    setHeight(h)
                }
            } catch (error) {
                console.error('解析参数失败:', error)
            }
        }

        // LoRA 参数
        if (options.LoRA) {
            try {
                const loraItem = JSON.parse(decodeURIComponent(options.LoRA))
                selectLora(loraItem)
                Taro.showToast({
                    title: '已选择LoRA模型',
                    icon: 'none'
                })
                setTimeout(() => {
                    scrollToLora()
                }, 500)
            } catch (error) {
                console.error('解析LoRA参数失败:', error)
            }
        }

        await getLoRA()
        await getUserImages()
    })

    // 获取模型
    const getModels = async () => {
        try {
            const { data } = await getModelsApi({ type: 'Checkpoint' })
            console.log(data);
            setModelList(data.list || [])
            if (data.list && data.list.length > 0) {
                setCurrentModel(data.list[0])
            }
        } catch (error) {
            console.error('获取模型失败:', error)
        }
    }

    // 获取LoRA
    const getLoRA = async () => {
        try {
            const { data } = await getModelsApi({ type: 'LoRA' })
            setLoraList(data.list || [])
        } catch (error) {
            console.error('获取LoRA失败:', error)
        }
    }

    // 获取用户生成图片
    const getUserImages = async () => {
        try {
            const { data } = await aiImgUserListApi({ page: 1, pageSize: 10, sort: 'desc' })
            setImageList(data.list || [])
        } catch (error) {
            console.error('获取用户图片失败:', error)
        }
    }

    // 选择比例
    const selectRatio = (item) => {
        const [w, h] = item.value.split(':').map(Number)
        setCurrentRatio(item)
        setWidth(Math.round((w / h) * height))
    }

    // 选择LoRA
    const selectLora = (item) => {
        setLora(lora.uuid === item.uuid ? { uuid: '', weight: 0 } : item)
    }

    // 滚动到LoRA区域
    const scrollToLora = () => {
        const query = Taro.createSelectorQuery()
        query.select('#LoRA').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
            //   if (res[0]) {
            //     const scrollTop = res[0].top + (navBarHeight || 0)
            //     Taro.pageScrollTo({
            //       scrollTop: scrollTop,
            //       duration: 300
            //     })
            //   }
        })
    }

    // 生成图片
    const generate = async () => {
        if (loading) return

        if (!prompt.trim()) {
            Taro.showToast({ title: '请输入提示词', icon: 'none' })
            return
        }

        setLoading(true)
        const data = {
            prompt: prompt,
            negativePrompt: negativePrompt,
            model: currentModel.uuid,
            ratio: currentRatio.value,
            width: width,
            height: height
        }

        // if (lora.uuid) {
        //   data.LoRAArr = [{ modelId: lora.uuid, weight: lora.weight }]
        // }

        try {
            await aiImgCreateApi(data)
            Taro.showToast({ title: '提交成功', icon: 'success' })
            setTimeout(() => {
                Taro.switchTab({ url: '/pages/list/index' })
            }, 800);
        } catch (error) {
            console.error('生成失败:', error)
        } finally {
            setLoading(false)
        }
    }

    // 提示词润色
    const generatePrompt = async () => {
        if (!prompt) {
            Taro.showToast({
                title: '请先输入基础提示词',
                icon: 'none'
            })
            return
        }

        Taro.showLoading({ title: 'AI生成中' })

        try {
            const {data} = await aiPrpmptPolish({
                type: 'textToImg',
                query: prompt,
                inputs: {},  
                user: userInfo?.id || 'user00',
                response_mode: 'blocking',
                conversation_id: conversationId
            })

            setPrompt(data.answers.prompt || prompt)
            setNegativePrompt(data.answers?.negativePrompt || negativePrompt)
        } catch (error) {
            console.error('润色失败:', error)
        } finally {
            Taro.hideLoading()
        }
    }

    return (
        <View
            className='ai-create-page'
            style={{ paddingTop: navBarHeight }}
        >
            <NavBar
                title=''
            />

            {/* 标题 */}
            <View className='page-header'>
                <Text className='title'>AI 文生图</Text>
                <Text className='subtitle'>输入提示词，一键生成高质量图片</Text>
            </View>

            {/* 输入区域 */}
            <View className='form-box'>
                <View className='flex-init-sb'>
                    <View className='lable-titie'>提示词</View>
                    <View className='flex-init'>
                        <Text
                            className='iconfont icon-wenhaoxiao'
                            onClick={() => setShowVideoModal(true)}
                        />
                        <View className='generate-prompt-btn' onClick={generatePrompt}>
                            提示词润色
                        </View>
                    </View>
                </View>

                <Textarea
                    value={prompt}
                    onInput={(e) => setPrompt(e.detail.value)}
                    placeholder='请输入提示词，如：唯美少女、阳光、草地...'
                    placeholderStyle='color: #fff;'
                    className='prompt-input w100'
                    maxlength={800}
                />

                <View className='lable-titie'>反向提示词</View>
                <Textarea
                    value={negativePrompt}
                    onInput={(e) => setNegativePrompt(e.detail.value)}
                    placeholder='请输入反向提示词（可选）'
                    placeholderStyle='color: #fff;'
                    className='prompt-input w100'
                    maxlength={800}
                />

                {/* 模型选择 */}
                <View className='lora-box'>
                    <Text className='label'>模型</Text>
                    <View className='lora-scroll'>
                        {modelList.map((item) => (
                            <View
                                key={item.uuid}
                                className={`lora-item ${currentModel.uuid === item.uuid ? 'active' : ''}`}
                                onClick={() => setCurrentModel(item)}
                            >
                                <Image src={item.logo_url} className='lora-img' mode='aspectFill' />
                                <Text className='lora-name'>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 比例选择 */}
                <View className='lora-box'>
                    <Text className='label'>比例</Text>
                    <View className='lora-scroll'>
                        {ratioList.map((item) => (
                            <View
                                key={item.value}
                                className={`lora-item ${currentRatio.value === item.value ? 'active' : ''}`}
                                onClick={() => selectRatio(item)}
                            >
                                <View className='lora-placeholder'>
                                    <Text className='lora-name'>{item.label}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* LoRA 选择 */}
                <View className='lora-box' id='LoRA'>
                    <Text className='label'>创意风格（LoRA）</Text>
                    <View className='lora-scroll'>
                        {loraList.map((item) => (
                            <View
                                key={item.id}
                                className={`lora-item ${lora.uuid === item.uuid ? 'active' : ''}`}
                                onClick={() => selectLora(item)}
                            >
                                <Image src={item.logo_url} className='lora-img' mode='aspectFill' />
                                <Text className='lora-name'>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 生成按钮 */}
                <View className='generate-btn-box'>
                    <Button
                        className='generate-btn'
                        loading={loading}
                        onClick={generate}
                    >
                        {loading ? '提交队列中...' : 'AI生成（消耗0.09~0.12积分）'}
                    </Button>
                </View>
            </View>



            {/* <View className='page-header'>
                <Text className='title'>我的图片</Text>
                <Text className='subtitle'>历史列表</Text>
            </View> */}

            {/* 生成结果 */}
            {/* <View className='result-box'>
                {imageList.length === 0 ? (
                    <View className='empty-tip'>暂无生成记录</View>
                ) : (
                    <View className='img-grid'>
                        {imageList.map((img, index) => (
                            <View key={index} className='img-item'>
                                <Image src={img.result_url} mode='widthFix' className='img' />
                                <View className='prompt-info'>
                                    <Text className='prompt-title'>提示词：</Text>
                                    <Text className='prompt-content'>{img.prompt}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View> */}

            {/* 视频教程模态框 */}
            {showVideoModal && (
                <View className='cu-modal show'>
                    <View className='cu-dialog'>
                        <View className='cu-bar bg-white justify-between'>
                            <View className='content'>教程视频</View>
                            <View className='action' onClick={() => setShowVideoModal(false)}>
                                <Text className='cuIcon-close text-black'>×</Text>
                            </View>
                        </View>

                        <View className='padding-xl' style={{ display: 'flex', justifyContent: 'center' }}>
                            <Video
                                src='https://box-1259309383.cos.ap-beijing.myqcloud.com/uploads/video/20251029/20251029165213b009c1754.mp4'
                                controls
                                autoplay
                                loop={false}
                                objectFit='contain'
                                style={{ width: '100%', maxWidth: '600rpx', height: '340rpx', borderRadius: '20rpx' }}
                            />
                        </View>

                        <View className='cu-bar bg-white justify-end'>
                            <View className='action'>
                                <Button className='cu-btn line-black text-black' onClick={() => setShowVideoModal(false)}>
                                    关闭
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
}