var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.commission.log.orders&utoken='+utoken+"&id="+options.id,
      data: '',
      success: function (res) {
        console.log(res)
        var data = res.data.result.list;
        that.setData({ data: data})
      }
    })
  },
})