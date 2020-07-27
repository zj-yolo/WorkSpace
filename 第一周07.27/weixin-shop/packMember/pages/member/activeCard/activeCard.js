var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    cardsn: '',
    credit1: '',
    credit2: '',
    title: '',
    backurl: '',
    record: '',
  },
  onLoad: function (options) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.member&utoken=' + utoken,
      method: 'GET',
      showToast: false,
      success: function (res) {
        that.setData({
          credit2: res.data.result.credit3,
          credit1: res.data.result.credit1,
          cardsn: res.data.result.cardsn,
        });
        if (res.data.result.cardset && res.data.result.cardset.background.backurl) {
          that.setData({
            backurl: res.data.result.cardset.background.backurl,
            logoUrl: res.data.result.cardset.logo
          })
        }
        if (res.data.result.cardset && res.data.result.cardset.title) {
          that.setData({
            title: res.data.result.cardset.title,
            id: res.data.result.cardset.id,
          })
        }
      }
    })
  },
  onShow: function () {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.member&utoken=' + utoken,
      method: 'GET',
      showToast: false,
      success: function (res) {
        that.setData({
          loading: false,
          credit2: res.data.result.credit3,
          credit1: res.data.result.credit1,
          cardsn: res.data.result.cardsn,
        });
        if (res.data.result.cardset && res.data.result.cardset.background.backurl) {
          that.setData({
            backurl: res.data.result.cardset.background.backurl,
          })
        }
        if (res.data.result.cardset && res.data.result.cardset.title) {
          that.setData({
            title: res.data.result.cardset.title
          })
        }
      }
    })
  },
  joinCardIndex: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/membership/index',
    })
  },
  joinconsumption: function () {
    wx.navigateTo({
      url: 'consumption/consumption',
    })
  },
  //跳转到充值
  recharge: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/membership/recharge/recharge?cardN=' + this.data.cardsn + '&title=' + this.data.title,
    })
  },
})