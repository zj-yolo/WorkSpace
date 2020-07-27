var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
    	url: '?r=wxapp.sns',
      data:{utoken:utoken},
    	method: 'GET',
    	success: function(res) {
           that.setData({
             data:res.data.result
           })
      }
    });
  },
  toList:function(res){
    wx.navigateTo({
      url:"../list/index/index?id="+res.currentTarget.dataset.id
    })
  },
  toplate:function(res){
    wx.navigateTo({
      url:"../plate/index?id="+res.currentTarget.dataset.id
    })
  },
  plate:function(res){
    wx.navigateTo({
      url:"../plate/index"
    })
  },
})
