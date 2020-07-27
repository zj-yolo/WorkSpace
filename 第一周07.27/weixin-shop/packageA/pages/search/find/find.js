var server = require("../../../../utils/server");
var utoken = wx.getStorageSync("utoken");
var historyWords = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getHotWord: "",
    historyWords: "",
    hashistory: false,
    searchCurr: "",
    submitData: {},
    GoodListData: "",
    windowWidth: "",
    windowHeight: "",
    refresh: false,
    keywords1: "",
    hasTabs: true
  },
  onLoad: function(options) {
    var that = this;
    if (typeof (options.hasTabs) != 'undefined' ) {
      that.setData({
        hasTabs:true
      })
      that.data.submitData = {
        utoken: utoken,
        page: 1,
        sort: "",
        sort_asc: "",
        cate: "",
        keywords: ""
      };
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight
          });
        }
      });
      // that.getHotWords();
    } else {
      that.setData({
        hasTabs:false
      })
      server.sendRequest({
        url: "?r=wxapp.goods.get_hot_keywords",
        method: "GET",
        success: function(res) {
         
          var keyword = res.data.result.hot_keywords;
          that.setData({ keywords1: keyword });
        }
      });
    }
  },

  onShow: function() {
    this.getHistory();
  },
  getHotWords() {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=wxapp.goods.get_hot_keywords",
      method: "GET",
      success: function(res) {
        // console.log(res);
        var keyword = res.data.result.hot_keywords;
        that.setData({ getHotWord: keyword });
      }
    });
  },
  getSearch(e) {
    // console.log(e)
    this.data.submitData.page = 1;
    if(typeof e.detail.value.keywords != 'undefined'){
      if(e.detail.value.keywords){
        this.data.submitData.keywords = e.detail.value.keywords;
        this.getGoodList(); 
      }
    }else{
      if(e.detail.value){
      this.data.submitData.keywords = e.detail.value;
      this.getGoodList();
      }
    }    

    if (
      typeof wx.getStorageSync("historyWords") == "object" &&
      wx.getStorageSync("historyWords").length > 0
    ) {
      historyWords = wx.getStorageSync("historyWords");
    } else {
      historyWords = [];
    }
    if (e.detail.value.keywords) {
      historyWords.unshift(e.detail.value.keywords);
      if (historyWords.length > 10) {
        historyWords.splice(10, historyWords.length - 1);
      }
      wx.setStorageSync("historyWords", historyWords);
      this.setData({
        searchCurr: e.detail.value.keywords,
        historyWords: wx.getStorageSync("historyWords"),
        hashistory: true
      });
    }
  },
  getHistory() {
    var that = this;
    historyWords = wx.getStorageSync("historyWords");
    if (wx.getStorageSync("historyWords").length > 0) {
      that.setData({
        hashistory: true,
        historyWords: wx.getStorageSync("historyWords")
      });
    } else {
      that.setData({
        hashistory: false
      });
    }
  },
  emptyHistory(e) {
    historyWords = [];
    wx.removeStorageSync("historyWords");
    this.setData({
      hashistory: false,
      historyWords: wx.getStorageSync("historyWords")
    });
  },

  clickhistory(e) {
    this.data.submitData.page = 1;
    this.data.submitData.keywords = e.target.dataset.keyswords;
    this.setData({
      searchCurr: e.target.dataset.keyswords
    });
    this.getGoodList();
  },
  getGoodList() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=wxapp.goods",
      showToast: false,
      data: that.data.submitData,
      method: "GET",
      success: function(res) {
     //   console.log(res)
        var newgoods = res.data.result.goods_list;
        if (res.data.result.goods_list) {
          that.setData({
            refresh: false
          });
        } else {
          that.setData({
            noMoreData: true
          });
        }
        if (that.data.submitData.page == 1) {
          var ms = [];
        } else {
          var ms = that.data.GoodListData;
        }
        for (var i in newgoods) {
          if (newgoods[i].title.length > 26) {
            newgoods[i].title = newgoods[i].title.substring(0, 27) + "...";
          }
          if (ms[i] != newgoods[i]) {
            ms.push(newgoods[i]);
          }
        }
        if (ms.length == 0) {
          that.setData({
            GoodListData: ms
          });
        } else {
          wx.stopPullDownRefresh();
          that.setData({
            GoodListData: ms
          });
        }
      }
    });
  },
  returnArrive(e) {
    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true,
      noMoreData: false
    });
    this.data.submitData.page = this.data.submitData.page + 1;
    that.getGoodList();
    wx.showToast({
      title: "加载中",
      icon: "loading"
    });
  },
  tapGoods: function(e) {
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: "/pages/goods/detail/detail?objectId=" + objectId
    });
  },

  search: function(e) {
    var keywords = this.data.keywords1;
    wx.navigateTo({
      url: "/pages/goods/list/list?keywords=" + keywords1
    });
  },
  bindChange: function(e) {
    var keywords = e.detail.value;
    this.setData({
      keywords1: keywords
    });
  },
  click: function(e) {
    var keywords = e.currentTarget.dataset.word;
    wx.navigateTo({
      url: "../../../../goods/list/list?keywords=" + keywords
    });
  }
});
