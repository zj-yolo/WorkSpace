var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    refresh: false,
  },
  onLoad: function(res) {
    var that = this;
    console.log(res);
    that.setData({
      mid: res.mid
    })
    that.loadPageData();
  },
  toDetail: function(res) {
    wx.navigateTo({
      url: "../detail/index?id=" + res.currentTarget.dataset.id
    })
  },
  loadPageData: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.activity.bargin.act',
      data: {
        mid: that.data.mid,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        that.setData({
          data: res.data.result,
        })
      }
    })
  },
  tobargain: function(res) {
    var that = this;
    wx.navigateTo({
      url: "../bargain/index?id=" + res.currentTarget.dataset.id + "&mid=" + that.data.mid
    })
  }

})