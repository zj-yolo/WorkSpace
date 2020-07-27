var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var formId, page = 1,
  arr = [];
Page({
  data: {
    status: 0,
    scshow: false,
    heightt: Math.ceil(wx.getSystemInfoSync().windowHeight),
    showLine: false,
    isflug: true,
    loading: true
  },
  onLoad: function(e) {
    var that = this
    arr = []
    that.setData({
      showLine: false
    })
    that.getOrderListData()
  },
  onShow: function() {
    arr = []
  },
  clickTop: function(e) {
    var that = this
    that.setData({
      status: e.currentTarget.dataset.status
    })
    that.getOrderListData()
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  getOrderListData: function() {
    let that = this;
    page = 1
    arr = []
    that.setData({
      isflug: true
    })
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.order.orderList',
      data: {
        utoken: utoken,
        status: that.data.status,
        page: page
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          orderList: res.data.result,
          loading: false
        })
        for (let x in res.data.result) {
          arr.push(res.data.result[x]);
        }
      }
    })
  },
  bottom: function() {
    var that = this
    page = page + 1;
    if (that.data.isflug){
      server.sendRequest({
        url: '?r=wxapp.crowdFunding.order.orderList',
        data: {
          utoken: utoken,
          status: that.data.status,
          page: page
        },
        method: 'GET',
        success: function (res) {
          if (res.data.result == '') {
            page = page - 1
            wx.showToast({
              title: '没有订单了',
              icon: 'success',
              duration: 3000
            })
            that.setData({
              isflug: false
            })
          } else {
            for (let x in res.data.result) {
              arr.push(res.data.result[x])
            }
          }
          that.setData({
            orderList: arr
          })
        }
      })
    }
 
  },
  quxiaoOrder: function(e) {
    let that = this
    wx.showModal({
      title: '取消订单',
      content: '是否取消订单',
      success: function(res) {
        if (res.confirm) {
          server.sendRequest({
            url: '?r=wxapp.crowdFunding.order.cancel',
            data: {
              utoken: utoken,
              orderid: e.currentTarget.dataset.orderid,
            },
            method: 'GET',
            success: function(res) {
              if (res.data.status == 1) {
                that.getOrderListData()
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  delete: function(e) {
    let that = this
    wx.showModal({
      title: ' 删除订单',
      content: '是否删除订单',
      success: function(res) {
        if (res.confirm) {
          server.sendRequest({
            url: '?r=wxapp.crowdFunding.order.delete',
            data: {
              utoken: utoken,
              orderid: e.currentTarget.dataset.orderid,
            },
            method: 'GET',
            success: function(res) {
              if (res.data.status == 1) {
                that.getOrderListData()
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  gencui: function() {
    let that = this
    that.setData({
      scshow: true
    })
    setTimeout(that.setData({
      scshow: false
    }), 2000)
  },
  querensh: function(e) {
    let that = this
    wx.showModal({
      title: '确认收货',
      content: '是否确认收货',
      success: function(res) {
        if (res.confirm) {
          server.sendRequest({
            url: '?r=wxapp.crowdFunding.order.finish',
            data: {
              utoken: utoken,
              orderid: e.currentTarget.dataset.orderid,
            },
            method: 'GET',
            success: function(res) {
              if (res.data.status == 1) {
                that.getOrderListData()
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  orderPay: function(e) {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.order.pay',
      data: {
        utoken: utoken,
        orderid: e.currentTarget.dataset.orderid,
      },
      method: 'POST',
      success: function(res) {
        if (res.data.status == 1) {
          server.globalData.wxdata = res.data.result.data;
          server.globalData.order = res.data.result.order;

          that.setData({
            paydata: res.data.result.data,
            order: res.data.result.order
          });

          let wxdata = server.globalData.wxdata
          let timeStamp = wxdata.timeStamp + "";
          // 有企业支付直接微信支付
          that.pay();
        } else if (res.data.status == 10) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          return;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          return;
        }
      }
    })
  },
  // 支付
  pay: function() {
    let that = this;
    var wxdata = server.globalData.wxdata
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package
    var sign = wxdata.sign;
    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': package1,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': sign,
      'success': function(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        that.getOrderListData()
      },
      'fail': function(res) {
        setTimeout(function(){
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 3000
          })
        }, 1000)
        // wx.showToast({
        //   title: '支付失败',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },
  intoJd: function(e) {
    wx.navigateTo({
      url: '../detail/index?id=' + e.currentTarget.dataset.goodid,
    })
  },
  lookWl: function(e) {
    console.log('aa', e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: '../../../../pages/order/logistics/index?orderidZC=' + e.currentTarget.dataset.orderid,
    })
  },
  intoOrderDetail: function(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderid=' + e.currentTarget.dataset.orderid,
    })
  }
})