var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");

Page({
  data: {
    loading: true,
    index: 0,
    status: '',
    data1: '',
    totalprice: '',
    whoOrder:false,
    nowavatar:'',
    nownickname:'',
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({ index: index })
    var that = this;
    var status = that.data.index
    if (index == 0) {
      status = ""
    }
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.commission.order&utoken=' + utoken,
      data: { status: status },
      success: function (res) {
        var totalprice = res.data.result.totalprice;
        var data = res.data.result.list;
        if (totalprice == '') { totalprice = '0.00'; }
        that.setData({
          data1: data,
          totalprice: totalprice
        })
      }
    })
  },

  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.commission.order&utoken=' + utoken,
      showToast: false,
      success: function (res) {
        var totalprice = res.data.result.totalprice;
        var data = res.data.result.list;
        if (totalprice == '') { totalprice = '0.00'; }
        that.setData({
          data1: data,
          totalprice: totalprice,
          loading:false
        })
      }
    })
  },
  showDetail(e){
    var that = this;
    that.setData({
      whoOrder:true,
      nowavatar: e.currentTarget.dataset.mydata.user.avatar,
      nownickname:  e.currentTarget.dataset.mydata.user.nickname,
    })
  },
  isCard(){
    var that = this;
    that.setData({
      whoOrder: false
    })
  }
})