var server = require('../../../utils/server');
var cPage = 1,
  utoken;
Page({
  data: {
    loading: true,
    tabs: 1,
    orders: [],
    collects: [],
    noInfo: false,
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
    is_mianyi: 0
  },
  onLoad: function() {
    this.setData({
      is_mianyi:wx.getStorageSync('is_mianyi')
    })
    cPage = 1;
    var showToast = false;
    this.getCollectLists(1, showToast);
    return;

  },
  tab(e) {
    var that = this;
    var showToast = false;
    cPage = 1
    that.setData({
      loading: true,
      collects: [],
      tabs: e.currentTarget.dataset.tab
    })
    if (that.data.tabs == 1) {
      that.getCollectLists(1, showToast);
    } else {
      that.getData(1);
    }
  },
  details: function(e) {
    var objectId = e.currentTarget.dataset.goodsId;
    let that = this;

    if (that.data.tabs == 1) {
      wx.navigateTo({
        url: "../../goods/detail/detail?objectId=" + objectId
      });
    } else {
      wx.navigateTo({
        url: "/packageA/pages/CrowdFunding/detail/index?id=" + objectId
      })
    }

  },
  getData(cPage) {
    var that = this;

    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.goods.collectList',
      data: {
        utoken: utoken,
        page: cPage,
      },
      method: 'GET',
      success: function(res) {
        var datas = res.data.result;
        var ms = that.data.collects;

        if (datas.length > 0) {

          for (var i in datas) {
            ms.push(datas[i]);
          }
          console.log(ms);
          that.setData({
            collects: ms,
            noInfo: false,
            finishEnd: false
          });
        } else {
          console.log(2);
          if (cPage == 1) {
            that.setData({
              noInfo: true
            });
          } else {
            that.setData({
              finishEnd: true
            });

          }
        }
        that.setData({
          loading: false
        });
      }
    })


  },
  //删除
  deleteGoods: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      confirmColor: '#FF6A6A',
      content: '确定删除该收藏吗？',

      success: function(res) {
        if (res.confirm) {

          if (that.data.tabs == 1) {
            var goods_id = e.currentTarget.dataset.goodsId;;
            var ctype = 1;
            utoken = wx.getStorageSync("utoken");

            server.sendRequest({
              url: '?r=wxapp.member.favorite.remove',
              data: {
                utoken: utoken,
                ids: goods_id,
              },
              method: 'GET',
              success: function(res) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
                cPage = 1;
                that.setData({
                  collects: []
                });
                that.getCollectLists(1);
              }
            })

          } else {
            var goods_id = e.currentTarget.dataset.goodsId;
            utoken = wx.getStorageSync("utoken");
            server.sendRequest({
              url: '?r=wxapp.crowdFunding.goods.collect',
              data: {
                utoken: utoken,
                goodsid: goods_id,
                isfavorite: 0
              },
              method: 'GET',
              success: function(res) {
                cPage = 1;
                that.setData({
                  collects: []
                });
                that.getData(cPage);

              }
            })

          }

        }
      }
    })
  },
  onReachBottom: function() {
    var that = this;
    if (!that.data.finishEnd) {
      cPage++;
      if (that.data.tabs == 1) {
        this.getCollectLists(cPage);
      } else {
        this.getData(cPage);
      }

      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
    }


  },
  onPullDownRefresh: function() {
    cPage = 1;
    this.data.collects = [];
    this.getCollectLists(cPage);
    wx.stopPullDownRefresh();
  },

  getCollectLists: function(page, showToast) {
    var that = this;
    if (showToast == undefined) {
      var showToast = true;
    } else {
      var showToast = showToast;
    }
    var utoken = wx.getStorageSync("utoken");
    //我的收藏关注
    server.sendRequest({
      url: '?r=wxapp.member.favorite',
      showToast,
      data: {
        utoken: utoken,
        page: page,
      },
      method: 'GET',
      success: function(res) {
        var datas = res.data.result;
        var ms = that.data.collects;
        if (datas.length > 0) {
          for (var i in datas) {
            ms.push(datas[i]);
          }
          that.setData({
            collects: ms,
            noInfo: false,
            finishEnd: false
          });
        } else {
          if (page == 1) {
            that.setData({
              noInfo: true
            });
          } else {
            that.setData({
              finishEnd: true
            });
          }
        }
        that.setData({
          loading: false
        });
      }
    })
  },

});