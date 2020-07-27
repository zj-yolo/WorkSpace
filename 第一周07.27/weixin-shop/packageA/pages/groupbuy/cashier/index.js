var server = require('../../../../utils/server');
var id, teamid = 0,result,
  isteam = 0;
var utoken = wx.getStorageSync("utoken");
var wxpay = '';
var logid, integral;
Page({
  data: {},
  onLoad: function(res) {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    id = res.orderid;
    if (res.name == 'integral') {
      integral = 'integral';
      wx.getStorageSync('result') ? result = wx.getStorageSync('result') : '';
      that.integral();
    } else if (res.teamid != 'undefined') {
      isteam = 1;
      teamid = res.teamid;
      that.loadData();
    } else {
      teamid = 0;
      that.loadData();
    }
  },onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  integral: function() {
    var that = this;
    that.setData({
      orderno: result.orderid,
      money: result.money,
    })
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=wxapp.creditshop",
      showToast: false,
      data: {
        utoken: utoken
      },
      method: "GET",
      success: function (res) {
        that.setData({
          credits: res.data.result.credit,
        })
      }
    })
    if (result.logid) {
      logid = result.logid;
    }
    if (result.wechat && result.wechat.data) {
      wxpay = result.wechat.data
      that.setData({
        data: result.wechat.data
      })
    } else {
      that.setData({
        data: result.wechat
      })
    }
    if (wxpay) {
      that.setData({
        wxpay: wxpay
      })
    }
  },
  loadData: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups.pay',
      data: {
        utoken: utoken,
        orderid: id,
        teamid: teamid
      },
      method: 'GET',
      success: function(res) {
        let data = res.data.result;
        that.setData({
          orderno: data.order.orderno,
          money: data.money,
          order: data.order,
          resultH: data
        })
        if (data && data.wechat && data.wechat.data) {
          wxpay = data.wechat.data
        }
        if (wxpay) {
          that.setData({
            wxpay: wxpay
          })
        } else {
          that.setData({
            wxpay: ''
          })
        }
      }
    })
  },
  toStart: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  pay: function() {
    utoken = wx.getStorageSync("utoken");
    var timeStamp = wxpay.timeStamp + "";
    var nonceStr = wxpay.nonceStr + "";
    let that = this;
    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': wxpay.package,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': wxpay.sign,
      'success': function(res) {
        if (integral == 'integral') {
          server.sendRequest({
            url: '?r=wxapp.creditshop.detail.lottery',
            data: {
              utoken: utoken,
              logid: logid,
              id: id,
              type: 'pay'
            },
            method: "POST",
            success: function(res) {}
          })
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          wx.getStorageSync('result') ? wx.removeStorageSync('result') : '';
          setTimeout(function() {
            wx.navigateTo({
              url: '/packMember/pages/member/integral/integral/index?credit=' + that.data.credits,
            });
          }, 2000);

        } else {
          var typeB = ''
          if (that.data.order.creditpay == 1) {
            typeB = 'credit'
          } else {
            typeB = 'wechat'
          }
          server.sendRequest({
            url: '?r=wxapp.groups.pay.complete',
            data: {
              utoken: utoken,
              orderid: id,
              teamid: teamid,
              isteam: isteam,
              type: typeB
            },
            method: "POST",
            success: function(res) {}
          })
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function() {
            // wx.navigateTo({
            //   url: '../groupList/index'
            // });
            wx.navigateTo({
              url: '/pages/bottom/groupbuy/index?typeIndex=1',
            })
          }, 2000);
        }
      },
      'fail': function(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  toweixin: function(e) {
    if (parseInt(this.data.resultH.money) < parseInt(this.data.resultH.order.creditinfo)) {
      wx.showModal({
        title: '提示',
        content: '确定付款吗？',
        success: function(res) {
          if (res.confirm) {
            server.sendRequest({
              url: '?r=wxapp.groups.pay.complete',
              data: {
                utoken: utoken,
                orderid: id,
                teamid: teamid,
                isteam: isteam,
                type: 'credit'
              },
              method: "POST",
              success: function(res) {
                if (res.data.status == 1) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function() {
                    // wx.navigateTo({
                    //   url: '../groupList/index'
                    // });
                    wx.navigateTo({
                      url: '/pages/bottom/groupbuy/index?typeIndex=1',
                    })
                  }, 2000);
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 2000
                  })
                }
              }
            })
          } else if (res.cancel) {}
        }
      })
    } else {
      wx.showToast({
        title: '余额不足',
        icon: 'loading',
        duration: 2000
      })
    }
  }
})