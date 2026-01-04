import { View, Text } from '@tarojs/components';
import { getNavigationBarHeight } from '../../hooks/useNavigationBarHeight';
import { goBack } from '../../hooks/useCommon';
import './index.scss';

export default function NavBar({
    title = '',
    color = 'white',
    leftSlot = null,
    rightSlot = null,
    customTitle = null,
}) {
    const { menuButtonInfo } = getNavigationBarHeight();

    return (
        <View className="grid-3 nav-box" style={{ top: menuButtonInfo.top + (menuButtonInfo.height / 6)}}>
            {/* 左侧插槽 */}
            <View className="nav-left" style={{ color }} onClick={goBack}>
                {leftSlot || ( // 插槽
                    <View className="iconfont icon-fanhui1"></View>
                )}
            </View>

            {/* 中间标题区域 */}
            <View className="title flex-init" style={{ color }}>
                {customTitle || ( // 插槽
                    <Text>{title || ''}</Text>
                )}
            </View>

            {/* 右侧插槽 */}
            <View className="nav-right">
                {rightSlot || <View></View>} {/* 右侧默认为空 */}
            </View>
        </View>
    );
}