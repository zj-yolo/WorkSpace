var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},
  onLoad: function(res) {
    var utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.video&vid=' + res.id,
      method: 'GET',
      data: {
        utoken: utoken
      },
      success: function(res) {
        that.setData({
          data: res.data.result,
          img: res.data.result.thumb
        });
      }
    })

  },
  onShareAppMessage: function() {
    var that = this;
    return {
      // title: that.data.goods.goods.goods_name,
      path: '/packageA/pages/video/detail/index?id=' + that.data.data.id,
      imageUrl: that.data.img,
    }
  },
})