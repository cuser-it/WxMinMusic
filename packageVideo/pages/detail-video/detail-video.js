// pages/detail-video/detail-video.js
import { getMVUrl, getMVInfo, getMVRelated } from "../../../services/index";
import { audioContext } from "../../../store/playerStore";

Page({
  data: {
    id: -1,
    mvUrl: "",
    mvInfo: {},
    relatedVideo: [],
    danmuList: [
      { text: "哈哈哈, 真好听", color: "#ff0000", time: 3 },
      { text: "呵呵呵, 不错哦", color: "#ffff00", time: 10 },
      { text: "嘿嘿嘿, 好喜欢", color: "#0000ff", time: 15 },
    ],
  },
  onLoad(options) {
    const id = options.id;
    this.setData({ id });

    // Pause music when MV page loads
    audioContext.pause();

    // 请求数据
    this.fetchMVUrl();
    this.fetchMVInfo()
    this.fetchMVRelated()
  },

  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id);
    this.setData({ mvUrl: res.data.url });
  },
  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    this.setData({ mvInfo: res.data })
  },
  async fetchMVRelated() {
    const res = await getMVRelated(this.data.id)
    this.setData({ relatedVideo: res.data })

  },


});
