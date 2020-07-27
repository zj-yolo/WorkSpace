// couponDetail.js
var server = require('../../../../../utils/server');
var wxparse = require('../../../../../wxParse/wxParse.js');
var utoken = wx.getStorageSync("utoken");
var logid;
Page({
  data: {
    loading: true,
    data: '',
    id: '',
    useInstructions: false
  },
  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    if (options.check) {
      that.setData({
        check: options.check
      })
    }
    that.setData({
      id: options.id,
      source: options.source //0代表从我的优惠券进来，1代表从领取优惠券处进来
    })
    if (options.endtime){
      that.setData({
        endtime: that.timestampToTime(options.endtime),
      })
    }
    if (that.data.source == 0) {
      server.sendRequest({
        url: '?r=wxapp.sale.coupon.detail.get_coupon_list&id=' + options.id,
        showToast: false,
        data: {
          utoken: utoken
        },
        method: 'GET',
        success: function(res) {
          that.setData({
            timend: that.timestampToTime(res.data.result.coupon.data.gettime * 1 + 86400 * res.data.result.coupon.timedays),
            gettimea: that.timestampToTime(res.data.result.coupon.data.gettime),
          })
          var data = res.data.result.coupon;
          if (data.descnoset == "0") {
            if (data.coupontype == "0") {
              wxparse.wxParse('desc', 'html', res.data.result.set.consumedesc, that, 5);
            } else if (data.coupontype == "1") {
              wxparse.wxParse('desc', 'html', res.data.result.set.rechargedesc, that, 5);
            }
          } else if (data.descnoset == "1") {
            wxparse.wxParse('desc', 'html', data.desc, that, 5);
          }
          if (that.data.check == 2) {
            var useTime = res.data.result.coupon.data.usetime;
            var orderId = res.data.result.coupon.data.ordersn;
            useTime = (new Date(useTime * 1000)).toLocaleDateString();
            that.setData({
              data: data,
              loading: false,
              useTime,
              orderId
            });
          } else {
            that.setData({
              data: data,
              loading: false,
            });
          }
        }
      });
    } else if (that.data.source == 1) {
      server.sendRequest({
        url: '?r=wxapp.sale.coupon.detail&id=' + options.id,
        showToast: false,
        data: {
          utoken: utoken
        },
        method: 'GET',
        success: function(res) {
          var data = res.data.result.coupon;
          if (data.descnoset == "0") {
            if (data.coupontype == "0") {
              wxparse.wxParse('desc', 'html', res.data.result.set.consumedesc, that, 5);
            } else if (data.coupontype == "1") {
              wxparse.wxParse('desc', 'html', res.data.result.set.rechargedesc, that, 5);
            }
          } else if (data.descnoset == "1") {
            wxparse.wxParse('desc', 'html', data.desc, that, 5);
          }
          that.setData({
            data: data,
            loading: false,
          });
        }
      });
    }
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.detail.recommand',
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          swiper: res.data.result,
          store_num: res.data.result.list.list.length
        })
      }
    })
  },
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = this.change(date.getDate()) + ' ';
    var h = this.change(date.getHours()) + ':';
    var m = this.change(date.getMinutes()) + ':';
    var s = this.change(date.getSeconds());
    return Y + M + D ;
  },
  change: function(t) {
    if (t < 10) {
      return "0" + t;
    } else {
      return t;
    }
  },

  togoods: function(res) {
    wx.navigateTo({
      url: "/pages/goods/detail/detail?objectId=" + res.currentTarget.dataset.objectid
    })
  },
  toGoods: function() {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  getCoupon: function() {
    var that = this;
    server.getUserInfo(function() {
      wx.showModal({
        title: '提示',
        content: '确认领取吗？',
        success: function(res) {
          if (res.confirm) {
            server.sendRequest({
              url: '?r=wxapp.sale.coupon.detail.pay',
              data: {
                utoken: utoken,
                id: that.data.id,
                jie: 1
              },
              method: 'GET',
              success: function(res) {
                var x = res.data.msg;
                if (res.data.status == 1) {
                  // 有企业支付直接微信支付
                  if (res.data.result.result) {
                    if (res.data.result.result && res.data.result.wechat) {
                      logid = res.data.result.logid;
                      server.globalData.wxdata = res.data.result.result;
                      server.globalData.order = res.data.result.wechat;
                      that.setData({
                        paydata: res.data.result.data,
                        order: res.data.result.order
                      });
                      var wxdata = server.globalData.wxdata
                      var timeStamp = wxdata.timeStamp + "";
                      that.pay();
                      return;
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: "请开通企业支付,领取失败"
                      })
                    }
                  } else {
                    server.sendRequest({
                      url: '?r=wxapp.sale.coupon.detail.payresult',
                      data: {
                        utoken: utoken,
                        logid: res.data.result.logid
                      },
                      method: 'GET',
                      success: function(res) {
                        wx.navigateTo({
                          url: '../getCoupon/getCoupon',
                        })
                      },
                    })
                  }
                } else {
                  wx.showModal({
                    title: '提示',
                    content: "" + x,
                    success: function(res) {}
                  })
                }
              }
            })
          }
        }

      })
    })
  },
  // 支付
  pay: function() {
    var that = this;
    var wxdata = server.globalData.wxdata;
    console.log(wxdata);
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package;
    var sign = wxdata.sign;
    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': package1,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': sign,
      'success': function(res) {
        server.sendRequest({
          url: "?r=wxapp.sale.coupon.detail.payresult",
          data: {
            utoken: utoken,
            logid: logid
          },
          method: 'GET',
          success: function(res) {
            wx.navigateTo({
              url: '/packMember/pages/member/coupon/getCoupon/getCoupon',
            })
          }
        })
      },
      'fail': function(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  showModal: function() {
    this.setData({
      useInstructions: true
    })
  },
  hideModal: function() {
    this.setData({
      useInstructions: false
    })
  }
})