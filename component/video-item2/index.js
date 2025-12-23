// components/video-list-item2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      default: {},
    },
  },
  methods: {
    onItemTap() {
      const id = this.properties.itemInfo.vid;
      wx.showToast({
        title: id,
        icon: "none",
      });
    },
  },
});
