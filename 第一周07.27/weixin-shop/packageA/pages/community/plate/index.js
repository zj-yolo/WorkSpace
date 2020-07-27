var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    height: (Math.ceil(wx.getSystemInfoSync().screenHeight) * 2)
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    server.sendRequest({
      url: '?r=wxapp.sns.board.lists&utoken='+utoken,
      method: 'GET',
      success: function (res) {
        that.setData({
          left: res.data.result
        })
      }
    })
    that.getBoard(options.id);
  },
  tab: function (e) {
    var that = this;
    that.setData({
      id: e.currentTarget.dataset.id
    });
    that.getBoard(that.data.id);
  },
  formSubmit: function (e) {
    var that = this;
    that.getBoard(that.data.id,e.detail.value);
  },
  getBoard: function (id,keywords) {
    var utoken = wx.getStorageSync("utoken");
    var that = this;
    if(keywords == undefined){
      keywords = '';
    }
    server.sendRequest({
      url: '?r=wxapp.sns.board.get_boardlist',
      data: {
        cid: id,
        page: 1,
        keywords: keywords,
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          right: res.data.result.list
        })
      }
    })
  },
  toList: function (res) {
    wx.navigateTo({
      url: "../list/index/index?id=" + res.currentTarget.dataset.bid
    })
  }
})
