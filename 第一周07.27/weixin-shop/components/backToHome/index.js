// components/loading/index.js
var time = null;
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
    shareyesno: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backToIndex: function () {
      wx.switchTab({
        url: '../../index/index',
      })
    },
  }
})
