// myCoupon.js
var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    cate: '',
    check: 1,
    checkBackground:'#ff3a2b'
  },

  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    var cate = '';
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.my.getlist',
      method: 'GET',
      showToast: false,
      data: {
        cate: cate,
        utoken: utoken
      },
      success: function(res) {
        that.setData({
          loading: false,
          data: res.data.result
        })
      }
    })
  },
  onShow: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.my.getlist',
      method: 'GET',
      data: {
        cate: that.data.cate,
        utoken: utoken
      },
      success: function(res) {
        that.setData({
          loading: false,
          data: res.data.result
        })
      }
    })
  },
  toIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  toCouponDetail: function(res) {
    var that = this;
    var id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: "/packMember/pages/member/coupon/couponDetail/couponDetail?id=" + id + "&check=" + that.data.check + "&source=0" + '&endtime=' + res.currentTarget.dataset.timeend
    })
  },
  ToCoupon: function() {
    wx.navigateTo({
      url: '/packMember/pages/member/coupon/Couponcenter/Couponcenter'
    });
  },
  tarbar: function(e) {
    var that = this;
    var cate = e.target.dataset.index;
    if(cate == ''){
      that.setData({
        checkBackground: '#ff3a2b'
      })
    }
    if (cate == 'user'){
      that.setData({
        checkBackground: '#8a8a8a'
      })
    }
    if (cate == 'past'){
      that.setData({
        checkBackground: '#b8bac6'
      })
    }
    var check = e.currentTarget.dataset.check
    this.setData({
      cate: cate,
      check: check
    })
    wx.showLoading({
      title: '加载中',
    })

    server.sendRequest({
      url: '?r=wxapp.sale.coupon.my.getlist',
      method: 'GET',
      data: {
        cate: cate,
        utoken: utoken
      },
      success: function(res) {
        wx.hideLoading()
        var data = res.data.result.list;
       
        that.setData({
          data: res.data.result
        })
      }
    })
  }
})