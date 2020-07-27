// components/skipHome/skipHome.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    top: 300,
    // right: 0,
    left: '',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    skipToIndex: function () {
      wx.switchTab({
        url: '../../index/index',
      })
    },
    // 获取鼠标位置
    getPosition: function (e) {
      var windowWidth;
      var windowHeight;
      wx.getSystemInfo({
        success: function (res) {
          windowWidth = res.windowWidth - 55;
          windowHeight = res.windowHeight - 55;
        },
      })
      let distanceLeft = e.touches[0].clientX;
      let distanceTop = e.touches[0].clientY;
      if (distanceLeft > windowWidth) {
        distanceLeft = windowWidth;
      } else if (distanceLeft < 27.5) {
        distanceLeft = 0;
      } else {
        distanceLeft -= 27.5;
      }
      if (distanceTop > windowHeight) {
        distanceTop = windowHeight;
      } else if (distanceTop < 27.5) {
        distanceTop = 0;
      } else {
        distanceTop -= 27.5;
      }
      this.setData({
        top: distanceTop,
        left: distanceLeft,
        // right: '',
      })
    },
  }
})
