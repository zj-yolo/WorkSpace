var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var that = this;
Page({
  data: {
    loading: true,
    isPhoto: '',
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    showImage: false,
  },
  onLoad: function(options) {
    that = this;
    that.setData({
      shopId: options.id
    })

    server.sendRequest({
      url: '?r=wxapp.shop&merchid=' + that.data.shopId,
      showToast: false,
      data: {},
      method: 'GET',
      success: function(res) {
        that.setData({
          shopinfo: res.data.result.shopinfo,
          advs: res.data.result.advs,
          loading: false
        })
        if (res.data.result.banners[0]) {
          that.setData({
            banners: res.data.result.banners,
            isPhoto: true,
          })
        } else {
          that.setData({
            isPhoto: false,
          })
        }
        if (res.data.result.advs[0]) {
          that.setData({
            advs: res.data.result.advs,
            isAdvs: true,
          })
        } else {
          that.setData({
            isAdvs: false,
          })
        }
      }
    })
  },
  map: function() {
    that = this;
    var latitude = parseFloat(that.data.shopinfo.lat)
    var longitude = parseFloat(that.data.shopinfo.lng)
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    })
  },

  showImages: function() {
    that = this;
    that.setData({
      showImage: false
    })
  },

  joinImage: function(e) {
    that = this;
    var currIndex = e.currentTarget.dataset.index;
    if (!that.data.showImage) {
      that.setData({
        showImage: true,
        nowImg: that.data.banners[currIndex].thumb
      })
    }
  },
  dialPhone: function() {
    that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.shopinfo.mobile
    })
  }


})