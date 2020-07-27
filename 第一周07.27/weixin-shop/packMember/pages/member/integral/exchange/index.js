var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    animationData: {},
    width: Math.ceil(wx.getSystemInfoSync().windowHeight + 80)
  },
  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    that.setData({
      id: that.options.id
    })
    that.loadingData();
  },
  loadingData: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.creditshop.create&id=" + that.data.id + "&optionid=0",
      showToast: false,
      data: {
        utoken: utoken
      },
      method: "GET",
      success: function(res) {
        that.setData({
          data: res.data.result.goods,
        })
        if (res.data.result.address != "") {
          that.setData({
            address: res.data.result.address
          })
        }
        if (res.data.result.goods.dispatch > '0.00' || res.data.result.goods.money > '0.00') {
          var sum = parseFloat(res.data.result.goods.money) + parseFloat(res.data.result.goods.dispatch)
          that.setData({
            sum: sum
          })
        }
      }

    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onShow: function() {
    var that = this;
    if (wx.getStorageSync('addrdata')) {
      let addrdata = wx.getStorageSync('addrdata');
      let address = {
        realname: addrdata.addressInfo.realname,
        province: addrdata.addressInfo.province,
        city: addrdata.addressInfo.city,
        area: addrdata.addressInfo.area,
        mobile: addrdata.addressInfo.mobile,
        id: addrdata.id
      }
      that.setData({
        address
      })
      wx.removeStorageSync('addrdata');
    }
    that.setData({
      loading: false,
    })
  },
  //点击收货地址
  addressSelect: function() {
    wx.navigateTo({
      url: '/pages/address/select/index?addr=addr'
    });
  },
  toAddrList: function() {
    wx.navigateTo({
      url: "../address/list/index"
    })
  },
  top: function() {
    var that = this;
    if (!that.data.address) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请填写地址后提交',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    var animation = wx.createAnimation({
      timingFunction: 'ease-in',
    }).translate(0, 0 - (this.data.width)).step({
      duration: 1000
    })
    this.setData({
      animationData: animation.export()
    })
  },
  bottom: function() {
    var animation = wx.createAnimation({
      timingFunction: 'ease-in',
    }).translate(0, this.data.width).step({
      duration: 1000
    })

    this.setData({
      animationData: animation.export()
    })
  },
  toSuccess: function() {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.creditshop.detail.pay&id=" + that.data.id,
      data: {
        utoken: utoken,
        addressid: that.data.address.id
      },
      method: "GET",
      success: function(res) {
        if (res.data.result == "") {
          that.setData({
            show: 1,
            strA: res.data.msg
          })
          setTimeout(function() {
            if (res.data.status < 0) {
              wx.reLaunch({
                url: "/pages/index/index"
              })
            }
          }, 2000);
          return;
        }
        // 扣积分接口
        that.setData({
          show: 1,
          strA: res.data.msg
        })
        setTimeout(function() {
          that.setData({
            show: 0,
          });
        }, 2000);
        var logid = res.data.result.logid;
        if (res.data.result.wechat && res.data.result.wechat.data && res.data.result.wechat.data.appId != '' || res.data.result.data) {
          let result = res.data.result;
          wx.setStorageSync('result', result);
          wx.navigateTo({
            url: "/packageA/pages/groupbuy/cashier/index?orderid=" + that.data.id + '&addressid=' + that.data.address.id + "&name=integral"
          })
        } else {
          server.sendRequest({
            url: "?r=wxapp.creditshop.detail.lottery&logid=" + logid,
            data: {
              id: that.data.id,
              utoken: utoken
            },
            method: "GET",
            success: function(res) {}
          })
          wx.navigateTo({
            url: "../success/index?logid=" + logid
          })
        }
      }
    })
  },
  // 跳转到商品详情
  todetail: function(res) {
    console.log(res.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../detail/index?id=' + res.currentTarget.dataset.id
    })
  },
})