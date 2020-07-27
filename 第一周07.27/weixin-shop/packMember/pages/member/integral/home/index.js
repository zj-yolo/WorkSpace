var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var page = 1;
var arr = {};
Page({
  data: {
    loading: true,
    reflesh: false
  },
  onLoad: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    that.loadingData();

  },
  onShow: function() {
    page = 1;
    arr = {};
  },
  loadingData: function() {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.creditshop",
      showToast: false,
      data: {
        utoken: utoken
      },
      method: "GET",
      success: function(res) {
        that.setData({
          loading: false,
          data: res.data.result,
        })
        arr.credit = that.data.data.credit;
        arr.advs = that.data.data.advs;
        arr.recommands = that.data.data.recommands;
        arr.times = that.data.data.times;
        arr.tops = that.data.data.tops;
        arr.vips = that.data.data.vips;
      }
    })
  },   
  onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onReachBottom: function() {
    var that = this;

    if (that.data.reflesh) {
      return;
    }
    that.setData({
      reflesh: true
    })
    page = page + 1;
    server.sendRequest({
      url: "?r=wxapp.creditshop",
      data: {
        utoken: utoken,
        page
      },
      method: "GET",
      success: function(res) {
        if (res.data.result) {
          if (res.data.result.advs) {
            arr.advs = arr.advs.concat(res.data.result.advs);
          }
          if (res.data.result.vips) {
            arr.vips = arr.vips.concat(res.data.result.vips);
          }
          if (res.data.result.tops) {
            arr.tops = arr.tops.concat(res.data.result.tops);
          }
          if (res.data.result.times) {
            arr.times = arr.times.concat(res.data.result.times);
          }
          if (res.data.result.recommands) {
            arr.recommands = arr.recommands.concat(res.data.result.recommands);
          }
          if ( res.data.result.vips || res.data.result.tops || res.data.result.times || res.data.result.recommands) {
            that.setData({
              reflesh: false,
              data: arr
            })
          }
        } else {
          page = page - 1
        }
      }
    })
  },
  // 跳转到纪录
  tointegral: function(res) {
    wx.navigateTo({
      url: '../integral/index?credit=' + res.currentTarget.dataset.credit,
    })
  },
  // 跳转到商品详情
  todetail: function(res) {
    wx.navigateTo({
      url: '../detail/index?id=' + res.currentTarget.dataset.id
    })
  },
})