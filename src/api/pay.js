import { get, post, put, del } from '../utils/request';

//支付方式
export function getPayWay(data) {
    return get('/pay/payWay', data)
}

// 预支付
export function prepay(data) {
    return post( '/pay/prepay', data )
}

// 预支付
export function getPayResult(data) {
    return get( '/pay/payStatus', data)
}
