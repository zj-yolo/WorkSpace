var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},
  onLoad: function () {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    that.loadingData();
  },
  loadingData:function(){
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url:"?r=wxapp.creditshop.log",
      data:{
        utoken:utoken
      },
      method:"GET",
      success:function(res){
        console.log(res);
        that.setData({
          data:res.data.result
        })
      }
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  toreceived:function(res){
    console.log(res.currentTarget.dataset.id);
    wx.navigateTo({
      url:"../received/index?id="+res.currentTarget.dataset.id
    })
  }
})