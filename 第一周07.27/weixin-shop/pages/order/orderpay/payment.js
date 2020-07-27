var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var orderId, tabindex;
Page({
  data: {
    orderId: '',
    newOrderID:'',
    loading: true,
    myList: ''
  },
  onLoad: function(options) {
    
    var that = this;
    if (!options.myList || options.myList != 'myList') {
      wx.setStorageSync('isOrder', true);
    }
    if (options.formId) {
      that.setData({
        formId: options.formId
      })
    }
    if (options.myList == "myList") {
      that.setData({
        myList: true
      })
      if (!options.deductcredit3) {
        that.setData({
          couponprice: 0
        });
      }
    }
    if (options.couponprice) {
      that.setData({
        couponprice: options.couponprice
      })
    }
    if (options.deductcredit3) {
      that.setData({
        couponprice: options.deductcredit3
      })
    }
    if (options.storeid) {
      that.setData({
        storeid: options.storeid
      })
    }
    if (options.tabindex) {
      wx.getStorageSync('isOrder') ? wx.removeStorageSync('isOrder') : ''; //清掉缓存字段
    }
    that.time();
    orderId = options.order_id;
    that.setData({
      newOrderID: orderId
    })
    utoken = wx.getStorageSync("utoken");
    if (options.tabindex) {
      var url = '?r=wxapp.services.order.do_pay';
    } else if (options.storeid != "undefined" && options.couponprice) {
      var url = '?r=wxapp.store.pay'
    } else {
      var url = '?r=wxapp.order.pay'
    }
    server.sendRequest({
      url: url,
      showToast: false,
      data: {
        utoken: utoken,
        id: orderId,
        formId: that.data.formId
      },
      method: 'GET',
      success: function(res) {
        if (res.data.status == 1) {
          server.globalData.wxdata = res.data.result.data;
          server.globalData.order = res.data.result.order;
          that.setData({
            loading: false,
            paydata: res.data.result.data,
            order: res.data.result.order
          });
        } else if (res.data.status == 10) {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            // url: "../../member/index/index"
          });
          return;

        } else {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            // url: "../../member/index/index"
          });
          return;

        }

      }
    })

  },
  onShow: function() {
    var that = this;
  },
  time: function() {
    var that = this;
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate() + 1;
    let hour = date.getHours() + 1;
    let min = date.getMinutes();
    if (hour == 24) {
      hour = 0
    };
    let now = hour + ':' + min;
    that.setData({
      now: now
    });
  },
  toweixin: function(e) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    var formId = e.detail.formId;
    var idMy = e.currentTarget.dataset.id;
    wx.getStorageSync('isOrder') ? wx.removeStorageSync('isOrder') : ''; //清掉缓存字段
    server.sendRequest({
      url: "?r=wxapp.formid.getFormidList",
      data: {
        utoken: utoken,
        formId: formId
      },
      method: "GET",
      success: function(res) {}
    })

    wx.showModal({
      title: '提示',
      content: '确定付款吗？',
      success: function(res) {
        utoken = wx.getStorageSync("utoken");
        if (res.confirm) {
          if (that.data.storeid) {
            var url = '?r=wxapp.store.pay.creditpay'
          } else {
            var url = '?r=wxapp.order.pay.creditpay'
          }
          if (that.data.order.price == 0) {
            server.sendRequest({
              url: url,
              data: {
                utoken: utoken,
                id: idMy,
                type: 'member_card'
              },
              method: 'GET',
              success: function(res) {

                if (res.data.status > 0) {
                  server.reportedData('goods_pay_success', {
                    order_id: that.data.newOrderID,
                  });
                  wx.reLaunch({
                    url: '../success/index'
                  });
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function(res) {
                      if (res.confirm) {}
                    }
                  })
                }
              }
            })
          } else {
            server.sendRequest({
              url: url,
              data: {
                utoken: utoken,
                id: idMy
              },
              method: 'GET',
              success: function(res) {


                if (res.data.status > 0) {
                  //数据埋点提交订单
                  server.reportedData('goods_pay_success', {
                    order_id: that.data.newOrderID,
                  });
                  wx.reLaunch({
                    url: '../success/index'
                  });
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function(res) {
                      if (res.confirm) {

                      }
                    }
                  })
                }
              }
            })
          }
        } else if (res.cancel) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            image: '../../../images/eidtNo.png',
            duration: 1500
          })
          if (that.data.myList) {
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)

          } else {
            setTimeout(function() {
              // wx.redirectTo({
              //     url: '../list/list?id=' + 1 + '&currid=' + 1
              // });
              wx.switchTab({
                url: "../../member/index/index"
              });
            }, 1500)
          }
        }
      }
    })
  },
  toStart: function() {
    wx.reLaunch({
      url: '../../index/index'
    })
  },
  pay: function() {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    var wxdata = server.globalData.wxdata
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package
    var sign = wxdata.sign;
    wx.getStorageSync('isOrder') ? wx.removeStorageSync('isOrder') : ''; //清掉缓存字段
    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': package1,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': sign,
      'success': function(res) {
        utoken = wx.getStorageSync("utoken");
        if (tabindex) {
          server.sendRequest({
            url: "?r=wxapp.services.order.updateStatus",
            data: {
              utoken: utoken,
              orderid: orderId
            },
            method: 'GET',
            success: function(res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                image: '../../../images/eidtSucc.png',
                duration: 500
              });
            }
          })
        }

        setTimeout(function() {
          wx.switchTab({
            url: "../../member/index/index"
          });
        }, 500);
      },
      fail: function(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          image: '../../../images/eidtNo.png',
          duration: 1500
        })

        if (that.data.myList) {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)

        } else {
          setTimeout(function() {
            // wx.redirectTo({
            //     url: '../list/list?id=' + 1 + '&currid=' + 1
            // });
            wx.switchTab({
              url: "../../member/index/index"
            });
          }, 1500)
        }
      }
    })
  }
})