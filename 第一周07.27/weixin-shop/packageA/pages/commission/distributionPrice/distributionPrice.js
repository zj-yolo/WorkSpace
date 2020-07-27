var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    data: '',
    show: true,
    commission_ok: '',
    disabled: 'true'
  },
  showOrhide: function () {
    this.setData({
      show: (!this.data.show)
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.commission.withdraw&utoken=' + utoken,
      showToast:false,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var data = res.data.result;
        that.setData({
          loading: false,
          data: data
        })
        if (res.data.result.commission_ok > that.data.data.set_data.withdraw) {
          that.setData({
            disabled: !that.data.disabled
          })
        }
      }
    })
  },
  tixian: function () {
    wx.navigateTo({
      url: '../WithdrawDetailMoney/WithdrawDetailMoney',
    })
  },
  priceClick: function () {
    wx.navigateTo({
      url: '../Withdraw/Withdraw',
    })
  },
})