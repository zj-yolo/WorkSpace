var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var top_categorys, page = 1,
  level, objectId;
Page({
  data: {
    topCategories: [],
    subCategories: [],
    highlight: ['highlight', '', '', '', '', '', '', '', '', '', '', ''],
    banner: '',
    index: 0,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 1.5,
    refresh: false,
    input: '',
  },
  onLoad: function() {
    var that = this;
    that.leftDate();
  },
  leftDate: function() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.shop.takingOrder.serviceCatergory',
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          topCategories: res.data.result.data.parent,
          objectId: res.data.result.data.parent[0].id
        })
        that.rightData(res.data.result.data.parent[0].id);
      }
    })
  },
  rightData: function(objectId) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.shop.takingOrder.getServiceGoodsList',
      data: {
        category_id: objectId,
        page: 1,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          subCategorListG: res.data.result.goods.list,
        })
      }
    })

  },

  onShow: function() {
    var that = this;
    that.setData({
      input: ''
    })
  },
  search: function(e) {
    wx.navigateTo({
      url: "/packageA/pages/services/search/search"
    });
  },
  formSubmit: function(res) {
    wx.navigateTo({
      url: "/packageA/pages/services/search/search?keywords=" + res.detail.value

    });
  },
  tapTopCategory: function(e) {
    var that = this;
    var objectId = e.currentTarget.dataset.id;
    var index = parseInt(e.currentTarget.dataset.index);
    var level = e.currentTarget.dataset.level;

    that.setHighlight(index);
    that.setData({
      index: index,
      id: objectId,
      objectId: objectId

    });
    that.rightData(objectId);
  },
  setHighlight: function(index) {
    var highlight = [];
    for (var i = 0; i < this.data.topCategories; i++) {
      highlight[i] = '';
    }
    highlight[index] = 'highlight';
    this.setData({
      highlight: highlight
    });
  },
  // avatarTap: function(e) {
  //   var that = this;
  //   objectId = e.currentTarget.dataset.objectId;
  //   wx.navigateTo({
  //     url: "/packageA/pages/services/list/index?categoryId=" + objectId
  //   });
  // },
  avatarDetail: function(e) {
    var that = this;
    var objectIdD = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: "/packageA/pages/services/detail/index?objectId=" + objectIdD
    })
  },
  bottom: function(e) {

    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true
    })
    page = page + 1;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.shop.takingOrder.getServiceGoodsList',
      data: {
        category_id: that.data.objectId,
        page: page,
        utoken: utoken,
        page: page
      },
      method: 'GET',
      success: function(res) {
        var arr = [];
        for (let x in that.data.subCategorListG) {
          arr.push(that.data.subCategorListG[x]);
        }
        if (res.data.result.goods.list) {
          for (let y in res.data.result.goods.list) {
            arr.push(res.data.result.goods.list[y]);
          }
          that.setData({
            subCategorListG: arr,
            refresh: false
          });
        } else {
          page = page - 1;
        }
      }
    });
  }
})