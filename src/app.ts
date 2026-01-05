import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import useAppStore from './stores/app-store'

import './app.scss'
import './style/flex.css'
import './style/icon.css'




function App({ children }: PropsWithChildren<any>) {
  const { getConfig } = useAppStore();
  useLaunch(() => {
    console.log('App launched.')
    getConfig();
  })

  // children 是将要会渲染的页面
  return children
}



export default App
