import { get, post, put, del } from '../utils/request';

// 微信登录
export function mnpLogin(data) {
    return post('/login/mnpLogin', data)
}

// 获取用户中心
export function getUserCenter(header) {
    return get('/user/center', header )
}