# 🎵 网易云音乐小程序 - 音乐纯享版

<div align="center">

![网易云音乐](https://img.shields.io/badge/网易云音乐-小程序-red?style=for-the-badge&logo=netease-cloud-music)
![微信小程序](https://img.shields.io/badge/微信-小程序-green?style=for-the-badge&logo=wechat)
![版本](https://img.shields.io/badge/版本-v1.0.0-blue?style=for-the-badge)

**一款基于网易云音乐 API 的微信小程序，提供音乐发现、播放、搜索、视频等功能**

[功能特色](#-功能特色) • [技术架构](#-技术架构) • [项目结构](#-项目结构) • [快速开始](#-快速开始) • [API 文档](#-api-文档)

</div>

---

## 📱 功能特色
### 页面展示
![音乐小程序1](https://github.com/user-attachments/assets/01b0ee00-0950-42b2-8471-00c7f3a9713f)
![音乐小程序2](https://github.com/user-attachments/assets/b3c2dfbb-2467-46bf-bf9c-e6834e0be5c0)
![音乐小程序3](https://github.com/user-attachments/assets/2fdff7fd-e7c8-4222-895e-39d672060647)
![音乐小程序4](https://github.com/user-attachments/assets/ccdb2167-5711-4b8d-9410-1f0d99280822)
<img width="502" height="969" alt="image" src="https://github.com/user-attachments/assets/fc429041-fd9e-4061-94c8-249c6b1625c6" />
<img width="502" height="969" alt="image" src="https://github.com/user-attachments/assets/75ac91a6-2d81-4cde-a541-c39103acef5d" />
![Uploading image.png…]()

### 🎶 音乐发现
- **轮播推荐**：首页精美轮播图展示热门音乐内容
- **个性化推荐**：基于网易云算法的个性化歌单推荐
- **新歌推荐**：实时更新的最新音乐推荐
- **热搜榜单**：动态展示当前热门搜索词汇
- **智能提示**：随机展示音乐相关的优美文案

### 🎧 音乐播放
- **高品质播放**：支持无损音质播放体验
- **歌词同步**：实时滚动歌词显示
- **播放控制**：完整的播放、暂停、上一首、下一首功能
- **后台播放**：支持小程序后台音乐播放
- **播放动画**：精美的唱片旋转动画效果

### 🔍 智能搜索
- **实时搜索**：输入关键词即时返回搜索结果
- **热门搜索**：展示当前热门搜索关键词
- **搜索历史**：自动保存用户搜索历史
- **搜索建议**：智能搜索建议和自动补全
- **多维度搜索**：支持歌曲、歌手、专辑等多维度搜索

### 📺 视频内容
- **MV 播放**：高清 MV 视频播放
- **弹幕互动**：支持弹幕评论功能
- **相关推荐**：智能推荐相关视频内容
- **视频详情**：完整的视频信息展示
- **分区浏览**：按地区分类浏览 MV 内容

### 👤 个人中心
- **用户信息**：个人资料展示和管理
- **登录系统**：手机号验证码登录
- **个人收藏**：收藏的歌曲和歌单管理
- **播放历史**：个人音乐播放记录

---

## 🛠 技术架构

### 前端技术栈
```
微信小程序原生框架
├── WXML - 页面结构
├── WXSS - 样式设计  
├── JavaScript - 业务逻辑
└── WXS - 页面脚本
```

### 核心依赖
- **[@vant/weapp](https://vant-contrib.gitee.io/vant-weapp/)** `^1.10.19` - 高质量的微信小程序 UI 组件库
- **[dayjs](https://dayjs.gitee.io/)** `^1.11.7` - 轻量级日期处理库
- **[mobx-miniprogram](https://github.com/mobxjs/mobx-miniprogram)** `^4.13.2` - 小程序状态管理
- **[mobx-miniprogram-bindings](https://github.com/mobxjs/mobx-miniprogram-bindings)** `^2.1.5` - MobX 数据绑定

### 架构特点
- **模块化设计**：清晰的模块划分和组件复用
- **分包加载**：视频和播放器功能独立分包，优化加载性能
- **状态管理**：使用 MobX 进行全局状态管理
- **组件化开发**：自定义组件提高代码复用性
- **API 封装**：统一的网络请求封装和错误处理

---

## 📁 项目结构

```
NetEaseCloud/
├── 📁 pages/                    # 主包页面
│   ├── 📁 discover/             # 🏠 发现页面（首页）
│   ├── 📁 personage/            # 👤 个人中心页面
│   ├── 📁 searchPage/           # 🔍 搜索页面
│   ├── 📁 listPage/             # 📋 歌单详情页面
│   ├── 📁 PlayDetailsPage/      # 🎵 播放详情页面
│   ├── 📁 videoPage/            # 📺 视频页面
│   └── 📁 ls/                   # 📝 歌单列表页面
├── 📁 packageVideo/             # 视频分包
│   └── 📁 pages/detail-video/   # 📹 视频详情页面
├── 📁 packagePlayer/            # 播放器分包
│   └── 📁 pages/music-player/   # 🎧 音乐播放器页面
├── 📁 component/                # 自定义组件
│   ├── 📁 player/               # 🎵 播放器组件
│   ├── 📁 listSongsPage/        # 📋 歌曲列表组件
│   ├── 📁 nav-bar/              # 🧭 导航栏组件
│   ├── 📁 video-item/           # 📺 视频项组件
│   └── 📁 video-item2/          # 📺 视频项组件2
├── 📁 services/                 # API 服务层
│   ├── 📁 modules/              # API 模块
│   │   ├── 📄 discover.js       # 发现页 API
│   │   ├── 📄 search.js         # 搜索 API
│   │   ├── 📄 video.js          # 视频 API
│   │   ├── 📄 playList.js       # 歌单 API
│   │   └── 📄 bgmplay.js        # 音乐播放 API
│   ├── 📁 request/              # 请求封装
│   │   ├── 📄 index.js          # 请求类封装
│   │   └── 📄 config.js         # API 配置
│   └── 📄 index.js              # 服务入口
├── 📁 store/                    # 状态管理
│   ├── 📄 index.js              # Store 入口
│   └── 📄 RecommendNewMusic.js  # 推荐音乐状态
├── 📁 utils/                    # 工具函数
│   ├── 📄 util.js               # 通用工具
│   ├── 📄 formatNumber.js       # 数字格式化
│   ├── 📄 arrayHelpers.js       # 数组处理
│   └── 📄 format.wxs            # 格式化脚本
├── 📁 img/                      # 图片资源
├── 📁 lib/                      # 第三方库
│   └── 📄 dayjs.min.js          # 日期处理库
├── 📁 i18n/                     # 国际化
│   └── 📄 base.json             # 基础语言包
├── 📄 app.js                    # 小程序入口
├── 📄 app.json                  # 小程序配置
├── 📄 app.wxss                  # 全局样式
├── 📄 project.config.json       # 项目配置
└── 📄 sitemap.json              # 站点地图
```

---

## 🚀 快速开始

### 环境要求
- **微信开发者工具** 最新稳定版
- **Node.js** >= 14.0.0
- **npm** >= 6.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone [项目地址]
cd NetEaseCloud
```

2. **安装依赖**
```bash
npm install
```

3. **配置开发者工具**
   - 打开微信开发者工具
   - 导入项目，选择项目根目录
   - 配置 AppID（测试可使用测试号）

4. **构建 npm 包**
   - 在微信开发者工具中：`工具` → `构建 npm`
   - 等待构建完成

5. **配置网络域名**
   - **开发环境**：`详情` → `本地设置` → 勾选"不校验合法域名"
   - **生产环境**：在小程序后台配置合法域名

6. **启动项目**
   - 点击微信开发者工具的"编译"按钮
   - 项目将在模拟器中运行

### 配置说明

#### API 配置
```javascript
// services/request/config.js
export const baseURL = "http://150.158.43.187:3000"
```

#### 小程序配置
```json
// app.json
{
  "appid": "wx427c5808091313e0",
  "projectname": "音乐纯享版"
}
```

---

## 🔌 API 文档

### 发现页面 API
```javascript
// 获取轮播图
getMusicBanner(type = 0)

// 获取推荐歌单  
getPlaylistDetail(id = 3778678)

// 获取推荐新音乐
RecommendNewMusic()

// 获取热搜榜
getHotSearch()
```

### 音乐播放 API
```javascript
// 获取音乐详情
getBgmdetil(ids)

// 获取音乐播放链接
getSongUrl(id, level = "lossless")

// 获取歌词
getLyric(id)
```

### 搜索功能 API
```javascript
// 搜索音乐
getSearchResult(keywords)

// 获取搜索建议
getSuggestSearch(keywords)

// 获取热门搜索
getHotSearch()
```

### 视频功能 API
```javascript
// 获取热门 MV
getTopMV(offset = 0, limit = 20)

// 获取 MV 播放链接
getMVUrl(id)

// 获取 MV 详情
getMVInfo(mvid)
```

---

## 📱 页面展示

### 主要页面
- **🏠 发现页面**：音乐推荐、轮播图、热搜词
- **🔍 搜索页面**：实时搜索、历史记录、热门搜索
- **👤 个人中心**：用户信息、登录、个人收藏
- **🎵 播放页面**：音乐播放、歌词显示、播放控制
- **📺 视频页面**：MV 列表、视频播放
- **📋 歌单页面**：歌单详情、歌曲列表

### 特色功能
- **🎨 精美 UI**：仿网易云音乐的精美界面设计
- **🎵 流畅播放**：无缝的音乐播放体验
- **📱 响应式设计**：适配各种屏幕尺寸
- **⚡ 性能优化**：分包加载、懒加载等优化策略

---

## 🎯 核心功能详解

### 🎵 音乐播放器
- **播放控制**：支持播放、暂停、上一首、下一首
- **进度控制**：可拖拽的播放进度条
- **音质选择**：支持标准、高品质、无损等多种音质
- **循环模式**：单曲循环、列表循环、随机播放
- **后台播放**：支持小程序切换到后台继续播放

### 🔍 搜索系统
- **智能搜索**：支持歌曲名、歌手名、专辑名搜索
- **实时建议**：输入时实时显示搜索建议
- **历史记录**：自动保存最近5条搜索历史
- **热门搜索**：动态展示当前热门搜索词
- **搜索结果**：详细的搜索结果展示，包含歌曲信息、歌手、专辑等

### 📺 视频功能
- **MV 播放**：高清 MV 视频播放体验
- **弹幕系统**：实时弹幕评论功能
- **视频信息**：完整的 MV 信息展示
- **相关推荐**：基于当前视频的相关内容推荐
- **分类浏览**：按地区（内地、港台、欧美、日本、韩国）分类

---

## 🛡️ 性能优化

### 分包策略
```
主包 (pages/)           # 核心功能页面
├── 发现页面            # 首页内容
├── 搜索页面            # 搜索功能
├── 个人中心            # 用户相关
└── 歌单页面            # 歌单展示

视频分包 (packageVideo/) # 视频相关功能
└── 视频详情页面         # MV 播放页面

播放器分包 (packagePlayer/) # 播放器功能
└── 音乐播放器页面       # 专业播放器
```

### 加载优化
- **懒加载**：启用 `lazyCodeLoading` 按需加载组件
- **图片优化**：使用 `mode="aspectFill"` 优化图片显示
- **骨架屏**：为主要页面提供骨架屏加载效果
- **数据缓存**：合理使用本地存储缓存常用数据

---

## 🔧 开发指南

### 自定义组件开发
```javascript
// component/example/example.js
Component({
  properties: {
    // 组件属性
    title: {
      type: String,
      value: ''
    }
  },
  data: {
    // 组件内部数据
  },
  methods: {
    // 组件方法
    handleTap() {
      this.triggerEvent('tap', { /* 事件数据 */ })
    }
  }
})
```

### API 服务封装
```javascript
// services/modules/example.js
import { pcRequest } from "../request/index";

export function getExampleData(params) {
  return pcRequest.get({
    url: "/example",
    data: params
  });
}
```

### 状态管理使用
```javascript
// store/example.js
import { observable, action } from 'mobx-miniprogram'

export const exampleStore = observable({
  // 状态数据
  data: [],

  // 修改状态的方法
  setData: action(function(newData) {
    this.data = newData
  })
})
```

---

## 🐛 常见问题

### Q: 小程序无法启动？
**A:** 检查以下几点：
1. 确保已执行 `npm install`
2. 在微信开发者工具中构建 npm
3. 检查 AppID 配置是否正确
4. 确认网络域名配置

### Q: 音乐无法播放？
**A:** 可能的原因：
1. 网络域名未配置或被拦截
2. API 服务器连接异常
3. 音乐资源链接失效
4. 小程序音频权限未开启

### Q: 组件样式异常？
**A:** 解决方案：
1. 检查 Vant 组件是否正确引入
2. 确认 miniprogram_npm 目录存在
3. 重新构建 npm 包
4. 检查自定义样式是否冲突

### Q: 搜索功能异常？
**A:** 排查步骤：
1. 检查搜索 API 是否正常
2. 确认搜索关键词格式
3. 查看网络请求是否成功
4. 检查搜索结果数据结构

---

## 🚀 部署指南

### 开发环境部署
1. 配置微信开发者工具
2. 设置不校验合法域名
3. 构建 npm 包
4. 编译运行

### 生产环境部署
1. **域名配置**：在小程序后台配置 `request` 合法域名
2. **版本管理**：使用微信开发者工具上传代码
3. **审核发布**：提交审核并发布
4. **性能监控**：配置小程序性能监控

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

### 开发规范
- 遵循微信小程序开发规范
- 使用 ESLint 进行代码检查
- 组件命名采用 kebab-case
- 提交信息使用约定式提交格式

### 提交流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 许可证

本项目仅供学习交流使用，请勿用于商业用途。

---

## 🙏 致谢

- [网易云音乐](https://music.163.com/) - 提供音乐数据支持
- [Vant Weapp](https://vant-contrib.gitee.io/vant-weapp/) - 优秀的小程序 UI 组件库
- [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/) - 小程序开发平台
- [MobX](https://mobx.js.org/) - 状态管理解决方案
- [Day.js](https://dayjs.gitee.io/) - 轻量级日期处理库

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐️**

Made with ❤️ for Music Lovers

</div>
