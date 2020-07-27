var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    bargin: [],
    cateIndex: 0,
  },
  onLoad: function(options) {
    this.loadData();
  },
  // 请求数据
  loadData: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    let requesturl = that.data.cateIndex == 0 ? '?r=wxapp.member.bargain' : '?r=wxapp.member.bargain.getHelp';
    server.sendRequest({
      url: requesturl,
      data: {
        utoken: utoken
      },
      method: "GET",
      success: function(res) {
        that.setData({
          bargin: res.data,
        })
      }
    })
  },
  // 切换TAB
  tocate: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      cateIndex: index,
      bargin: [],
    });
    that.loadData();
  },
  golist: function() {
    wx.navigateTo({
      url: '/pages/bottom/bargain/index',
    })
  },
  godetail: function(e) {
    let item = e.currentTarget.dataset.item;
    if (item.optionid) {
      wx.navigateTo({
        url: "/packageA/pages/bargain/bargain/index?id=" + item.id + "&mid=" + item.mid + "&optionid=" + item.optionid
      })
    } else {
      wx.navigateTo({
        url: "/packageA/pages/bargain/bargain/index?id=" + item.id + "&mid=" + item.mid
      })
    }

  },

  // 立即购买
  topay: function (e) {
    let item = e.currentTarget.dataset.item;
    console.log(item)
    if (item.optionid != '') {
      wx.navigateTo({
        url: "/pages/order/ordersubmit/index?id=" + item.id + "&mid=" + item.mid + "&bargainOptionid=" + item.optionid + "&bargaintype=" + "bargain"
      })
    } else {
      wx.navigateTo({
        url: "/pages/order/ordersubmit/index?id=" + item.id + "&mid=" + item.mid + "&bargaintype=" + "bargain"
      })
    }
  },

  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
})