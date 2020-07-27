var server = require('../../../../../utils/server');
var WxParse = require('../../../../../wxParse/wxParse');
var utoken = wx.getStorageSync("utoken");
var content;
var active = 1;
Page({
  data: {
    loading: true,
    test: "",
    scrollTop: {
      scroll_top: 0,
      goTop_show: false,
      active: ''
    }
  },
  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    that.setData({
      id: options.id
    });
    that.loadingData(options);
  },
  loadingData: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.creditshop.detail&id=" + options.id,
      showToast: false,
      data: {
        utoken: utoken
      },
      method: "GET",
      success: function(res) {
        that.setData({
          loading: false,
          data: res.data.result,
          goods: res.data.result.goods,
          recommands: res.data.result.recommands,
          rec_num: res.data.result.recommands.length
        })
        var x = res.data.result.goods
        for (let i in x) {
          if (i == 'goodsdetail') {
            content = x[i];
            WxParse.wxParse('article', 'html', content, that, 5);
          }
        }
      }
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  getSection: function(res) {
    this.setData({
      active: res.currentTarget.dataset.index
    })
  },
  scrollTopFun: function(e) {
    if (e.detail.scrollTop > 0) {
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },
  goTopFun: function(e) {
    var _top = this.data.scrollTop.scroll_top;
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });
  },
  toexchange: function() {
    var that = this;
    server.getUserInfo(function() {
      wx.redirectTo({
        url: "/packMember/pages/member/integral/exchange/index?id=" + that.data.id
      })
    })
  },
  todetail: function(res) {
    wx.navigateTo({
      url: '../detail/index?id=' + res.currentTarget.dataset.id
    })
  },
})