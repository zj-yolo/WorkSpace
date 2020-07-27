var server = require('../../../utils/server');
var utoken = wx.getStorageSync('utoken');
var categoryId = ''
var keywords = ''
var cPage = 1;
Page({
  data: {
    loading: true,
    keywords: '',
    goods: [],
    empty: false,
    style: true,
    showL: false,
    noMoreData: false,
    refresh: false,
    saleIndex: '0',
    saleArrowTop: '',
    priceArrowTop: '',
    submitData: {},
    showScrollTop: false,
    is_mianyi: 0
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      is_mianyi: wx.getStorageSync('is_mianyi')
    })
    utoken = wx.getStorageSync('utoken');
    cPage = 1;
    var showToast = false;
    that.data.submitData = {
      utoken: utoken,
      page: 1,
      sort: '',
      sort_asc: '',
      cate: ''
    }
    if (options.categoryId) {
      categoryId = options.categoryId;
      that.data.submitData.cate = options.categoryId;
      that.setData({
        submitData: that.data.submitData
      })
    }
    if (options.keywords) {
      if (options.keywords != "undefined") {
        keywords = options.keywords;
        that.data.submitData.keywords = options.keywords;
        that.setData({
          keywords: keywords
        })
      }
    }
    //生态通的代码
    // let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    // if (extConfig.tabBarPage) {
    //   var tabBarPage = extConfig.tabBarPage;
    //   for (var i in tabBarPage) {
    //     if (tabBarPage[i] == '/pages/goods/list/list') {} else {
    //       that.getList(that.data.submitData);
    //     }
    //   }
    // }

    //新
    that.getList(that.data.submitData);
  },

  onShow: function(e) {
    var that = this;
    var showToast = false;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    if (extConfig.tabBarPage) {
      var tabBarPage = extConfig.tabBarPage;
      for (var i in tabBarPage) {
        if (tabBarPage[i] == '/pages/goods/list/list') {
          that.getList(that.data.submitData)
        }
      }
    }
  },

  onUnload: function() {
    var that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    if (extConfig.tabBarPage) {
      var tabBarPage = extConfig.tabBarPage;
      for (var i in tabBarPage) {
        if (tabBarPage[i] == '/pages/goods/list/list') {
          that.data.submitData.cate = '';
          that.data.submitData.page = 1;
          that.data.submitData.keywords = '';
          that.setData({
            submitData: that.data.submitData,
            goods: [],
            loading: false,
            keywords: ''
          })
        }
      }
    }
    that.setData({
      loading: false
    })
  },

  onPageScroll: function(e) {
    var that = this;
    if (e.scrollTop > 500) {
      that.setData({
        showScrollTop: true
      })
    } else {
      that.setData({
        showScrollTop: false
      })
    }
  },
  //返回顶部
  goToTop: function() {
    var that = this;
    that.setData({
      showScrollTop: false
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  //刚进入页面时获取列表
  getList: function(submitdata) {
    var that = this;
    var utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '?r=wxapp.goods',
      showToast: false,
      data: submitdata,
      method: "GET",
      success: function(res) {

        if (res.data.result.goods_list.length > 0) {
          var myGoodList = res.data.result.goods_list;
          for (var i in myGoodList) {
            if (myGoodList[i].title.length > 26) {
              myGoodList[i].title = myGoodList[i].title.substring(0, 27) + '...';
            }
          }
          that.setData({
            refresh: false,
            goods: myGoodList,
            empty: false
          });
        } else {
          that.setData({
            noMoreData: true,
            empty: true
          })
        }
        that.setData({
          loading: false
        })
      }
    })
  },
  getGoodsList: function(submitdata, showToast) {
    var that = this;
    var showToast = showToast;
    server.sendRequest({
      url: '?r=wxapp.goods',
      showToast,
      data: submitdata,
      method: 'GET',
      success: function(res) {

        var newgoods;
        if (res.data.result.goods_list.length > 0) {
          newgoods = res.data.result.goods_list;
          that.setData({
            refresh: false
          });
        } else {
          newgoods = [];
          that.setData({
            noMoreData: true
          })
        }
        var ms = that.data.goods
        for (var i in newgoods) {
          if (newgoods[i].title.length > 26) {
            newgoods[i].title = newgoods[i].title.substring(0, 27) + '...';
          }
          if (ms[i] != newgoods[i]) {
            ms.push(newgoods[i]);
          }
        }
        if (ms.length == 0) {
          that.setData({
            empty: true,
          });
        } else {
          that.setData({
            empty: false
          });

          wx.stopPullDownRefresh();

          that.setData({
            goods: ms,

          });
        }
        that.setData({
          loading: false
        })
      }
    });
  },
  //获取首页数据
  search: function(e) {
    var that = this;
    cPage = 1;
    that.data.goods = [];
    that.data.submitData.page = 1;
    that.data.submitData.keywords = keywords;
    that.getGoodsList(that.data.submitData)
  },
  bindChange: function(e) {
    var that = this;
    keywords = e.detail.value;
  },
  tapGoods: function(e) {
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: "../../../../../detail/detail?objectId=" + objectId
    });
  },
  onReachBottom: function() {
    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true,
      noMoreData: false
    });
    that.data.submitData.page = that.data.submitData.page + 1;
    that.getGoodsList(that.data.submitData);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      goods: []
    });
    cPage = 1;
    that.data.submitData.page = 1;
    that.getGoodsList(that.data.submitData);
    wx.stopPullDownRefresh()
  },
  // 选择排列
  styleSelect: function() {
    var that = this;
    if (that.data.style) {
      that.setData({
        style: false
      })
    } else {
      that.setData({
        style: true
      })
    }
  },
  selectSalePri: function(e) {
    var that = this;
    that.data.submitData.page = 1;
    cPage = 1;
    if (that.data.submitData.keywords) {
      if (keywords == '') {
        that.data.submitData.keywords = '';
      }
    }
    if (e.currentTarget.dataset.index == '0') {
      that.data.submitData.sort = '';
      that.data.submitData.sort_asc = '';
      that.setData({
        goods: [],
        saleIndex: e.currentTarget.dataset.index,
        priceArrowTop: '',
        saleArrowTop: ''
      })
      that.getGoodsList(that.data.submitData);
    }
    if (e.currentTarget.dataset.index == '1') {
      that.data.submitData.sort = 'sales_sum';
      if (that.data.saleArrowTop == '') {
        that.data.submitData.sort_asc = 'desc';
        that.setData({
          saleArrowTop: 'true'
        })
      } else {
        if (that.data.saleArrowTop == 'true') {
          that.data.submitData.sort_asc = 'asc';
          that.setData({
            saleArrowTop: 'false'
          })
        } else {
          that.data.submitData.sort_asc = 'desc';
          that.setData({
            saleArrowTop: 'true'
          })
        }
      }
      that.setData({
        goods: [],
        saleIndex: e.currentTarget.dataset.index,
        priceArrowTop: ''
      })
      that.getGoodsList(that.data.submitData);
    }
    if (e.currentTarget.dataset.index == '2') {
      that.data.submitData.sort = 'is_new';
      that.data.submitData.sort_asc = '';
      that.setData({
        goods: [],
        saleIndex: e.currentTarget.dataset.index,
        priceArrowTop: '',
        saleArrowTop: ''
      })
      that.getGoodsList(that.data.submitData);
    }
    if (e.currentTarget.dataset.index == '3') {
      that.data.submitData.sort = 'shop_price';
      if (that.data.priceArrowTop == '') {
        that.data.submitData.sort_asc = 'desc';
        that.setData({
          priceArrowTop: 'true'
        })
      } else {
        if (that.data.priceArrowTop == 'true') {
          that.data.submitData.sort_asc = 'asc';
          that.setData({
            priceArrowTop: 'false'
          })
        } else {
          that.data.submitData.sort_asc = 'desc';
          that.setData({
            priceArrowTop: 'true'
          })
        }
      }
      that.setData({
        goods: [],
        saleIndex: e.currentTarget.dataset.index,
        saleArrowTop: ''
      })
      that.getGoodsList(that.data.submitData);
    }
  }
});