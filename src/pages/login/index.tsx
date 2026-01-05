import { useState } from 'react'
import { View, Text, Button, Checkbox, CheckboxGroup } from '@tarojs/components'
import { navigateTo, showModal} from '@tarojs/taro'
import { mnpLogin } from '../../api/user'
import Taro from '@tarojs/taro'
import useUserStore from '../../stores/user-store';

import './index.scss'

export default function Login() {
    const [checked, setChecked] = useState(false)
    const {login, getUserCenter } = useUserStore();
    
    const handleLogin = async () => {
        if (!checked) {
            showModal({
                title: '提示',
                content: '请先阅读并同意《服务协议》和《隐私协议》',
                showCancel: false
            })
            return
        }

        const { code } = await Taro.login()
        const res = await mnpLogin({
            code
        })
        if (res.code === 1) {
            login(res.data)
            await getUserCenter()
            Taro.switchTab({
                url: '/pages/index/index'
            })
        }
        else {
            showModal({
                title: '提示',
                content: res.msg,
                showCancel: false
            })
        }
    }

    const handleCheckboxChange = (e) => {
        setChecked(e.detail.value.includes('agree'))
    }

    const handleProtocolClick = (type) => {
        // 跳转到协议页面
        navigateTo({
            url: `/pages/protocol/index?type=${type}`
        })
    }



    return (
        <View className="login-container">
            {/* 顶部装饰区域 */}
            <View className="header">
                <Text className="welcome">欢迎登录</Text>
                <Text className="subtitle">请完成登录以继续使用</Text>
            </View>

            {/* 登录按钮区域 */}
            <View className="login-button-area">
                <Button
                    className="login-button"
                    hoverClass="login-button-hover"
                    onClick={handleLogin}
                    size="default"
                >
                    微信一键登录
                </Button>
            </View>

            {/* 协议勾选区域 */}
            <View className="protocol-container">
                <CheckboxGroup onChange={handleCheckboxChange}>
                    <Checkbox
                        value="agree"
                        checked={checked}
                        className="checkbox"
                    />
                </CheckboxGroup>
                <Text className="protocol-text">
                    已阅读并同意
                    <Text
                        className="protocol-link"
                        onClick={() => handleProtocolClick('service')}
                    >
                        《服务协议》
                    </Text>
                    和
                    <Text
                        className="protocol-link"
                        onClick={() => handleProtocolClick('privacy')}
                    >
                        《隐私协议》
                    </Text>
                </Text>
            </View>
        </View>
    )
}