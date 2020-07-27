var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
var utoken = wx.getStorageSync("utoken");
var formId;
Page({
  data: {
    orderData: '',
    shuoming: true,
    loading: true
  },
  onLoad: function(e) {

    var that = this
    console.log(e)
    if (e.goodsid) {
      that.setData({
        goodsid: e.goodsid,
      })
    }
    if (e.itemid) {
      that.setData({
        itemsid: e.itemid,
      })
    }
    if (e.num) {
      that.setData({
        total: e.num,
      })
    }
    that.getOrderData()
  },
  onShow: function() {
    console.log('11', wx.getStorageSync("addrdata"))
    var that = this
    if (wx.getStorageSync("addrdata").id) {
      that.setData({
        address: wx.getStorageSync("addrdata").addressInfo,
        addressid: wx.getStorageSync("addrdata").id
      })
    }
  },
  getOrderData: function() {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.order',
      method: 'GET',
      data: {
        utoken: utoken,
        itemsid: that.data.itemsid, //规格Id
        goodsid: that.data.goodsid, //商品id
        total: that.data.total //数量
      },
      success: function(res) {
        if (res.data.status == 1) {
          var content = res.data.result.info.rules
          WxParse.wxParse('contain', 'html', content, that, 5);
          if (res.data.result.address == false) {
            wx.showModal({
              title: '请先添加地址',
              content: '',
            })
          }
          that.setData({
            orderData: res.data.result.goods,
            count: res.data.result.total,
            totalprice: res.data.result.totalprice,
            address: res.data.result.address,
            addressid: res.data.result.address.id,
            loading: false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
          that.setData({
            msgdata: res.data.msg
          })
          wx.navigateTo({
            url: '../../../../pages/member/index/index',
          })
        }

      }
    })
  },
  // 选择地址
  addressSelect: function() {
    wx.navigateTo({
      url: '../../../../pages/address/select/index'
    });
  },
  submit: function(e) {
    var that = this
    formId = e.detail.formId,
      server.sendRequest({
        url: '?r=wxapp.crowdFunding.order',
        method: 'POST',
        data: {
          utoken: utoken,
          itemsid: that.data.itemsid, //规格Id
          goodsid: that.data.goodsid, //商品id
          total: that.data.total, //数量
          aid: that.data.addressid,
          remark: e.detail.value.remark
        },
        success: function(res) {
          console.log('1221', res.data.result)
          if (res.data.status == 1) {
            that.setData({
              money: res.data.result.money,
              orderid: res.data.result.orderid,
              ordersn: res.data.result.ordersn
            })
            that.orderPay()
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }

        }
      })
  },
  orderPay: function() {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.order.pay',
      data: {
        utoken: utoken,
        orderid: that.data.orderid,
      },
      method: 'POST',
      success: function(res) {
        if (res.data.status == 1) {
          server.globalData.wxdata = res.data.result.data;
          server.globalData.order = res.data.result.order;
          that.setData({
            paydata: res.data.result.data,
            order: res.data.result.order
          });

          let wxdata = server.globalData.wxdata
          let timeStamp = wxdata.timeStamp + "";
          // 有企业支付直接微信支付
          that.pay();
        } else if (res.data.status == 10) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            url: "../../member/index/index"
          });
          return;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            url: "../../member/index/index"
          });
          return;
        }
      }
    })
  },
  // 支付
  pay: function() {
    let that = this;
    var wxdata = server.globalData.wxdata
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package
    var sign = wxdata.sign;
    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': package1,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': sign,
      'success': function(res) {
        console.log('成功')
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 4000
        })
        wx.navigateTo({
          url: '../orderList/index',
        })
      },
      'fail': function(res) {
        console.log('失败')
        // wx.showToast({
        //   title: '支付失败',
        //   icon: 'none',
        //   duration: 4000
        // })
        setTimeout(function() {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 3000
          })
        }, 1000)
        wx.navigateTo({
          url: '../orderList/index',
        })
      }
    })
  },
  zhankai: function() {
    var that = this
    if (that.data.shuoming == false) {
      that.setData({
        shuoming: true
      })
    } else {
      that.setData({
        shuoming: false
      })
    }

  }
})