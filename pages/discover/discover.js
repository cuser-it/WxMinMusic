import {
  RecommendNewMusic,
  getMusicBanner,
  getSongMenuList,
  getPlaylistDetail,
  getHotSearch,
} from "../../services/index";

const { formatNumber } = require("../../utils/formatNumber.js");
import playerStore from "../../store/playerStore";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Yklogin: "",
    Banner: "",
    resource: [],
    Music1: [],
    Music2: [],
    isAnimating: false,
    animationData: {},
    rotateDegree: 0, // 初始旋转角度为0
    TJmusicIndex: 0,
    tips: "音符跳跃，旋律洗净心灵尘埃。",
    tips2: "", // 存放热搜词
    randomNumber: 0, // 随机数，初始化为0
    timer: null, // 定时器
    tipsll: [
      "音符跳跃，旋律洗净心灵尘埃。",
      "每首歌，是时间的密语，唤醒记忆的温柔。",
      "耳边旋律，遥远星空下的安慰。",
      "音乐里，藏着逝去时光的秘密。",
      "旋律流转，心灵的角落被温暖照亮。",
      "一曲高歌，释放内心的激情与自由。",
      "静听一曲，让灵魂与世界和谐相融。",
      "音乐，是沉默时最美的对话。",
      "旋律如画，绘出生命中的色彩斑斓。",
      "在音乐中旅行，寻找心灵的归宿。",
    ],
    loading: true,
  },
  ontips: function () {
    // 生成1到10之间的随机整数
    var randomNumber = Math.floor(Math.random() * 10) + 1;
    this.setData({
      tips: this.data.tipsll[randomNumber],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.ontips();
    //首页轮播图
    getMusicBanner()
      .then((res) => {
        let banners = res.banners;
        this.setData({
          Banner: banners,
        });
      })
      .catch((err) => { });
    // 获取推荐歌单
    getPlaylistDetail().then((res) => {
      //截取前十条使用
      let resource = res.result.slice(0, 7);
      // 处理每条数据中的数字
      let processedData = resource.map((item) => {
        if (item.hasOwnProperty("playCount")) {
          item["playCount"] = formatNumber(item["playCount"]);
        }
        return item;
      });
      //更新处理后的数据
      this.setData({
        resource: processedData,
      });
    });
    //获取推荐音乐
    RecommendNewMusic().then((res) => {
      let Music1 = res.result.slice(0, 3);
      let Music2 = res.result.slice(3, 6);
      this.setData({
        Music1: Music1,
        Music2: Music2,
        loading: false,
      });
    });
    //获取音乐详情
    getSongMenuList().then((res) => { });
    // 搜索热词
    getHotSearch().then((res) => {
      // 生成0到9之间的随机整数，因为数组是从0开始的
      this.data.randomNumber = Math.floor(Math.random() * 10);
      this.setData({
        tips2: res.result.hots[this.data.randomNumber].first,
      });

      // 每隔一秒随机数加一
      this.data.timer = setInterval(() => {
        this.updateRandomNumber(res.result.hots);
      }, 3000);
    });
  },
  updateRandomNumber(hots) {
    // 随机数加一，如果加到9了，则重置为0
    this.data.randomNumber = (this.data.randomNumber + 1) % 10;
    this.setData({
      tips2: hots[this.data.randomNumber].first,
    });
  },
  getmusicId(e) {
    let musicId = e.currentTarget.dataset.musicid;
    wx.navigateTo({
      url: `/pages/ls/ls?musicid=${musicId}`,
    });
  },
  getmusicUrlID(e) {
    let musicId = e.currentTarget.dataset.musicid;

    // Create playlist from Music1 and Music2
    const playlist = [...this.data.Music1, ...this.data.Music2];
    const index = playlist.findIndex(item => item.id == musicId);

    if (index !== -1) {
      playerStore.setPlaySongList(playlist);
      playerStore.setPlaySongIndex(index);
      playerStore.playMusicWithSongIdAction(musicId);

      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/music-player?id=${musicId}`,
      });
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },
});
