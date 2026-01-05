import { View, Image, Button } from '@tarojs/components';
import { useState, useRef } from 'react';
import Taro from '@tarojs/taro';
import { useLoad, navigateTo, usePageScroll } from '@tarojs/taro';
import { getNavigationBarHeight } from '../../hooks/useNavigationBarHeight';
import { getModelsApi, getAiImgListApi } from '../../api/ai';
import WaterfallItem from '../../components/WaterfallItem';
import './index.scss';

export default function Index() {
  const { navBarHeight, statusBarHeight } = getNavigationBarHeight()

  // 获取模型列表
  const [modelList, setModelList] = useState([]) as any[];
  const getModels = async () => {
    const { data } = await getModelsApi({ type: 'LoRA' })
    setModelList(data.list);
  }

  // 获取图片列表
  const [imageList, setImageList] = useState([]) as any[];
  const [params, setParams] = useState({
    page: 1,
    pageSize: 16,
  });
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const getImages = async (isLoadMore = false) => {
    if (loading || (!isLoadMore && !hasMore)) return;

    setLoading(true);
    try {
      const { data } = await getAiImgListApi(params)

      if (isLoadMore) {
        // 加载更多
        setImageList(prev => [...prev, ...data.list]);
      } else {
        // 第一次加载
        setImageList(data.list);
      }

      // 判断是否还有更多数据
      if (data.list.length < params.pageSize) {
        setHasMore(false);
      } else {
        setParams(prev => ({ ...prev, page: prev.page + 1 }));
      }
    } catch (error) {
      console.error('获取图片失败:', error);
    } finally {
      setLoading(false);
    }
  }


  // 使用 usePageScroll 监听页面滚动
  // 获取系统信息，包括屏幕高度
  const systemInfo = Taro.getSystemInfoSync();
  const screenHeight = systemInfo.windowHeight || systemInfo.screenHeight;
  // 防抖定时器
  const scrollTimer = useRef<any>(null);
  usePageScroll((res) => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    scrollTimer.current = setTimeout(() => {
      // 获取页面信息
      const query = Taro.createSelectorQuery();
      query.select('.page-body').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((rects) => {
        if (rects[0] && rects[1]) {
          const pageBody = rects[0]; // page-body 元素信息
          const scrollInfo = rects[1]; // 滚动信息

          // 计算是否滚动到底部
          // 滚动到底部的判断条件：scrollTop + 屏幕高度 >= 元素高度
          const isBottom = scrollInfo.scrollTop + screenHeight >= pageBody.height; // 减去50px的阈值
          if (isBottom && hasMore && !loading) {
            getImages(true);
          }
        }
      });
    }, 200);
  });

  // 页面加载
  useLoad(() => {
    getModels();
    getImages(false);
  })

  // 页面调整
  const goWhere = (url) => {
    navigateTo({
      url
    })
  }

  return (
    <View className='page-container' >
      <View className='fixed-header' >
        <View className="logo-box flex-init-start" style={{ height: navBarHeight }}>
          <Image
            style={{ marginTop: statusBarHeight }}
            src="https://box-1259309383.cos.ap-beijing.myqcloud.com/uploads/images/20251023/20251023114409eef571639.png"
          ></Image>
        </View>
        <View className="add-create-box">
          <View className="add-create" >
            <Image className="create-bg"
              src="https://liblibai-tmp-image.liblib.cloud/img/0dc79b9986c04e2abcfdd7bb7bfa4f6e/60d104d6aeec912fe83cdbdc87dc1dea28032b2f645cd047eb1449a7dee553dd.png"
              mode="aspectFill" />
            <View className="create-content">
              <View className="create-title">AI 创作中心</View>
              <View className="create-subtitle">点击进入文生图创作</View>
              <View className="create-btn" onClick={() => { goWhere('/pages/create/image/index') }}>立即创建</View>
            </View>
          </View>
        </View>
      </View>
      <View className='page-body' style={{ marginTop: navBarHeight + 120 }}>
        <View className="title">LoRA 模型</View>
        <View className="lora-list">
          {
            modelList.map((e) => {
              return (
                <View className="lora-item" key={e.id} onClick={() => { goWhere('/pages/create/image/index') }}>
                  <Image className="lora-logo" src={e.logo_url} mode='aspectFill' > </Image>
                  <View className="lora-info">
                    <View className="lora-name">{e.name}</View>
                    <View className="lora-desc">{e.type_describe}</View>
                  </View>
                </View>
              )
            })
          }
        </View>
        
        {/* 官方列表 */}
        <View className="title">图片广场</View>
        <View className="waterfall">
          {
            imageList.map((img) => {
              return (
                <WaterfallItem timeObj={img} key={img.id} />
              )
            })
          }
        </View>
        {/* 加载更多提示 */}
        {loading && (
          <View className="loading-more">加载中...</View>
        )}
        {!hasMore && imageList.length > 0 && (
          <View className="no-more">没有更多了</View>
        )}
      </View >
      {/* <Button onClick={() => { goWhere('/pages/test/index') }}>跳转测试2</Button> */}
    </View >
  );
}