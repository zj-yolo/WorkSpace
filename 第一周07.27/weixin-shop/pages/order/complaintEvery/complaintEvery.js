var that = '';
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},
  onShow: function () {
    that = this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=order.question.question_list&utoken=' + utoken,
      method: 'GET',
      success: function (res) {
        if (res.data.result[0]) {
          that.setData({
            myQuesList: res.data.result,
            listLength: res.data.result.length
          });
        }
      }
    })
  },
  joinQues: function (e) {
wx.redirectTo({
  url: '/pages/order/complaint/complaint',
})
  }
})