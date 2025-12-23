
Component({
  storeBindings: {
    //数据源
    // store,
    fields: {
      nums: 'nums',
      numB: 'numB',
      sum: 'sum'
    },
    actions: {
      updataNum2: 'updateNum2'
    }
  },
  properties: {},
  data: {
    value: 25,
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24'
    },
    Pause: true,
    rotateIndex: 1,
    animationData: {}
  },
  methods: {
    PlayPause() {
      var playing = this.data.Pause;
      var animation = wx.createAnimation({
        duration: 2000,
        timingFunction: 'linear'
      });

      if (playing) {
        this.timeInterval = setInterval(() => {
          this.setData({
            rotateIndex: this.data.rotateIndex + 1
          });
          animation.rotate(60 * (this.data.rotateIndex - 1)).step();
          this.setData({
            animationData: animation.export()
          });
        }, 2000);
      } else {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }

      this.setData({
        Pause: !playing
      });
    }
  }
});