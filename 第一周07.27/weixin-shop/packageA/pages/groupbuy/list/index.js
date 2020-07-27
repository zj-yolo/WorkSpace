var server = require('../../../../utils/server');
var input;
var utoken = wx.getStorageSync("utoken");
var page = 1,
  arr = [];
Page({
  data: {
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    refresh: false,
    loading: true

  },
  onLoad: function (res) {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    that.setData({
      categoryid: res.categoryid
    })
    that.loadPageData();

  },

  toDetail: function (res) {
    wx.navigateTo({
      url: "../detail/index?id=" + res.currentTarget.dataset.id
    })
  },
  loadPageData: function () {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups.category.get_list',
      showToast: false,
      data: {
        utoken: utoken,
        category: that.data.categoryid,
        page: page
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
  },onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  bindinput: function (res) {
    if (res.detail.value) {
      input = res.detail.value
    } else {
      input = '';
    }
  },
  formSubmit: function (res) {
    arr = [];
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups.category.get_list',
      data: {
        utoken: utoken,
        category: that.data.categoryid,
        page: page,
        keyword: input
      },
      method: 'GET',
      success: function (res) {

        that.setData({
          data: res.data.result.list
        })
        for (let x in res.data.result.list) {
          arr.push(res.data.result.list[x]);
        }
      }
    })

  },
  bottom: function (e) {
    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true
    })
    page = page + 1;
    server.sendRequest({
      url: '?r=wxapp.groups.category.get_list',
      data: {
        utoken: utoken,
        category: that.data.categoryid,
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
          that.setData({
            refresh: false
          })
        }
        that.setData({
          data: arr,
        })

      }
    });
  },

})