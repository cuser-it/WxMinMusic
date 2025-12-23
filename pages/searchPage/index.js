// pages/searchPage/index.js
// 导入公共方法
const { addUniqueItemToArray } = require("../../utils/arrayHelpers");
import {
  getHotSearch,
  getSuggestSearch,
  getSearchResult,
} from "../../services/index";

import { playerStore } from "../../store/playerStore";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    songName: "",
    timer: null,
    History: [
      "野花做了玫瑰的梦",
      "薛之谦",
      "猪猪侠主题曲",
      "好看的你那么不自知",
      "我的滑板鞋",
      6,
      "淋雨一直走",
      "女孩dj版",
    ],
    SearchHto: [],
    lookupSongs: [],
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchHotSearchWords();
    this.loadSearchHistory();
  },

  /**
   * 获取热搜词
   */
  fetchHotSearchWords: function () {
    getHotSearch().then((res) => {
      this.setData({
        SearchHto: res.result.hots,
        loading: false,
      });
    });
  },

  /**
   * 从本地存储加载搜索历史记录
   */
  loadSearchHistory: function () {
    const history = wx.getStorageSync("History")
      ? JSON.parse(wx.getStorageSync("History"))
      : [];
    this.setData({
      History: history,
    });
  },

  /**
   * 获取歌曲名称和索引，更新搜索历史记录
   */
  getSongName: function (e) {
    const { songvalue, ix } = e.currentTarget.dataset;
    const valueToAdd = songvalue || ix;
    if (!valueToAdd)
      return wx.showToast({
        title: "没有提供有效的搜索关键词",
        icon: "none",
      });
    this.setData({
      songName: valueToAdd,
    });
    this.updateSearchHistory(valueToAdd);
    this.searchSongs(valueToAdd);
  },

  /**
   * 更新搜索历史记录到本地存储并更新页面数据
   */
  updateSearchHistory: function (newItem) {
    let history = this.data.History;
    if (history.includes(newItem))
      history = history.filter((item) => item !== newItem);
    history.unshift(newItem);
    wx.setStorageSync("History", JSON.stringify(history));
    this.setData({
      History: history,
    });
  },

  /**
   * 调用API方法搜索歌曲并更新歌曲列表
   */
  searchSongs: function (query) {
    //调用搜索方法
    getSearchResult(query).then((res) => {
      if (res.result && res.result.songs) {
        this.setData({
          lookupSongs: res.result.songs,
        });
        wx.showToast({
          title: "搜索成功！！！",
          icon: "none",
        });
      } else {
        wx.showToast({
          title: "没有找到该资源！！！！",
          icon: "none",
        });
      }
    });
  },

  /**
   * 删除单个搜索历史记录项
   */
  getslice(e) {
    const index = e.currentTarget.dataset.ix;
    let history = this.data.History;
    history.splice(index, 1);
    this.updateSearchHistoryDirectly(history);
  },
  //取消搜索
  onCancel(e) {
    this.data.lookupSongs = "";
    this.setData({
      lookupSongs: this.data.lookupSongs,
    });
  },
  /**
   * 直接更新搜索历史，不进行重复检查
   */
  updateSearchHistoryDirectly: function (newHistory) {
    wx.setStorageSync("History", JSON.stringify(newHistory));
    this.setData({
      History: newHistory,
    });
  },

  /**
   * 清空搜索历史记录
   */
  deleteSearchHistory() {
    wx.clearStorage();
    this.setData({
      History: [],
    });
    wx.showToast({
      title: "总觉得拥有太少，是因为总想拥有太多",
      icon: "none",
    });
  },

  /**
   * 处理搜索输入框的输入，更新搜索历史并执行搜索
   */
  getSearch(e) {
    const input = e.detail.trim();
    if (!input)
      return wx.showToast({
        title: "输入不能为空",
        icon: "none",
      });

    this.updateSearchHistory(input);
    this.searchSongs(input);
  },
  // 获取歌曲id
  getlogs(e) {
    let musicId = e.currentTarget.dataset.songid;
    const playlist = this.data.lookupSongs;
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
});
