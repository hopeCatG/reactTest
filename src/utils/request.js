import Taro from '@tarojs/taro';

const BASE_URL = process.env.TARO_APP_BASE_URL;

// 基础请求函数
export const request = async (options) => {
  // 合并默认配置
  const config = {
    url: options.url,
    method: options.method || 'GET',
    data: options.data || {},
    header: {
      'Content-Type': 'application/json',
      'token': Taro.getStorageSync('token') || '',
      ...options.header,
    },
    ...options,
  };

  // 完整 URL 处理
  if (!config.url.startsWith('http')) {
    config.url = BASE_URL + config.url;
  }

  try {

    const response = await Taro.request(config);
    // 处理响应
    const { data, statusCode } = response;
    if (data.code === 1) {
      return data; // 成功返回数据
    } else {
      // 业务逻辑错误
      if (data.msg == '请求参数缺token') { 
        Taro.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      throw new Error(data.msg || '请求失败');
    }
  } catch (error) {
    // 统一错误处理
    handleError(error);
    throw error; // 继续向上抛出错误
  }
};

// 错误处理函数
const handleError = (error) => {
  console.error('请求错误:', error);
  
  // 网络错误
  if (error.errMsg?.includes('network')) {
    Taro.showToast({ title: '网络连接失败', icon: 'none' });
    return;
  }
  
  // 超时错误
  if (error.errMsg?.includes('timeout')) {
    Taro.showToast({ title: '请求超时', icon: 'none' });
    return;
  }
  
  // 显示错误信息
  Taro.showToast({ 
    title: error.message || '请求失败，请重试', 
    icon: 'none' 
  });
};

// 快捷方法
export const get = (url, data = {}, options = {}) => {
  return request({ url, data, method: 'GET', ...options });
};

export const post = (url, data = {}, options = {}) => {
  return request({ url, data, method: 'POST', ...options });
};

export const put = (url, data = {}, options = {}) => {
  return request({ url, data, method: 'PUT', ...options });
};

export const del = (url, data = {}, options = {}) => {
  return request({ url, data, method: 'DELETE', ...options });
};