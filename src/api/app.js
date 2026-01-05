import { get, post, put, del } from '../utils/request';

// 获取我的页面装饰
export function getDecorate(data) {
    return get('/index/decorate', data)
}

// 获取配置
export function getConfig() {
    return get('/index/config')
}
