// pages/personage/personage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginShow: false,
    showsele: false,
    message: "",
  },
  ck2(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/listPage/index",
    });
  },
  ck1() {
    wx.navigateTo({
      url: "/pages/listPage/index",
    });
  },
  // 输入框输入事件 获取输入框的值
  onInput: function (event) {
    this.setData({
      message: event.detail.value,
    });
  },
  c1() {
    if (this.data.loginShow == true) {
      this.setData({
        loginShow: false,
      });
    } else {
      this.setData({
        loginShow: true,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
