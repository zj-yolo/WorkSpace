var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
  },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that= this;
    that.loadingData(options);
  },
  loadingData:function(options){
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url:"?r=wxapp.creditshop.creditlog",
      data:{
        utoken:utoken
      },
      method:"GET",
      success:function(res){
        that.setData({
          credit:options.credit,
          data:res.data.result
        })
      }
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  torecording:function(){
    wx.navigateTo({
      url:"../recording/index"
    })
  },
})