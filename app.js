// app.js
App({
  globalData: {
    userInfo: null, // 示例全局数据
    anvalue: "这是另一个全局变量",
  },
  onLaunch: function () {
    // 小程序启动之后 触发
    const info = wx.getWindowInfo()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight

    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio

    // Calculate content height (assuming nav bar is 44px)
    this.globalData.contentHeight = info.screenHeight - info.statusBarHeight - 44
  },
  onShow: function (options) {
    // 小程序显示时触发
  },
  onHide: function () {
    // 小程序隐藏时触发
  },
  globalMethod: function () {
    // 定义全局方法
  },
});
