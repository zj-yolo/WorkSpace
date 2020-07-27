// pages/groupbuy/groupList/index.js
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    select: 0
  },
  onLoad: function(options) {
    var that = this;
    that.loadingData(that.data.select);
  },
  loadingData: function(index) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.groups.team.get_list',
      showToast: false,
      data: {
        utoken: utoken,
        success: that.data.select
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          loading: false,
          data: res.data.result.list
        })
      }
    })
  },
      onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  select: function(e) {
    var that = this;
    that.setData({
      data: ''
    })
    that.setData({
      select: e.currentTarget.dataset.index
    });
    that.loadingData(e.currentTarget.dataset.index);
  },onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  toDetail: function(res) {
    var that = this;
    wx.navigateTo({
      url: "./detail/index?id=" + res.currentTarget.dataset.id + '&key=' + that.data.select + "&teamid=" + res.currentTarget.dataset.teamid
    })
  },
  buyAgain(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/groupbuy/detail/index?id='+id,
    })
  },
  onShareAppMessage: function() {

  }
})