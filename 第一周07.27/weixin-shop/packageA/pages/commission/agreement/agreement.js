var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
var app = getApp(), utoken = wx.getStorageSync("utoken");
Page({
  data: {
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    var that =this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=wxapp.commission.register.getApplyContent&utoken=" + utoken,
      data: {},
      method: "GET",
      success: function (res) {
        if (res.data.result.applycontent){
          WxParse.wxParse('article', 'html', res.data.result.applycontent, that, 5);
      }
        that.setData({
          applycontent: res.data.result.applycontent
        })
      }
    })   
  }, 
})