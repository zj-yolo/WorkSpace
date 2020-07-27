var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var that = '';
Page({
  data: {
    description: '',
    money: '',
    id: '',
    cardList: '',
    loading: true
  },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    that = this;
    server.sendRequest({
      url: '?r=wxapp.member.vipcard.getlist',
      showToast: false,
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          loading: false,
          cardList: res.data.result,
        })
      },
    })
  },
  activateCardSilver: function (e) {
    var that = this;
    server.getUserInfo(function () {
      wx.navigateTo({
        url: '../../member/membership/cardOpen/cardOpen?money=' + that.data.cardList[e.currentTarget.dataset.index].money + '&id=' + that.data.cardList[e.currentTarget.dataset.index].id,
      })
    });
  },
})