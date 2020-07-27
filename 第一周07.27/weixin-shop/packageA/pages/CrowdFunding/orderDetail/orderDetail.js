var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken")

Page({
  data: {
    logs: [],
    loading: true
  },
  onLoad: function(e) {
    let that = this;
    that.setData({
      orderId: e.orderid
    })
    that.loadData();

  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.order.detail',
      data: {
        orderid: that.data.orderId
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data.result);

        that.setData({
          address: res.data.result.address,
          order: res.data.result.order,
          loading: false
        })
      }
    })
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
                that.loadData()
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
                wx.navigateTo({
                  url: '../orderList/index',
                })
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
                // that.getOrderListData()
                that.loadData()
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
            // order: res.data.result.order
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
        // that.getOrderListData()
        that.loadData()
      },
      'fail': function(res) {
        that.loadData()
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  intoJd: function(e) {
    wx.navigateTo({
      url: '../detail/index?id=' + e.currentTarget.dataset.goodid,
    })
  },
  lookWl: function(e) {
    wx.navigateTo({
      url: '../../../../pages/order/logistics/index?order_id=' + e.currentTarget.dataset.orderid,
    })
  },
})