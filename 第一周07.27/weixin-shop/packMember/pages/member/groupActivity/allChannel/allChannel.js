var that = '';
var server = require('../../../../../utils/server');
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
  onLoad: function (options) {
    that = this;
    utoken = wx.getStorageSync("utoken");
    that.getList();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: res.windowWidth / 3,
          imageWidth2: res.windowWidth / 9 - 10,
          personImageWidth1: res.windowWidth / 0.5,
        })
      }
    })
  },

  onShow: function () {
    var that = this;
    if (that.data.isJoinDrtial) {
      that.getList();
    }
  },
   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  getList: function () {
    server.sendRequest({
      url: '?r=activity.index.activity_list&utoken=' + utoken,
      method: 'GET',
      success: function (res) {
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
  },


  joinDetail: function () {
    wx.navigateTo({
      url: 'channelDetail/channelDetail',
    })
  },
  joinCreatActivity: function () {
    wx.redirectTo({
      url: "/packMember/pages/member/groupActivity/groupActivity",
    })
  },
  joinUserInfo: function (e) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    var currid = parseInt(e.currentTarget.dataset.id)
    that.setData({
      isJoinDrtial: true
    })
        server.sendRequest({
          url: '?r=activity.index.views',
          data: {
            utoken: utoken,
            activity_id: currid
          },
          success: function (res) {
            wx.navigateTo({
              url: '/packMember/pages/member/groupActivity/establishActivity/establishActivity?activity_id=' + currid,
            })
          }
        })
  },

})