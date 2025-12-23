// pages/PlayDetailsPage/index.js
const bgm = wx.getBackgroundAudioManager();
import { getBgmdetil, getLyric, getSongUrl } from "../../services/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0, //页码（播放页0/歌词页1）
    startTime: "00:00", //当前播放时间
    endTime: "00:00", //距离结束时间
    slidermaxVal: 999, //滑块最大值
    sliderVal: 0, //播放进度默认长度
    isPlaying: true, // 初始状态为播放
    bgmsrc: "", //在线音乐src
    bgmid: "33894312", //默认音乐id 以防无数据进入页面
    currentTime: 0, //播放时间 单位秒
    lyricitems: "", //歌词
    parsedLRC: "", //全部歌词
    currentLyricIndex: -1, // 初始没有歌词行被选中
    songs: [], //歌曲数据
  },

  /**
   * 生命周期函数--监听页面加载
   */

  async onLoad(options) {
    if (options.musicid !== undefined || null || "") {
      this.setData({
        bgmid: options.musicid,
      });
    }
    let id = this.data.bgmid;
    //获取音乐详情（歌名，歌手，专辑，以及歌曲封面）
    const res = await getBgmdetil(id);
    //获取音乐url
    const getUrl = await getSongUrl(id);
    //获取歌词
    const lyric = await getLyric(id);
    const parsedLRC = this.parseLRC(lyric.lrc.lyric); // 解析LRC格式的歌词
    wx.setNavigationBarTitle({
      title: res.songs[0].name,
    });
    //赋值音乐url
    this.setData({
      bgmsrc: getUrl.data[0].url,
      parsedLRC: parsedLRC, // 确保 parsedLRC 以数组形式存在
      songs: res,
    });
    if (parsedLRC == "") {
      let rrrs = ["没有歌词"];
      this.setData({
        parsedLRC: rrrs,
      });
    }
    (bgm.src = this.data.bgmsrc), //歌曲地址
      bgm.play(),
      (bgm.title = res.songs[0].name), // 歌名
      (bgm.epname = res.songs[0].al.name), // 专辑名称
      (bgm.singer = res.songs[0].ar[0].name), // 歌手
      (bgm.coverImgUrl = res.songs[0].al.picUrl); // 歌曲图片地址
    // bgm.startTime = 0 //当前播放时间的位置（单位秒）
    // 进度条逻辑处理
    bgm.onTimeUpdate((res) => {
      let currentTime = bgm.currentTime; //当前时长
      this.setData({
        currentTime: currentTime,
      });
      const parsedLRC = this.parseLRC(lyric.lrc.lyric); // 解析LRC格式的歌词
      const currentLyric = this.findCurrentLyric(
        parsedLRC,
        this.data.currentTime
      ); // 根据当前播放时间查找歌词
      let totalTime = bgm.duration; //总时长
      let endTime = totalTime - currentTime; //剩余时长
      const index = this.findCurrentLyricIndex(currentTime); // 找到当前歌词索引
      this.setData({
        startTime: this.timeFormate(currentTime),
        endTime: this.timeFormate(endTime),
        slidermaxVal: totalTime,
        sliderVal: currentTime,
        lyricitems: currentLyric,
        parsedLRC: parsedLRC,
        currentLyricIndex: index,
      });
      if (this.data.endTime == "00:00") {
        bgm.play();
      }
    });
    // 监听歌曲播放结束事件
    bgm.onEnded(() => {
      // 重播当前歌曲
      bgm.stop(); // 先停止当前播放
      bgm.src = bgm.src; // 重新设置src，也可以不改变src直接播放
      bgm.play();
    });
  },
  //匹配歌词高亮
  findCurrentLyricIndex: function (currentTime) {
    if (
      !Array.isArray(this.data.parsedLRC) ||
      this.data.parsedLRC.length === 0
    ) {
      return -1; // 如果parsedLRC不是数组或为空数组，返回-1
    }
    let index = this.data.parsedLRC.findIndex((lyric, i, lyrics) => {
      // 检查当前歌词行是否是数组中的最后一行
      const isLastLyric = i === lyrics.length - 1;
      // 如果是最后一行歌词，只需判断currentTime是否大于等于当前行的time
      if (isLastLyric) {
        return currentTime >= lyric.time;
      } else {
        // 对于非最后一行，还需要判断currentTime是否小于下一行的time
        const nextLyricTime = lyrics[i + 1].time;
        return currentTime >= lyric.time && currentTime < nextLyricTime;
      }
    });
    return index;
  },
  // 获取当前的页数0是封面1是歌词
  handleSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current,
    });
  },
  // 获取进度条的长度
  getsongSlider(e) {
    const currentTime = e.detail.value;
    this.setData({
      sliderVal: currentTime,
    });
    bgm.seek(currentTime);
  },
  //时间处理方法
  timeFormate(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    min = this.zeroFill(min);
    sec = this.zeroFill(sec);
    return min + ":" + sec;
  },
  //补零操作
  zeroFill(time) {
    let zeroFill = time < 10 ? "0" + time : time;
    return zeroFill;
  },
  //暂停播放
  zanting() {
    if (this.data.isPlaying) {
      bgm.pause();
    } else {
      bgm.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying,
    });
  },
  //歌词处理方法
  parseLRC(lrcContent) {
    const lines = lrcContent.split("\n"); // 将歌词字符串分割成单独的行
    const pattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/; // 修改正则以匹配毫秒可能为两位或三位数字的情况
    const lrcData = lines
      .map((line) => {
        const match = line.match(pattern);
        if (match) {
          // 将时间转换为秒。注意，如果毫秒为三位数，直接除以1000；如果为两位数，除以100
          const time =
            parseInt(match[1], 10) * 60 +
            parseInt(match[2], 10) +
            parseInt(match[3], 10) / (match[3].length === 3 ? 1000 : 100);
          return {
            time,
            text: match[4].trim(), // 使用trim()去除可能的首尾空格
          };
        }
        return null;
      })
      .filter((item) => item); // 过滤掉所有未匹配的行（null）

    return lrcData;
  },
  // 根据当前播放时间找到对应的歌词行的函数
  findCurrentLyric(lrcData, currentTime) {
    if (lrcData != "") {
      // 遍历解析后的歌词数组
      for (let i = 0; i < lrcData.length - 1; i++) {
        // 检查当前时间是否在当前歌词行和下一行歌词之间
        if (
          currentTime >= lrcData[i].time &&
          currentTime < lrcData[i + 1].time
        ) {
          return lrcData[i].text; // 返回当前时间对应的歌词文本
        }
      }
      // 如果当前时间超过了最后一行歌词的时间，返回最后一行歌词
      if (currentTime >= lrcData[lrcData.length - 1].time) {
        return lrcData[lrcData.length - 1].text;
      }
    }
    return "没有歌词"; // 如果没有找到对应的歌词行，返回空字符串
  },
});
