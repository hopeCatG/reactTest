import { View } from '@tarojs/components'
import { useState } from 'react'

import './index.scss'


interface TabItem {
    name?: string
    count?: number
    [key: string]: any
}

interface TabsProps {
    list: TabItem[]
    current?: number
    isScroll?: boolean
    height?: number
    fontSize?: number
    activeColor?: string
    inactiveColor?: string
    barWidth?: number
    barHeight?: number
    duration?: number
    gutter?: number
    bgColor?: string
    nameKey?: string
    bold?: boolean
    showBar?: boolean
    onChange?: (index: number) => void
}





export default function Tabs(props: TabsProps) {

    const {
        list = [],
        current = 0,
        onChange,
    } = props

    const [currentIndex, setCurrentIndex] = useState(current)

    const changeCurrent = (index: number) => {
        setCurrentIndex(index);
        onChange?.(index);
    }

    return (
        <View className='tabs flex-init-sb'>
            {
                list.map((item, index) => (
                    <view className={`tab-item ${index === currentIndex ? 'active' : ''}`} key={index}
                        onClick={() => changeCurrent?.(index)}
                    >
                        {item?.name}
                    </view>
                ))
            }
        </View>
    )
}