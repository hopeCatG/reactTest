

## 项目说明

- taro+react 学习

## 项目说明

- 技术栈：Taro + React + Vite + TypeScript + Sass，状态管理用 Zustand
- 多端构建：支持小程序、H5、RN 等平台，脚本以 build:/dev: 前缀区分目标平台
- 配置中心：按开发/生产拆分，统一通过 Taro defineConfig 合并

## 目录树（最新）

```
reactTest/
├─ .husky/                    # Git 钩子
├─ config/                    # 构建配置
│  ├─ dev.ts                  # 开发配置
│  ├─ index.ts                # 主配置入口
│  └─ prod.ts                 # 生产配置
├─ src/                       # 业务主目录
│  ├─ api/
│  │  └─ ai.js               # AI 相关接口封装
│  ├─ components/
│  │  └─ CounterButton/
│  │     ├─ index.scss
│  │     └─ index.tsx        # 通用计数按钮组件
│  ├─ hooks/
│  │  └─ useNavigationBarHeight.ts  # 导航栏高度计算
│  ├─ pages/
│  │  ├─ index/
│  │  │  ├─ index.config.ts
│  │  │  ├─ index.scss
│  │  │  └─ index.tsx        # 首页展示 LoRA 模型
│  │  └─ test/
│  │     ├─ index.config.ts
│  │     ├─ index.scss
│  │     └─ index.tsx        # 测试页，组件通信与 Zustand 示例
│  ├─ stores/
│  │  └─ user-store.js       # 用户状态（Zustand）
│  ├─ utils/
│  │  └─ request.js          # 请求封装（baseUrl、loading、错误处理）
│  ├─ app.config.ts          # 页面路由与窗口配置
│  ├─ app.scss               # 全局样式
│  ├─ app.ts                 # 应用入口（生命周期）
│  └─ index.html             # H5 模板
├─ types/
│  └─ global.d.ts            # 全局类型声明
├─ .editorconfig
├─ .env.development
├─ .env.production
├─ .env.test
├─ .eslintrc
├─ .gitattributes
├─ .gitignore
├─ README.md
├─ babel.config.js
├─ commitlint.config.mjs
├─ package-lock.json
├─ package.json
├─ project.config.json       # 小程序项目配置
├─ project.private.config.json
├─ stylelint.config.mjs
└─ tsconfig.json
```

## 目录说明

- config：各平台与环境的构建配置（dev.ts、prod.ts；入口 index.ts）
- src：业务代码主目录
  - api：接口方法封装（示例：ai.js 中 getModelsApi → GET /ai/getModels）
  - utils：通用工具库（request.js 统一 baseUrl、loading、错误处理，并提供 get/post/put/del）
  - stores：应用状态管理（Zustand，user-store.js 包含 userInfo、token 及 login/logout/updateAvatar）
  - hooks：自定义 Hooks（useNavigationBarHeight.ts 计算导航栏高度）
  - components：通用组件（CounterButton 展示受控值与步长增量）
  - pages：页面模块（首页 pages/index、测试页 pages/test）
  - 入口与全局（app.ts 应用入口；app.config.ts 路由与页面声明；index.html H5 模板）
- types：类型补充与全局声明（global.d.ts）
- .husky：Git 钩子配置（如 commit-msg 校验）
- 环境文件：.env.development / .env.production / .env.test
- 规范配置：.eslintrc、stylelint.config.mjs、.editorconfig
- 项目元配置：project.config.json（小程序配置）、package.json（脚本与依赖）

## 数据与请求

- 接口约定：通过 src/utils/request.js 的 BASE_URL 拼接非 http 地址；后端响应 200 时返回 data，其余抛错并走统一错误提示
- 业务 API：在 src/api 中按业务拆分方法，示例 getModelsApi 使用 GET /ai/getModels 获取模型列表并在首页展示

## 开发与调试

- 启动开发：H5 使用 `npm run dev:h5`，小程序使用 `npm run dev:weapp`
- 新增页面：在 src/pages 下创建目录并新增 index.tsx、index.scss、index.config.ts，同时在 src/app.config.ts 的 pages 中注册
- 新增接口：在 src/api 下添加对应方法，内部调用 src/utils/request.js 的快捷方法

## 项目笔记

- [taro+react 学习](https://www.yuque.com/skyblue-0xatt/df0t8b/hwreog8eaegtdibe?singleDo)

