// components/nav-bar/nav-bar.js
const app = getApp();
Component({
  options: {
    multipleSlots: true,
  },
  data: {
    statusBarHeight: 20,
  },
  properties: {
    title: {
      type: String,
      value: "导航标题",
    },
  },
  lifetimes: {
    attached() {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    },
  },
  methods: {
    onLeftClick() {
      this.triggerEvent("leftclick")
    }
  }
});
