var that = '';
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},
  onLoad: function (options) {
   that = this;
    server.sendRequest({
      url: '?r=order.question.detail&utoken=' + utoken,
        data: {
          id: options.id
        },
      method: 'GET',
      success: function (res) {
        that.setData({
        myQuesList: res.data.result,
        nickname: res.data.result.nickname,
        question: res.data.result.question,
        create_time: res.data.result.create_time,
        avatar: res.data.result.avatar,
        answer: res.data.result.answer
        });
        if (that.data.answer==null){
           that.setData({
             answer:''
           })
    }
      }

    })
  },
  joinComplaint: function () {
    that = this;
    wx.navigateBack()

  },
})