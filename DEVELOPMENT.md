# 🛠️ 开发文档

## 📋 目录
- [项目架构](#项目架构)
- [开发环境搭建](#开发环境搭建)
- [代码规范](#代码规范)
- [组件开发](#组件开发)
- [API 接口](#api-接口)
- [状态管理](#状态管理)
- [样式指南](#样式指南)
- [调试技巧](#调试技巧)

---

## 🏗️ 项目架构

### 整体架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│      Layer      │    │     Logic       │    │     Layer       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│   Pages/WXML    │◄──►│   Services      │◄──►│   Network API   │
│   Components    │    │   Utils         │    │   Local Storage │
│   Styles/WXSS   │    │   Store/MobX    │    │   Cache         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 分层说明
- **表现层**：页面、组件、样式
- **业务逻辑层**：服务封装、工具函数、状态管理
- **数据层**：网络请求、本地存储、缓存管理

---

## 🚀 开发环境搭建

### 1. 环境要求
```bash
Node.js >= 14.0.0
npm >= 6.0.0
微信开发者工具 >= 1.06.0
```

### 2. 项目初始化
```bash
# 克隆项目
git clone [项目地址]
cd NetEaseCloud

# 安装依赖
npm install

# 启动开发
# 在微信开发者工具中打开项目
```

### 3. 开发者工具配置
```json
{
  "setting": {
    "urlCheck": false,           // 开发时不校验域名
    "es6": true,                // 启用 ES6 转换
    "enhance": true,            // 启用增强编译
    "postcss": true,            // 启用 PostCSS
    "minified": false,          // 开发时不压缩
    "newFeature": true          // 启用新特性
  }
}
```

---

## 📝 代码规范

### JavaScript 规范
```javascript
// ✅ 推荐写法
const getUserInfo = async (userId) => {
  try {
    const response = await api.getUser(userId)
    return response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

// ❌ 不推荐写法
function getUserInfo(userId, callback) {
  api.getUser(userId, function(res) {
    if (res.success) {
      callback(res.data)
    }
  })
}
```

### 命名规范
```javascript
// 文件命名：kebab-case
music-player.js
user-profile.wxml

// 变量命名：camelCase
const musicList = []
const currentPlayIndex = 0

// 常量命名：UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3

// 组件命名：PascalCase
<MusicPlayer />
<UserProfile />
```

### WXML 规范
```xml
<!-- ✅ 推荐写法 -->
<view class="music-item" 
      wx:for="{{musicList}}" 
      wx:key="id"
      bind:tap="onMusicTap"
      data-music-id="{{item.id}}">
  <image class="music-cover" src="{{item.coverUrl}}" />
  <text class="music-title">{{item.title}}</text>
</view>

<!-- ❌ 不推荐写法 -->
<view class="musicItem" wx:for="{{musicList}}" wx:key="index" bindtap="onMusicTap">
  <image src="{{item.coverUrl}}"></image>
  <text>{{item.title}}</text>
</view>
```

---

## 🧩 组件开发

### 自定义组件结构
```
component/
├── music-player/
│   ├── music-player.js      # 组件逻辑
│   ├── music-player.json    # 组件配置
│   ├── music-player.wxml    # 组件模板
│   ├── music-player.wxss    # 组件样式
│   └── music-player.less    # 样式源文件（可选）
```

### 组件开发模板
```javascript
// music-player.js
Component({
  // 组件属性
  properties: {
    musicInfo: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {
        // 属性变化监听
        this.updateMusicInfo(newVal)
      }
    },
    autoPlay: {
      type: Boolean,
      value: false
    }
  },

  // 组件数据
  data: {
    isPlaying: false,
    currentTime: 0,
    duration: 0
  },

  // 组件生命周期
  lifetimes: {
    attached() {
      // 组件实例进入页面节点树时执行
      this.initPlayer()
    },
    detached() {
      // 组件实例被从页面节点树移除时执行
      this.destroyPlayer()
    }
  },

  // 组件方法
  methods: {
    // 播放/暂停
    togglePlay() {
      const { isPlaying } = this.data
      this.setData({ isPlaying: !isPlaying })
      
      // 触发自定义事件
      this.triggerEvent('playStateChange', {
        isPlaying: !isPlaying
      })
    },

    // 更新音乐信息
    updateMusicInfo(musicInfo) {
      if (!musicInfo || !musicInfo.id) return
      
      this.setData({
        currentTime: 0,
        duration: musicInfo.duration || 0
      })
    },

    // 初始化播放器
    initPlayer() {
      this.audioContext = wx.createInnerAudioContext()
      this.audioContext.onPlay(() => {
        this.setData({ isPlaying: true })
      })
      this.audioContext.onPause(() => {
        this.setData({ isPlaying: false })
      })
    },

    // 销毁播放器
    destroyPlayer() {
      if (this.audioContext) {
        this.audioContext.destroy()
      }
    }
  }
})
```

### 组件配置
```json
{
  "component": true,
  "usingComponents": {
    "van-icon": "@vant/weapp/icon/index",
    "van-slider": "@vant/weapp/slider/index"
  }
}
```

---

## 🔌 API 接口

### 请求封装
```javascript
// services/request/index.js
class PCRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  request(options) {
    const { url, data, method = 'GET', header = {} } = options
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        data,
        method,
        header: {
          'Content-Type': 'application/json',
          ...header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`请求失败: ${res.statusCode}`))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  get(options) {
    return this.request({ ...options, method: 'GET' })
  }

  post(options) {
    return this.request({ ...options, method: 'POST' })
  }
}

export const pcRequest = new PCRequest(baseURL)
```

### API 模块示例
```javascript
// services/modules/music.js
import { pcRequest } from '../request/index'

// 获取音乐详情
export function getMusicDetail(id) {
  return pcRequest.get({
    url: '/song/detail',
    data: { ids: id }
  })
}

// 获取音乐播放链接
export function getMusicUrl(id, quality = 'standard') {
  return pcRequest.get({
    url: '/song/url',
    data: { id, br: quality }
  })
}

// 获取歌词
export function getLyrics(id) {
  return pcRequest.get({
    url: '/lyric',
    data: { id }
  })
}

// 搜索音乐
export function searchMusic(keywords, limit = 20, offset = 0) {
  return pcRequest.get({
    url: '/search',
    data: {
      keywords,
      limit,
      offset,
      type: 1 // 1: 单曲
    }
  })
}
```

---

## 🗃️ 状态管理

### MobX Store 示例
```javascript
// store/musicStore.js
import { observable, action, computed } from 'mobx-miniprogram'

export const musicStore = observable({
  // 状态数据
  currentMusic: null,
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  playMode: 'list', // list, single, random

  // 计算属性
  get hasNext() {
    return this.currentIndex < this.playlist.length - 1
  },

  get hasPrev() {
    return this.currentIndex > 0
  },

  // 修改状态的方法
  setCurrentMusic: action(function(music) {
    this.currentMusic = music
  }),

  setPlaylist: action(function(playlist) {
    this.playlist = playlist
  }),

  setPlayState: action(function(isPlaying) {
    this.isPlaying = isPlaying
  }),

  // 播放下一首
  playNext: action(function() {
    if (this.playMode === 'random') {
      this.currentIndex = Math.floor(Math.random() * this.playlist.length)
    } else if (this.hasNext) {
      this.currentIndex += 1
    } else if (this.playMode === 'list') {
      this.currentIndex = 0
    }
    this.currentMusic = this.playlist[this.currentIndex]
  }),

  // 播放上一首
  playPrev: action(function() {
    if (this.playMode === 'random') {
      this.currentIndex = Math.floor(Math.random() * this.playlist.length)
    } else if (this.hasPrev) {
      this.currentIndex -= 1
    } else if (this.playMode === 'list') {
      this.currentIndex = this.playlist.length - 1
    }
    this.currentMusic = this.playlist[this.currentIndex]
  })
})
```

### 在页面中使用 Store
```javascript
// pages/music-player/music-player.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { musicStore } from '../../store/musicStore'

Page({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store: musicStore,
    fields: {
      currentMusic: 'currentMusic',
      isPlaying: 'isPlaying',
      hasNext: 'hasNext',
      hasPrev: 'hasPrev'
    },
    actions: {
      setPlayState: 'setPlayState',
      playNext: 'playNext',
      playPrev: 'playPrev'
    }
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  // 播放/暂停
  onPlayToggle() {
    this.setPlayState(!this.data.isPlaying)
  },

  // 下一首
  onNext() {
    this.playNext()
  },

  // 上一首
  onPrev() {
    this.playPrev()
  }
})
```

---

## 🎨 样式指南

### WXSS 组织结构
```scss
/* 全局样式变量 */
:root {
  --primary-color: #d33a31;
  --secondary-color: #f5f5f5;
  --text-color: #333;
  --text-secondary: #999;
  --border-color: #e5e5e5;
  --border-radius: 8rpx;
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
}

/* 基础样式 */
.container {
  padding: var(--spacing-md);
  background-color: var(--secondary-color);
}

.card {
  background: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 文字样式 */
.text-primary {
  color: var(--text-color);
  font-size: 32rpx;
  font-weight: 500;
}

.text-secondary {
  color: var(--text-secondary);
  font-size: 28rpx;
}

/* 布局样式 */
.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### 响应式设计
```scss
/* 适配不同屏幕尺寸 */
@media (max-width: 750rpx) {
  .music-item {
    flex-direction: column;
  }
}

/* 适配深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #fff;
    --secondary-color: #1a1a1a;
  }
}
```

---

## 🐛 调试技巧

### 1. 控制台调试
```javascript
// 在代码中添加调试信息
console.log('音乐信息:', musicInfo)
console.error('播放失败:', error)

// 使用 wx.showToast 显示调试信息
wx.showToast({
  title: `当前状态: ${isPlaying ? '播放中' : '暂停'}`,
  icon: 'none'
})
```

### 2. 网络请求调试
```javascript
// 在请求前后添加日志
const request = (options) => {
  console.log('发起请求:', options)
  
  return wx.request({
    ...options,
    success: (res) => {
      console.log('请求成功:', res)
      options.success && options.success(res)
    },
    fail: (error) => {
      console.error('请求失败:', error)
      options.fail && options.fail(error)
    }
  })
}
```

### 3. 性能调试
```javascript
// 使用 Performance API 监控性能
const startTime = Date.now()

// 执行耗时操作
await loadMusicList()

const endTime = Date.now()
console.log(`加载音乐列表耗时: ${endTime - startTime}ms`)
```

### 4. 真机调试
- 使用微信开发者工具的真机调试功能
- 在手机上安装微信开发版
- 扫码进行真机调试和性能分析

---

## 📚 参考资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Vant Weapp 组件库](https://vant-contrib.gitee.io/vant-weapp/)
- [MobX 状态管理](https://mobx.js.org/)
- [小程序性能优化指南](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/)

---

**持续更新中... 如有问题请提交 Issue 📝**
