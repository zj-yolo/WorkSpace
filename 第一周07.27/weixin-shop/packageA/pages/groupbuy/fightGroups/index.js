var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var page = 1;
var t, time_arr = [];
Page({
  data: {
    width: Math.ceil(wx.getSystemInfoSync().windowWidth) * 2,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    navindex: 0,
    refresh: false,
    loading: true
  },
  onLoad: function(res) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    that.setData({
      id: res.id
    })
    that.loadPageData();
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  onShow: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
    utoken = wx.getStorageSync("utoken");
  },onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  loadPageData: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups.goods.fightGroups',
      showToast: false,
      data: {
        utoken: utoken,
        id: that.data.id
      },
      method: 'GET',
      success: function(res) {
        for (let x = 0; x < res.data.result.teams.length; x++) {
          time_arr.push(res.data.result.teams[x].residualtime);
        }
        t = setInterval(function() {
          var subarr = [];
          for (let x = 0; x < time_arr.length; x++) {
            if (time_arr[x] > 0) {
              time_arr[x] = time_arr[x] - 1;
              subarr[x] = that.time(time_arr[x]);
            } else {
              subarr[x] = '';
            }
          }
          that.setData({
            arr: subarr
          })
        }, 1000);
        that.setData({
          data: res.data.result,
          loading: false
        });
      }
    })
  },

  time: function(time) {
    var h = parseInt(time / 60 / 60);
    var m = parseInt(time / 60 % 60);
    var s = parseInt(time % 60)
    var t = `${h}:${m}:${s}`;
    return t;
  },
  onUnload: function(options) {
    clearInterval(t);
  },
  tocorder: function(res) {
    var that = this;
    wx.reLaunch({
      url: "../confirmOrder/index?teamid=" + res.currentTarget.dataset.id + "&type=groups&id=" + that.data.id
    })
  },

  // 分页
  bottom: function(e) {
    var that = this;
    if (that.data.refresh) return -1;
    that.setData({
      refresh: true
    });
    page = page + 1;
    server.sendRequest({
      url: '?r=wxapp.groups.goods.fightGroups',
      data: {
        utoken: utoken,
        id: that.data.id,
        page: page
      },
      method: 'GET',
      success: function(res) {
        var arr = []
        for (let x in that.data.data.teams) {
          arr.push(that.data.data.teams[x])
        }
        if (res.data.result.teams == '') {
          page = page - 1;
          return;
        } else {
          for (let x in res.data.result.teams) {
            arr.push(res.data.result.teams[x])
          }
          that.setData({
            data: {
              goods: res.data.result.goods,
              teams: arr
            },
            refresh: false
          });
        }
        for (let x = 0; x < arr.length; x++) {
          time_arr.push(arr[x].residualtime);
        }
        t = setInterval(function() {
            var subarr = [];
            for (let x = 0; x < time_arr.length; x++) {
              if (time_arr[x] > 0) {
                time_arr[x] = time_arr[x] - 1;
                subarr[x] = that.time(time_arr[x]);
              } else {
                subarr[x] = '';
              }
            }
            that.setData({
              arr: subarr
            })
          },
          1000);
        if (res.statusCode && res.statusCode != 200) {
          wx.hideToast();
          that.showModal({
            content: '' + res.errMsg
          });
          return;
        }
      }
    })
  }
})