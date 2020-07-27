var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: false,
    list: [
      '消费记录', '充值记录'
    ]
  },
  onLoad: function (options) {
    var that = this;
  },
  onShow: function () {
    var that = this;
    that.setData({
      sub: 0
    })
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.member.vipcard.getVipcardLog&utoken=' + utoken + '&typeid=' + 2,
      showToast: false,
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          that.setData({
            loading: false,
            consumption: res.data.result
          })
        }
      }
    })
  },

  clickTitle: function (e) {
    var that = this;
    var sub = e.currentTarget.dataset.index;
    that.setData({
      sub: sub
    })
    if (that.data.sub == 0) {
      var currType = 2;
    } else {
      var currType = 1;
    }
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.member.vipcard.getVipcardLog&utoken=' + utoken + '&typeid=' + currType,
      data: {

      },
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          that.setData({
            consumption: res.data.result
          })
        }
      }
    })
  },

})