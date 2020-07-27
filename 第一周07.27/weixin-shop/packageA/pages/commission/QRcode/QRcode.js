var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");

var app = getApp();
Page({
  data: {
    loading: true,
    img: '',
    name: '',
    data: '',
    shareIcon: false
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    if (options.share) {
      this.setData({
        shareIcon: true
      })
    }
    var that = this;

    if (options.mid) {
      that.setData({ mid: options.mid, });
      var midX = wx.setStorageSync("mid", options.mid);
      var midZ = wx.getStorageSync("mid");
    }
    console.log(options);
    server.sendRequest({
      url: '?r=wxapp.commission.qrcode&utoken=' + utoken + '&mid=' + options.mid,
      showToast: false,
      method: "POST",
      data: '',
      success: function (res) {
        var data = res.data.result;
        that.setData({
          loading: false,
          data: data
        });
      },
      fail: function (res) {
      }
    })
    that.setData({
      mid: options.mid
    })
  },
  previewImage: function (res) {
    var that = this;
    var arr = [];
    arr.push(res.currentTarget.dataset.src)
    wx.previewImage({
      urls: arr
    })
  },
  onShareAppMessage: function () {
    var that = this;
    var str = '/packageA/pages/commission/QRcode/QRcode?mid=' + that.data.mid + '&share=' + 'share';
    return {
      title: "分享分销",
      path: str
    }
  },
})