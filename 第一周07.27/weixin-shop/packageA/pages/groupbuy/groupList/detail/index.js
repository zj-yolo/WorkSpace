var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
let t, ts, time_arr = [];
var content;
var WxParse = require('../../../../../wxParse/wxParse.js');
Page({
  data: {
    arr: ['拼团详情', '商品详情'],
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    select: 0,
    loading: true,
    optiontitle: '',
    shareIcon: false
  },
  select: function(e) {
    var that = this;
    that.setData({
      select: e.currentTarget.dataset.index
    })
  },
  onLoad: function(res) {
    var that = this;
    if (res.share) {
      this.setData({
        shareIcon: true
      })
    }
    that.setData({
      id: res.id,
      teamid: res.teamid,
      key: res.key
    })
    that.loadingData();
  },onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  loadingData: function() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.groups.team.detail',
      showToast: false,
      data: {
        utoken: utoken,
        teamid: that.data.teamid
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          data: res.data.result,
          loading: false,
          optiontitle: res.data.result.orders[0].optiontitle,
          imgShare: res.data.result.goods.thumb,
          isheads: res.data.result.isheads
        })
        if (res.data.result && res.data.result.goods && res.data.result.goods.content) {
          content = res.data.result.goods.content
          WxParse.wxParse('contain', 'html', content, that, 5);
        }
        for (let x in res.data.result.orders) {
          var time = new Date(res.data.result.orders[x].paytime * 1000)
          var y = time.getFullYear();
          var m = time.getMonth() + 1;
          var d = time.getDate();
          var h = time.getHours();
          var mm = time.getMinutes();
          var s = time.getSeconds();
          var x = y + '-' + that.add0(m) + '-' + that.add0(d) + ' ' + that.add0(h) + ':' + that.add0(mm) + ':' + that.add0(s);
          time_arr.push(x)
        }
        that.setData({
          time_arr: time_arr
        })
        ts = Date.parse(new Date(res.data.result.tuan_first_order.endtime)) - Date.parse(new Date()) / 1000;
        t = setInterval(function() {
          if (ts < '0') {
            that.setData({
              time: "活动已结束"
            })
            clearInterval(t);
          } else {
            ts = ts - 1;
            var test = that.time(ts);
            that.setData({
              time: test
            })
          }
        }, 1000);
      }
    })
  },

  add0: function(m) {
    return m < 10 ? '0' + m : m
  },
  seemoregroupGoods(){
    wx.navigateTo({
      url: '/pages/bottom/groupbuy/index',
    })
  },
  tomoregroup(){
    wx.navigateTo({
      url: '/pages/bottom/groupbuy/index?typeIndex=1',
    })
  },
  togoodsdetail(){
    wx.navigateTo({
      url: "/packageA/pages/groupbuy/detail/index?id=" + this.data.data.goods.id
    })
  },
  time: function(ts) {
    var dd = parseInt(ts / 60 / 60 / 24, 10);
    var hh = parseInt(ts / 60 / 60 % 24, 10);
    var mm = parseInt(ts / 60 % 60, 10);
    var ss = parseInt(ts % 60, 10);
    var test = (dd.toString() + "天" + hh.toString() + "时" + mm.toString() + "分" + ss.toString() + "秒")
    return test
  },
  onUnload: function(options) {
    clearInterval(t);
  },

  toopen: function() {
    var that = this;
    wx.reLaunch({
      url: '../../confirmOrder/index?teamid=' + that.data.teamid + '&id=' + that.data.data.goods.id + '&type=groups'
    })
  },
  onShareAppMessage: function() {
    var that = this;
    var str = '/packageA/pages/groupbuy/groupList/detail/index?teamid=' + that.data.teamid + '&id=' + that.data.id + '&share=' + 'share'
    return {
      title: that.data.data.goods.title,
      path: str,
      imageUrl: that.data.imgShare
    }
  },
  backToIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  toIndex: function() {
    var that = this;
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
})