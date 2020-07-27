var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
var utoken = wx.getStorageSync("utoken");

Page({
  data: {
    tab: 1,
    width: Math.ceil(wx.getSystemInfoSync().windowWidth) * 2,
    bargain: false,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    bargains: 2,
    optionid: '',
    shareIcon: false
  },
  onLoad: function(res) {
    if (res.share) {
      this.setData({
        shareIcon: true
      })
    }
    var that = this;
    utoken = wx.getStorageSync("utoken");
    that.setData({
      id: res.id,
      mid: res.mid
    })
    if (res.optionid) {
      that.setData({
        optionid: res.optionid
      })
    }
    if (res.mid) {
      var midX = wx.setStorageSync("mid", res.mid);
      var midZ = wx.getStorageSync("mid");
    }
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.activity.bargin.optionBargain',
      data: {
        utoken: utoken,
        mid: that.data.mid,
        id: that.data.id,
        optionid: that.data.optionid
      },
      success: function(res) {
        if (res.data.result.account_set.rule && res.data.result.account_set.rule != null) {
          var rule = res.data.result.account_set.rule;
          WxParse.wxParse('rules', 'html', rule, that, 5);
          that.setData({
            rule: rule
          })
        }
        if (res.data.result.res2.content && res.data.result.res2.content != '' && res.data.result.res2.content != 'null') {
          var content = res.data.result.res2.content;
          WxParse.wxParse('contents', 'html', content, that, 5);
          that.setData({
            content: content
          })
        }
        that.setData({
          data: res.data.result
        })
      }
    })
  },
  onShow: function() {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.activity.bargin.optionBargain',
      data: {
        utoken: utoken,
        mid: that.data.mid,
        id: that.data.id,
        optionid: that.data.optionid
      },
      success: function(res) {
        that.setData({
          data: res.data.result
        })
      }
    })
  },
  kanjia: function() {
    var that = this;
    if (that.data.bargain) {
      wx.showModal({
        title: '提示',
        content: '您已经砍价啦',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    utoken = wx.getStorageSync("utoken");
    server.getUserInfo(function() {
      that.setData({
        bargain: true
      });
      server.sendRequest({
        method: 'GET',
        url: '?r=wxapp.activity.bargin.optionBargain', //原来的接口?r=wxapp.activity.bargin.bargain
        data: {
          utoken: utoken,
          mid: that.data.mid,
          id: that.data.id,
          optionid: that.data.optionid,
          ajax: 151
        },
        success: function(res) {
          if (res.data.status < 0) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                }
              }
            })
          } else {
            server.sendRequest({
              method: 'GET',
              url: '?r=wxapp.activity.bargin.optionBargain',
              data: {
                utoken: utoken,
                mid: that.data.mid,
                id: that.data.id,
                optionid: that.data.optionid
              },
              success: function(res) {
                that.setData({
                  data: res.data.result
                })
                wx.showModal({
                  title: '提示',
                  content: "砍价成功",
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                    }
                  }
                })
                that.setData({
                  bargain: 1
                })
              }
            })
          }
        }
      })
    })
  },
  kanjias: function() {
    var that = this;
    if (that.data.bargains == '1') {
      that.setData({
        bargains: 2
      })
    } else if (that.data.bargains == '2') {
      that.setData({
        bargains: 1
      })
    }
  },
  toorder: function(res) {
    wx.navigateTo({
      url: "/pages/order/details/index?order_id=" + res.currentTarget.id
    })
  },
  toindex: function() {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  tab: function(e) {
    var that = this;
    that.setData({
      tab: e.currentTarget.dataset.index
    })
  },
  tosubmitorder: function(res) {
    var that = this;
    if (that.data.data.res2.mode == 1) {
      if (that.data.data.res.now_price > that.data.data.res2.end_price) {
        wx.showToast({
          title: '还没到底价喔',
          image: 'https://tws.cnweisou.com/images/eidtNo.png',
          duration: 2000
        })
        return;
      }
    }
    if (that.data.data.swi == '222') {
      wx.reLaunch({
        url: "/pages/bottom/bargain/index"
      })
    } else {
      if (that.data.optionid != '') {
        wx.navigateTo({
          url: "/pages/order/ordersubmit/index?id=" + that.data.id + "&mid=" + that.data.mid + "&bargainOptionid=" + that.data.optionid + "&bargaintype=" + "bargain"
        })
      } else {
        wx.navigateTo({
          url: "/pages/order/ordersubmit/index?id=" + that.data.id + "&mid=" + that.data.mid + "&bargaintype=" + "bargain"
        })
      }
    }
  },
  onShareAppMessage: function() {
    var that = this;
    that.setData({
      bargains: 2
    })
    if (that.data.optionid != '') {
      var str = '/packageA/pages/bargain/bargain/index?id=' + that.data.id + '&mid=' + that.data.mid + '&optionid=' + that.data.optionid + '&share=' + 'share';
    } else {
      var str = '/packageA/pages/bargain/bargain/index?id=' + that.data.id + '&mid=' + that.data.mid + '&share=' + 'share';
    }
    return {
      title: that.data.data.res2.title,
      path: str
    }
  },
})