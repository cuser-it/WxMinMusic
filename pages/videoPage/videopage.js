// pages/main-video/mian-video.js
import {
  getTopMV,
  getTopOtherMV
} from "../../services/modules/video";
Page({
  data: {
    videoList: [],
    RTHKVideoList: [],
    EAVideoList: [],
    JPVideoList: [],
    KoreaVideoList: [],
    offset: 0,
    hasMore: true,
    loading: true
  },
  onLoad() {
    // 发送网络请求
    this.fetchTopMV();
    this.fetchTopOtherMV("RTHKVideoList");
    this.fetchTopOtherMV("EAVideoList", "欧美");
    this.fetchTopOtherMV("JPVideoList", "日本");
    this.fetchTopOtherMV("KoreaVideoList", "韩国");
  },
  // 发送网络请求的方法
  async fetchTopMV() {
    // 获取数据
    const res = await getTopMV(this.data.offset);
    // 将新数据push到原来的数据
    const newVideoList = [...this.data.videoList, ...res.data];
    // 设置全新的数据
    this.setData({
      videoList: newVideoList,
      loading:false
    });
    this.data.offset = this.data.videoList.length;
    this.data.hasMore = res.hasMore;
  },
  async fetchTopOtherMV(list, area) {
    // 获取数据
    const res = await getTopOtherMV(this.data.offset, 30, area);
    // 将新数据push到原来的数据
    const newVideoList = [...this.data[list], ...res.data];
    // 设置全新的数据
    this.setData({
      [list]: newVideoList
    });
    this.data.offset = this.data[list].length;
    this.data.hasMore = res.hasMore;
    
  },
  // =================  监听上拉和下拉功能  =================
  onReachBottom() {
    // 判断是否有更多数据
    if (!this.data.hasMore) return;
    // 如果有更多数据, 再请求新的数据
    this.fetchTopMV();
  },
  async onPullDownRefresh() {
    // 清空原来的数据
    this.setData({
      videoList: []
    });
    this.data.offset = 0;
    this.data.hasMore = true;
    //重新请求数据
    await this.fetchTopMV();
    //  停止下拉刷新
    wx.stopPullDownRefresh();
  },
});