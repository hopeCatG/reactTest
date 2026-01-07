import { get, post, put, del } from '../utils/request';

// 充值
export function recharge(data) {
    return post('/recharge/recharge', data)
}

// 充值记录
export function rechargeRecord(data) {
    return get('/recharge/lists', data)
}

// 充值配置
export function rechargeConfig() {
    return get('/recharge/config')
}

//余额明细
export function accountLog(data) {
    return get('/account_log/lists', data)
}

