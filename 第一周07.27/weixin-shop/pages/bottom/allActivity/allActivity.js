var that = '';
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({

  data: {
    showImage: false,
    isPlay: true,
    isMylist: false,
    Imagenum: 6,
    imageWidth: '',
    imageWidth2: '',
    personImageWidth1: '',
    personImageWidth2: '',
    isJoinDrtial: false
  },

  onLoad: function(options) {
    that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=activity.index.activity_list&utoken=' + utoken,
      data: {},
      method: 'GET',
      success: function(res) {
        if (res.data.result[0]) {
          that.setData({
            concentList: res.data.result,
            isMylist: false
          });
        } else {
          that.setData({
            isMylist: true
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          imageWidth: res.windowWidth / 3 - 10,
          imageWidth2: res.windowWidth / 9 - 10,
          personImageWidth1: res.windowWidth / 0.5
        })
      }
    })
  },

  onShow: function() {
    if (that.data.isJoinDrtial) {
      server.sendRequest({
        url: '?r=activity.index.activity_list&utoken=' + utoken,
        data: {},
        method: 'GET',
        success: function(res) {
          that.setData({
            concentList: res.data.result
          });
        }
      })
    }

  },

  joinCreatActivity: function() {
    wx.navigateTo({
      url: "/packMember/pages/member/groupActivity/groupActivity"
    })

  },


  joinUserInfo: function(e) {
    var utoken = wx.getStorageSync("utoken");
    var that = this;
    var currIndex = parseInt(e.currentTarget.dataset.index)
    that.setData({
      isJoinDrtial: true
    })
    server.sendRequest({
      url: '?r=activity.index.activity_list&utoken=' + utoken,
      data: {},
      method: 'GET',
      success: function(res) {
        that.setData({
          activity_id: res.data.result[currIndex].id
        });
        server.sendRequest({
          url: '?r=activity.index.views&utoken=' + utoken + '&activity_id=' + that.data.activity_id,
          data: {},
          method: 'POST',
          success: function(res) {
            wx.navigateTo({
              url: '/packMember/pages/member/groupActivity/establishActivity/establishActivity?activity_id=' + that.data.activity_id
            })
          }
        })
      }
    })
  }
})