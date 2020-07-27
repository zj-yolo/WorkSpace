var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var page = 1,
  arr = [];


Page({
  data: {
    refresh: false,
    loading: true,
    cpage: 1,
    recgoods: [],
    highlight4: ['highlight4'],
    id: '',
    objectId: '',
    category: [],
    flag: true,
    data: '',
    arr: [],
    showIndex: false,
    tabIndex: 0,
    select: 0,
    orderdata: []
  },
  onLoad: function (options) {
    var that = this;
    if(options.typeIndex){
      that.setData({
        tabIndex:options.typeIndex
      })
    }
    arr = []
    utoken = wx.getStorageSync("utoken");
    if (that.data.tabIndex == 0) {
      that.loadPageData(that.data.cpage);
    }else{
      that.loadOrderList()
    }

    var pages = getCurrentPages()
    if (pages.length == 1) {
      this.setData({
        showIndex: true
      })
    };
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  tapTopCategory: function (e) {
    var that = this;
    that.data.objectId = e.currentTarget.dataset.id;
    var index = parseInt(e.currentTarget.dataset.index);
    that.setHighlight(index);
    that.setData({
      index: index,
      id: that.data.objectId,
      refresh: false,
      noMoreData: false
    });
    page = 1
    that.data.data = []
    arr = []
    that.loadPageDataList(that.data.id)
  },
  setHighlight: function (index) {
    var highlight4 = [];
    for (var i = 0; i < this.data.topCategories; i++) {
      highlight4[i] = '';
    }
    highlight4[index] = 'highlight4';
    this.setData({
      highlight4: highlight4
    });
  },
  handleTab(e) {
    let that=this;
    that.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    if (that.data.tabIndex == 0) {
      that.loadPageData(that.data.cpage);
    }else{
      that.loadOrderList()
    }
  },
  handleselect(e) {
    this.setData({
      select: e.currentTarget.dataset.index
    })
    this.loadOrderList(e.currentTarget.dataset.index)
  },
  //热卖以及topbar
  loadPageData: function (page) {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups',
      showToast: false,
      data: {
        utoken: utoken,
        page: page
      },
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          if (res.data.result.recgoods != '') {
            for (var i in res.data.result.recgoods) {
              that.data.recgoods.push(res.data.result.recgoods[i]);
            }
            that.setData({
              refresh: false
            })
          }
          that.setData({
            advs: res.data.result.advs,
            category: res.data.result.category,
            recgoods: that.data.recgoods,
            loading: false
          })

          if (that.data.flag == true) {
            that.loadPageDataList(that.data.category[0].id)
            that.setData({
              flag: false,
              id: that.data.category[0].id
            })
          }
        }
      }
    })
  },
  toDetail: function (res) {
    wx.navigateTo({
      url: "/packageA/pages/groupbuy/detail/index?id=" + res.currentTarget.dataset.id
    })
  },

  toorderDetail(e){
    let orderid=e.currentTarget.dataset.id;
    let teamid=e.currentTarget.dataset.teamid;
    wx.navigateTo({
      url: "/packMember/pages/member/allTool/details/index?orderid="+orderid +'&teamid='+teamid
    })
  },
  togroup(res){
      var that = this;
      wx.navigateTo({
        url: "/packageA/pages/groupbuy/groupList/detail/index?id=" + res.currentTarget.dataset.id + '&key=' + that.data.select + "&teamid=" + res.currentTarget.dataset.teamid
      })
  },
  loadPageDataList: function (categoryId) {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups.category.get_list',
      showToast: false,
      data: {
        utoken: utoken,
        category: categoryId,
        page: 1
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          data: res.data.result.list,
          loading: false
        })
        for (let x in res.data.result.list) {
          arr.push(res.data.result.list[x]);
        }
      }
    })
  },
  onReachBottom: function (e) {
    var that = this;
    // if (that.data.refresh) return;
    // that.setData({
    //   refresh: true
    // })
    if (that.data.tabIndex == 0) {
      page = page + 1;
      server.sendRequest({
        url: '?r=wxapp.groups.category.get_list',
        data: {
          utoken: utoken,
          category: that.data.id,
          page: page
        },
        method: 'GET',
        success: function (res) {
          if (res.data.result.list == '') {
            page = page - 1
          } else {
            for (let x in res.data.result.list) {
              arr.push(res.data.result.list[x])
            }
            // that.setData({
            //   refresh: false
            // })
          }
          that.setData({
            data: arr,
          })
        }
      });
    }
  },
  toList: function (res) {
    wx.navigateTo({
      url: "/packageA/pages/groupbuy/list/index?categoryid=" + res.currentTarget.dataset.id
    })
  },
  previewImageSwiper: function (e) {
    var that = this
    var img_view = []
    for (var i in that.data.advs) {
      img_view.push(that.data.advs[i].thumb)
    }
    wx.previewImage({
      current: that.data.advs[e.currentTarget.dataset.current].thumb,
      urls: img_view
    })
  },
  //拼团订单
  // 订单列表
  loadOrderList() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.groups.team.get_list',
      data: {
        utoken: utoken,
        success: that.data.select
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          orderdata: res.data.result.list
        })
      }
    })
  }
})