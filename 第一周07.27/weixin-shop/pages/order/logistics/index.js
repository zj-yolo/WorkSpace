var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    url: ''
  },
  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    if (options.order_id) {
      that.setData({
        orderid: options.order_id,
        url: '?r=wxapp.order.index.express'
      })
    }
    if (options.orderidZC) {
      that.setData({
        orderid: options.orderidZC,
        url: '?r=wxapp.crowdFunding.order.express'
      })
    }
    that.loadData();

  },
  toStart: function() {
    wx.reLaunch({
      url: '../../index/index'
    })
  },
  loadData: function() {
    var that = this;
    server.sendRequest({
      url: that.data.url,
      data: {
        utoken: utoken,
        id: that.data.orderid
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          data: res.data.result,
          length: res.data.result[1].length
        })
        var str;
        if (that.data.data[2].expresssn) {
          str = "配送中"
        } else {
          str = "待发货";
        }

        if (res.data.result[1] != '' && res.data.result[1][0].step.indexOf("已签收") > 0) {
          str = "已签收"
        }
        that.setData({
          str: str
        })
      }
    })
  },
  getZCdata: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.order.index.express',
      data: {
        utoken: utoken,
        id: that.data.orderid
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          data: res.data.result,
          length: res.data.result[1].length
        })
        var str;
        if (that.data.data[2].expresssn) {
          str = "配送中"
        } else {
          str = "待发货";
        }

        if (res.data.result[1] != '' && res.data.result[1][0].step.indexOf("已签收") > 0) {
          str = "已签收"
        }
        that.setData({
          str: str
        })
      }
    })
  }
})