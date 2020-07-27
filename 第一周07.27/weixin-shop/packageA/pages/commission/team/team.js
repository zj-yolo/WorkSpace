var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var index, page = 1;
Page({
  data: {
    loading: true,
    index: 1,
    num: '',
    arr: {
      1: 0,
    },
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    refresh: false,
  },
  tabClick: function(e) {
    var that = this;
    index = e.currentTarget.dataset.index;
    page = 1
    this.setData({
      index: index,
      refresh: false,
    })
    server.sendRequest({
      url: '?r=wxapp.commission.down&utoken=' + utoken + '&level=' + index,
      data: {},
      success: function(res) {
        if (res.data.status == 1) {
          var data = res.data.result.list;
          that.data.arr[1] = res.data.result.level[1];
          if (res.data.result.level[2] != undefined) {
            that.data.arr[2] = res.data.result.level[2];
          }
          if (res.data.result.level[3] != undefined) {
            that.data.arr[3] = res.data.result.level[3];
          }
          var arr = that.data.arr;
          that.setData({
            data: data,
            arr: arr
          })
        }

      }
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  toDate: function() {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  onLoad: function(options) {

    utoken = wx.getStorageSync("utoken");
    var that = this;
    var index = that.data.index
    page = 1
    server.sendRequest({
      url: '?r=wxapp.commission.down&utoken=' + utoken + '&level=' + that.data.index,
      showToast: false,
      data: {},
      method: "GET",
      success: function(res) {
        var data = res.data.result.list;
        that.data.arr[1] = res.data.result.level[1];
        if (res.data.result.level[2] != undefined) {
          that.data.arr[2] = res.data.result.level[2];
        }
        if (res.data.result.level[3] != undefined) {
          that.data.arr[3] = res.data.result.level[3];
        }
        var arr = that.data.arr;
        that.setData({
          loading: false,
          data: data,
          arr: arr
        })

      }
    })
  },
  onReachBottom: function(e) {
    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true
    })
    page = page + 1;
    server.sendRequest({
      url: '?r=wxapp.commission.down',
      data: {
        utoken: utoken,
        level: that.data.index,
        page: page
      },
      method: "GET",
      success: function(res) {
        var arr = [];
        for (let x in that.data.data.list) {
          arr.push(that.data.data.list[x])
        }
        if (res.data.result.list.list == '') {
          page = page - 1
        } else {
          for (let x in res.data.result.list.list) {
            arr.push(res.data.result.list.list[x])
          }
          that.setData({
            refresh: false
          })
        }
        that.setData({
          data: {
            list: arr
          }
        })

      }
    })

  },
})