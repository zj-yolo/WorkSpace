var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var app = getApp()
Page({
  data: {
    dataMoney: [],
    cardN: '',
    title: '',
    orderid: '',
    weixin_app: '',
    weixin_app_paycon: '',
    weixin_app_payimg: '',
    wxdata: '',
  },
  onLoad: function () {
    console.log('app', app)
    var that = this;
    console.log("that", that)
    console.log("that1", that.options.cardN)
    var utoken = wx.getStorageSync("utoken");
    console.log('utoken', utoken)
    server.sendRequest({
      url: '?r=wxapp.member.vipcard.getlist',
      showToast: false,
      data: {
        utoken: utoken
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.result)
        var dataMoney = res.data.result
        // for (var x in res.data.result) {
        // }
        that.setData({
          dataMoney: dataMoney
        })
      }
    })
    that.setData({
      cardN: that.options.cardN,
      title: that.options.title,
    })
  },
  merberCZ: function (index) {
    var that = this;
    console.log('merberIndex', index, that)
    let orderid;
    let id = that.data.dataMoney[index.currentTarget.dataset.index].id;
    var utoken = wx.getStorageSync("utoken");
    //发起生成订单
    server.sendRequest({
      url: '?r=wxapp.member.vipcard.doPay',
      data: {
        utoken: utoken,
        fee: that.data.dataMoney[index.currentTarget.dataset.index].money,
        cardid: id
      },
      method: 'POST',
      success: function (res) {
        console.log('info', res.data.result)
        server.globalData.wxdata = res.data.result[0].data
        server.globalData.order = res.data.result[0].order;
        orderid = res.data.result[0].orderid;
        that.setData({
          goods_name: res.data.result.params_data.title,
          ordersn: res.data.result.params_data.ordersn,
          price: res.data.result.params_data.fee,
          user: res.data.result.params_data.user,
          orderid: res.data.result[0].orderid,
          // paydata: res.data.result.data,     
          order: res.data.result[0].order,
          weixin_app: res.data.result[0].data.weixin_app,
          weixin_app_paycon: res.data.result[0].data.weixin_app_paycon,
          weixin_app_payimg: res.data.result[0].data.weixin_app_payimg,
          wxdata: res.data.result[0].data,
          orderCont: res.data.result[0].order,
          weixin_app: res.data.result[1].weixin_app,
        });
        wx.setStorageSync('wxdata', that.data.wxdata)
        if (that.data.weixin_app == 1) {
          // console.log(222);
          server.sendRequest({
            url: '?r=wxapp.member.vipcard.paymain',
            data: {
              utoken: utoken,
              id: orderid,
            },
            method: 'GET',
            success: function (res) {
              if (res.data.status == 1) {
                that.setData({
                  paydata: res.data.result.data,
                  order: res.data.result.order
                });
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate() + 1;
                let now = year + '-' + month + "-" + day
                that.setData({
                  now: now
                })
              }
              else if (res.data.status == 10) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                });
                return;
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                });
                return;
              }
              console.log(orderid);
              // console.log('wxdata', that.data.orderid)
              that.setData({
                weixin_app_payimg: that.data.weixin_app_payimg,
              })
              var timeStamp = (wx.getStorageSync('wxdata').timeStamp).toString();
              var nonceStr = wx.getStorageSync('wxdata').nonceStr;
              var package1 = wx.getStorageSync('wxdata').package;
              var sign = wx.getStorageSync('wxdata').sign;
              console.log('hhhh', timeStamp, nonceStr, package1, sign)
              wx.requestPayment({
                'nonceStr': nonceStr,
                'package': package1,
                'signType': 'MD5',
                'timeStamp': timeStamp,
                'paySign': sign,
                'success': function (res) {
                  server.sendRequest({
                    url: '?r=wxapp.member.vipcard.card',
                    data: {
                      utoken: utoken,
                      orderid: that.data.orderid,
                      cardid: that.data.dataMoney[index.currentTarget.dataset.index].id,
                      type:'charge'
                    },
                    method: 'POST',
                    success: function (res) {
                      var cardId = res.data.result;
                      console.log('paysussce', cardId, res)
                      server.sendRequest({
                        url: '?r=wxapp.member.vipcard.updateStatus&cardid=' + cardId + '&utoken=' + utoken,
                        data: {
                        },
                        method: 'POST',
                        success: function (res) {
                          wx.navigateBack({
                            delta:1
                          })
                        }
                      })
                    }
                  })
                  wx.showToast({ title: '支付成功', icon: 'success', duration: 2000 })
                },
                'fail': function (res) {
                  wx.showToast({ title: '支付失败', icon: 'success', duration: 2000 })
                }
              })
            }
          })
        }else{
          wx.navigateTo({
            url: '../../membership/cardSuccess/cardSuccess?orderid=' + orderid + '&cardid=' + id + '&weixin_app=' + that.data.weixin_app + 'recharge=recharge'
          })
          console.log(111)
        }
      },
    })

  },
  merberCZ_two: function (index) {
    // console.log('index', index)
    var that = this;
    console.log("that", that)
    wx.navigateTo({
      url: '../../membership/cardInfo/cardInfo?money=' + that.data.dataMoney[index.currentTarget.dataset.index].money + '&cardid=' + that.data.cardN,
    })
  }
})
