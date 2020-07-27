var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var page = 1;
Page({
  data: {
    loading: true,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    refresh: false,
    shareIcon: false,
    showIndex: false
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    if (options.share) {
      this.setData({
        shareIcon: true
      })
    }
    var pages = getCurrentPages()
    if (pages.length == 1) {
      this.setData({
        showIndex: true
      })
    };
    if (options.mid) {
      that.setData({ mid: options.mid, });
      var midX = wx.setStorageSync("mid", options.mid);
      var midZ = wx.getStorageSync("mid");
    }
    var midX = wx.setStorageSync("mid", options.mid);
    that.setData({
      mid: options.mid
    })
    var midX = wx.setStorageSync("mid", options.mid);
    that.loadData(options);
  },
  loadData: function (options) {
    var that = this;
    // that.showToast({
    //   title: '读取中...',
    //   icon: 'loading',
    //   duration: 500
    // });
    server.sendRequest({
      url: "?r=wxapp.commission.myshop&mid=" + that.data.mid + '&utoken=' + utoken,
      method: "GET",
      showToast: false,
      success: function (res) {
        if (res.statusCode && res.statusCode != 200) {
          wx.hideToast();
          that.showModal({ content: '' + res.errMsg });
          return;
        }
        that.setData({
          top: res.data.result
        })
      }
    });
    server.sendRequest({
      url: "?r=wxapp.commission.myshop.get_goods&mid=" + that.data.mid + '&utoken=' + utoken,
      method: "GET",
      showToast:false,
      success: function (res) {
        if (res.statusCode && res.statusCode != 200) {
          wx.hideToast();
          that.showModal({ content: '' + res.errMsg });
          return;
        }
        that.setData({
          loading: false,
          data: res.data.result.list,
          total: res.data.result.total
        })
      }
    });
  },
  showToast: function (param) {
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  QRcode: function () {
    var that = this;
    wx.navigateTo({
      url: '../QRcode/QRcode?mid=' + that.data.mid,
    })
  },
  toSell: function (res) {
    var that = this;
    var goodsId = res.currentTarget.dataset.id;
    var mid = that.data.mid;
    wx.navigateTo({
      url: '../../../../pages/goods/detail/detail?&objectId=' + goodsId + '&mid=' + mid
    })
  },
  bottom: function (e) {
    var that = this;
    if (that.data.refresh) return;
    that.setData({ refresh: true })
    page = page + 1;
    server.sendRequest({
      url: "?r=wxapp.commission.myshop.get_goods",
      data: {
        mid: that.data.mid,
        utoken: utoken,
        page: page
      },
      method: "GET",
      success: function (res) {
        var arr = [];
        for (let x in that.data.data) {
          arr.push(that.data.data[x])
        }
        if (res.data.result.list == '') { page = page - 1 }
        else {
          for (let x in res.data.result.list) {
            arr.push(res.data.result.list[x])
          }
          that.setData({
            data: arr
          })
          that.setData({ refresh: false })
        }
        if (res.statusCode && res.statusCode != 200) {
          wx.hideToast();
          that.showModal({ content: '' + res.errMsg });
          return;
        }
      }
    });
  },
  onShareAppMessage: function () {
    var that = this;
    var str = '/packageA/pages/commission/shopStore/index?mid=' + that.data.mid + '&share=' + 'share';
    return {
      title: "我的小店",
      path: str
    }
  },
  backToIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})
