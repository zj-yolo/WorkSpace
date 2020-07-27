var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    data: '',
    id: '',
    category: '',
    catid: 0,
    sub: 0,
    showDHModal: false
  },
  clickName: function(e) {
    var that = this;
    var catid = e.currentTarget.dataset.id;
    var sub = e.currentTarget.dataset.index;
    that.setData({
      catid: catid,
      sub: catid
    })
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.getlist&cateid=' + catid,
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        var data = res.data.result.list;
        var category = res.data.result.category;
        that.setData({
          data: data,
          category: category
        })
      }
    })
  },
  goDetail: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      id: id
    })
    wx.navigateTo({
      url: '/packMember/pages/member/coupon/couponDetail/couponDetail?id=' + id + "&source=1"
    });
  },
  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.getlist',
      showToast: false,
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        var data = res.data.result.list;
        var category = res.data.result.category;
        that.setData({
          loading: false,
          data: data,
          category: category
        })
      }
    })
  },
  onPullDownRefresh: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.getlist',
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        wx.stopPullDownRefresh();
        var data = res.data.result.list;
        var category = res.data.result.category;
        that.setData({
          loading: false,
          data: data,
          category: category
        });
      }
    });
  },
  conversion: function(res) {
    let that = this;
    server.getUserInfo(function() {
      that.setData({
        showDHModal: true
      });
    })
  },
  closeDHModal: function() {
    this.setData({
      showDHModal: false
    })
  },
  noCloseDHModal: function() {
    return false;
  },
  inputCode: function(res) {
    this.setData({
      code: res.detail.value
    })
  },
  getCoupon: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.detail.getcoupons',
      data: {
        utoken: utoken,
        code: that.data.code
      },
      method: 'GET',
      success: function(res) {
        if (res.data.status == 1) {
          that.setData({
            showDHModal: false
          })
          wx.showModal({
            title: '提示',
            content: "领取成功",
            showCancel: false,
            success: function(res) {
              wx.navigateBack({
                delta: 1
              })
            },
          });
        } else {
          that.setData({
            showDHModal: false
          })
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function(res) {},
          });
        }
      }
    })
  }
})