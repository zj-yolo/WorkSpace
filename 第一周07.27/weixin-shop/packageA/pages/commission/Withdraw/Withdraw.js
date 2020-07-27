var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");

Page({
  data: {
    loading: true,
    index: 0,
    commissioncount: '',
    status: ''
  },
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({ index: index })
    var status = this.data.index;
    if (status == 0) {
      status = '';
    }
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.commission.log&utoken=' + utoken,
      data: { status: status },
      success: function (res) {
        var data = res.data.result.list;
        var commissioncount = res.data.result.commissioncount
        that.setData({ data: data, commissioncount: commissioncount })
      }
    })
  },
  detailClick: function (e) {
    wx.navigateTo({
      url: '../WithdrawDetail/WithdrawDetail?id=' + e.currentTarget.id,
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.commission.log&utoken=' + utoken,
      showToast: false,
      data: '',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var data = res.data.result.list;
        var commissioncount = res.data.result.commissioncount
        that.setData({
          loading:false,
          data: data,
          commissioncount: commissioncount
        })
      }
    })
  },
})