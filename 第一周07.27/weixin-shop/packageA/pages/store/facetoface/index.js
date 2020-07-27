var server = require('../../../../utils/server.js');
var utoken = wx.getStorageSync("utoken");
var coupon_price, coupon_name, coupon_id, coupon_backstr, ID, sub_couponprice, couponprice
Page({
  data: {
    windowWidth: '',
    windowHeight: '',
    hidden: false,
    hiddenB: true,
    coupon_paper: 0,
    select_coupon: 'x',
    coupon_price: '',
    coupon_name: '',
    coupon_id: '',
    coupon_backstr: '',
    ID: '',
    sub_couponprice: '',
    couponprice: ''
  },
  onLoad(e) {
    var that = this
    console.log(e)
    utoken = wx.getStorageSync("utoken");
    that.setData({
      storeid: e.storeid,
      address: e.address
    })
    coupon_price = '', coupon_name = '', coupon_id = '', coupon_backstr = '', ID = '', couponprice = '', sub_couponprice = ''
    that.getSystem()
    that.getOtherDisCount()
    // that.getCoupon()
  },
  getSystem: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {

        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })

      }
    })
  },
  beizhu: function (e) {
    console.log(e.currentTarget.dataset.showbz)
    var that = this
    that.setData({
      hidden: true,
      hiddenB: false
    })
  },
  // 获取满减接口
  getOtherDisCount: function (e) {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.store.create.getFavourable',
      data: {
        utoken: utoken,
      },
      method: 'GET',
      success: function (res) {
        console.log('getOtherDisCount', res.data.result.saleset.enoughmoney)
        that.setData({
          enoughmoney: res.data.result.saleset.enoughmoney,
          enoughdeduct: res.data.result.saleset.enoughdeduct
        })
      }
    });
  },
  // 获取到输入金额
  bindManual: function (e) {
    console.log(e, e.detail.value)
    var that = this
    that.setData({
      money_num: e.detail.value
    })
    that.getCouponList()
    that.getallPrice()
  },
  // 获取到输入金额
  bindManualB: function (e) {
    console.log(e, e.detail.value)
    var that = this
    that.setData({
      price_num: e.detail.value
    })
    that.getCouponList()
    that.getallPrice()
  },
  getCouponList: function (e) {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.util.query1111',
      data: {
        utoken,
        storeid: that.data.storeid,
        money: that.data.money_num,
        type: 0
      },
      method: 'POST',
      success: function (res) {
        console.log('allData', res.data.result)
        that.setData({
          coupons_data: res.data.result,
          coupons_num: res.data.result.coupons
        })
      }
    });
  },
  // 选择优惠券
  Select: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    let that = this;
    if (that.data.select_coupon == index) {
      coupon_price = '';
      coupon_name = '';
      coupon_id = '';
      coupon_backstr = '';
      ID = '';
      that.setData({
        select_coupon: 'x'
      })
    } else {
      if (e.currentTarget.dataset.backstr == "立减") {
        coupon_price = e.currentTarget.dataset.price;
      } else if (e.currentTarget.dataset.backstr == "返现") {
        coupon_price = e.currentTarget.dataset.price;
      } else if (e.currentTarget.dataset.backstr == "折") {
        coupon_price = parseFloat(e.currentTarget.dataset.price)
      }
      coupon_price = coupon_price;
      coupon_name = e.currentTarget.dataset.name;
      coupon_id = e.currentTarget.dataset.id;
      coupon_backstr = e.currentTarget.dataset.backstr;
      ID = e.currentTarget.dataset.id;
      that.setData({
        select_coupon: index,
        coupon_name: e.currentTarget.dataset.name,
        coupon_id: e.currentTarget.dataset.id,
        coupon_price: e.currentTarget.dataset.price
      })
    }
  },
  // 使用优惠券
  getCoupon: function (e) {
    console.log('getCoupon', e)
    let that = this;
    if (e.currentTarget.dataset.index == 'no') {
      that.setData({
        coupon_name: '',
        coupon_price: '',
        coupon_id: '',
        coupon_backstr: '',
        ID: '',
        select_coupon: 'x',
        sub_couponprice: 0
      })
      that.setData({
        coupon_paper: 0
      })
    } else {
      if (coupon_name == '') {
        wx.showModal({
          title: '提示',
          content: '您还未选择优惠卷',
          showCancel: false,
          success: function (res) {
            return;
          }
        })
      }
      that.setData({
        coupon_name: coupon_name,
        coupon_price: coupon_price,
        coupon_id: coupon_id,
        coupon_backstr: coupon_backstr,
        ID: ID
      })
      that.setData({
        coupon_paper: 0
      })
    }
    that.getallPrice()
  },
  getallPrice: function () {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.store.create.getfavourable',
      data: {
        utoken: utoken,
        money: that.data.money_num,
        storeid: that.data.storeid,
        couponid: that.data.coupon_id,
        price: that.data.price_num
        
      },
      method: 'POST',
      success: function (res) {
        console.log('getallPrice', res.data.result)
        that.setData({
          allPrice: res.data.result.totalprice
        })
      }
    });
  },
  // 获取优惠券数据
  getCoupons: function () {
    let that = this;

  },
  // 优惠券显示打开
  Tocoupon: function () {
    let that = this;
    that.setData({
      coupon_paper: 1
    });
  },
  // 优惠券显示关闭
  getunCoupon: function () {
    let that = this;
    that.setData({
      coupon_paper: 0
    })
  },
  formSubmit: function (e) {
    let that = this;
    console.log('111', utoken)
    server.getUserInfo(function () {
      that.submit(e);
    })
  },
  submit: function (e) {
    var that = this
    if (that.data.money_num) {
      that.setData({
        formId: e.detail.formId
      })
      server.sendRequest({
        url: '?r=wxapp.store.create.favourableSubmit',
        data: {
          utoken: utoken,
          money: that.data.money_num,
          storeid: that.data.storeid,
          couponid: that.data.coupon_id,
          price: that.data.price_num,
          openid: server.globalData.openid,
        },
        method: 'POST',
        success: function (res) {
          console.log('formSubmit', res.data.result)
          that.setData({
            allPrice: res.data.result.realprice,
            orderid: res.data.result.orderid,
          })
          wx.navigateTo({
            url: '/pages/order/orderpay/payment?order_id=' + that.data.orderid + '&formId=' + that.data.formId + '&storeid=' + 'isStore'
          });
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '您还未填写价格',
        showCancel: false,
        success: function (res) {
          return;
        }
      })
    }

  }
})