var app = getApp();
var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    log: '',
    detailList: [],
    page: 1,
    refresh: false,
  },

  onLoad: function(options) {
    this.getJifenList();
  },
  getJifenList() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    let page = that.data.page;
    let detailList = that.data.detailList;
    server.sendRequest({
      url: '?r=wxapp.sign.getrecords',
      showToast: false,
      data: {
        utoken: utoken,
        page: page,
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        page = res.data.result.list.length <= 0 ? page : ++page;
        detailList.push(...res.data.result.list);
        that.setData({})
        for (var i = 0; i < detailList.length; i++) {
          detailList[i].date = detailList[i].date.substr(0, 10);
        }
        that.setData({
          loading: false,
          page,
          detailList: detailList,
        });
        if (res.data.result.list.length > 0) {
          that.setData({
            refresh: false
          });
        }
      }
    });
  },
  onReachBottom: function() {
    let that = this;
    console.log(that.data.refresh)
    if (that.data.refresh) {
      return false
    } else {
      that.data.refresh = true;
      that.getJifenList();
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
    }
  },
})