// getCoupon.js
var server = require('../../../../../utils/server');
Page({
  data: {},
  clickIndex:function(){
    wx.navigateBack({
      delta:2
    })
  },
  success: function () {
    wx.reLaunch({
      url:"/pages/index/index"
    })
  },
})