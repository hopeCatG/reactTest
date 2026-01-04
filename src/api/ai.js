// api/user.js
import { get, post, put, del } from '../utils/request';

// 获取模型列表
export function getModelsApi(data) {
  return get('/ai/getModels',data);
}

// 获取官方图片列表
export function getAiImgListApi(data) {
	return get('/ai/aiImgList', data )
}


// 提示词润色
export const aiPrpmptPolish = (data) => {
	return post('/dify/chat', data );
}

// 提交创建图片
export const aiImgCreateApi = (data) => {
	return post('/ai/textToImg', data);
}

// 获取用户图片列表
export const aiImgUserListApi = (data ) => {
	return post('/ai/getUserList', data );
}

// 图片详情
export function getImgInitApi(data ) {
	return get( '/ai/imgInit', data)
}

// 删除图片
export const deleteImgApi = (data) => {
  return post('/ai/deleteImg',data);
}

