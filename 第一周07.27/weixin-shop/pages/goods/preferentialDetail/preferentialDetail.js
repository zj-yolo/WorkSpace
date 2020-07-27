var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    galleryHeight: getApp().screenWidth,
    logid: '',
    detailData: '',
    unit: '',
  },

  onLoad: function(options) {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    that.setData({
      logid: options.logid
    })
  },
  onShow() {
    utoken = wx.getStorageSync("utoken");
    this.getDetail(this.data.logid);
  },

  getDetail(logid) {
    var that = this;
    server.sendRequest({
      url: '?r=goods.detail.discountDetail',
      data: {
        utoken: utoken,
        logid: logid
      },
      method: 'get',
      success: function(res) {
        if (typeof res.data.result != 'undefined') {
          if (res.data.result.unit) {
            that.setData({
              unit: res.data.result.unit
            })
          } else {
            that.setData({
              unit: '件'
            })
          }
          that.setData({
            loading: false,
            detailData: res.data.result
          })
        }
      }
    })
  },

  buy() {
    if ((typeof this.data.detailData.spec === 'object' && this.data.detailData.spec.total > 0) || (typeof this.data.detailData.spec !== 'object' && this.data.detailData.total > 0)) {
      var total = this.data.detailData.spec.total ? this.data.detailData.spec.total : this.data.detailData.total;
      var optionid = this.data.detailData.spec.goods_spec ? this.data.detailData.spec.goods_spec : 0;
      wx.navigateTo({
        url: '../../order/ordersubmit/index?logid=' + this.data.logid + '&id=' + this.data.detailData.id + '&total=' + total + '&optionid=' + optionid
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '该商品已经无法购买了',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#FE6201',
        success: function() {
          return false;
        }
      });
    }
  }

})