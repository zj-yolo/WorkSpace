var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");

Page({
  data: {
    objectArray: ['提现到余额', '提现到微信钱包', '提现到银行卡'],
    index: 0,
    commission_ok: '',
    showAddCard: false,
    bankName: '招商银行',
    cardNumber: '',
    cardNumber1: '',
    name:'',
    tixianMethod: '',
    disabled: false
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  bindPickerChange: function (e) {
    var x = e.detail.value;
    var txName = e.currentTarget.dataset.name
    var that = this;
    that.setData({
      index: x,
      showAddCard: false
    })
    if (that.data.tixianMethod[x] == "手动提现到银行卡") {
        that.setData({
          showAddCard: true
        })
        utoken = wx.getStorageSync('utoken');
        server.sendRequest({
          url: '?r=wxapp.commission.apply&utoken=' + utoken,
          data: {
            utoken: utoken,
            type: 3,
          },
          method: "POST",
          success: function (res) {
            console.log(res)
            var selfArray = [];
            var selfArrayid = [];
            for (var i in res.data.result) {
              selfArray.push(res.data.result[i].bankname);
              selfArrayid.push(res.data.result[i].id);
            }
            that.setData({
              bankArray: selfArray,
              bankid: selfArrayid
            })
          }
        })
      }

  },
  pickedBankCard: function (e) {
    var that = this;
    that.setData({
      bankIndex: e.detail.value,
      bankName: that.data.bankArray[e.detail.value],
    })
  },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.commission.apply&utoken=' + utoken,
      data: {
        new_api: 1
      },
      success: function (res) {
        var commission_ok = res.data.result.realmoney
        var tixianMethod = res.data.result.setting_cash
        console.log('2', tixianMethod)
        var arr = []
        if (tixianMethod.cashalipay == 1) {
          arr.push('手动提现到支付宝')
        }
        if (tixianMethod.cashcard == 1) {
          arr.push('手动提现到银行卡')
        }
        if (tixianMethod.cashcredit == 1) {
          arr.push('提现到商城余额')
        }
        if (tixianMethod.cashother == 1) {
          arr.push('其他提现方式')
        }
        if (tixianMethod.cashweixin == 1) {
          arr.push('提现到微信钱包')
        }
        
      
        console.log('1', arr, tixianMethod.cashalipay)
        that.setData({ commission_ok: commission_ok, tixianMethod: arr })
        
        if (that.data.tixianMethod[0] == "手动提现到银行卡") {
          console.log('222')
          that.setData({
            showAddCard: true
          })
          utoken = wx.getStorageSync('utoken');
          server.sendRequest({
            url: '?r=wxapp.commission.apply&utoken=' + utoken,
            data: {
              utoken: utoken,
              type: 3,
            },
            method: "POST",
            success: function (res) {
              console.log(res)
              var selfArray = [];
              var selfArrayid = [];
              for (var i in res.data.result) {
                selfArray.push(res.data.result[i].bankname);
                selfArrayid.push(res.data.result[i].id);
              }
              that.setData({
                bankArray: selfArray,
                bankid: selfArrayid
              })
            }
          })
        }
      }
    })
  },
  clickNav: function (e) {
    console.log('www', e)
    var that = this;

    console.log(that.data.index)
    that.setData({
      disabled:true
    })
    if (that.data.tixianMethod[that.data.index] == "提现到商城余额") {
      server.sendRequest({
        url: '?r=wxapp.commission.apply',
        data: {
          utoken: utoken,
          type: 0
        },
        method: "POST",
        success: function (res) {
          console.log(res.data.result)
        }
      })
      wx.showToast({
        title: '已提交,请等待审核!',
        icon: 'success',
        duration: 2000
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../register/index'
        })
      }, 1500)
      // 提现到微信钱包
    } else if (that.data.tixianMethod[that.data.index] == "提现到微信钱包") {
      server.sendRequest({
        url: '?r=wxapp.commission.apply',
        data: {
          utoken: utoken,
          type: 1
        },
        method: "POST",
        success: function (res) {
          console.log(res.data.result)
          if (res.data.msg == 1) {
            wx.showToast({
              title: '已提交,请等待审核!',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../register/index'
              })
            }, 1500)

          } else {
            wx.showModal({
              title: '提示',
              content: '提交失败，请重新提交',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        }
      })
    } else if (that.data.tixianMethod[that.data.index] == "手动提现到银行卡") {
      console.log(that.data.bankName, that.data.cardNumber, that.data.cardNumber1);
      if (that.data.bankName == '' || that.data.cardNumber == '' || that.data.cardNumber1 == '' || that.data.name == '') {
        wx.showModal({
          title: '提示',
          content: '请将信息填写完整',
        })
        return false;
      }
      if (that.data.cardNumber.length < 16 || that.data.cardNumber.length > 19) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的银行卡号',
        })
        return false;
      }
      if (that.data.cardNumber != that.data.cardNumber1) {
        wx.showModal({
          title: '提示',
          content: '输入的银行卡号不一致',
        })
        return false;
      }
      server.sendRequest({
        url: '?r=wxapp.commission.apply',
        data: {
          utoken: utoken,
          type: 3,
          bankname: that.data.bankName,
          bankcard: that.data.cardNumber,
          bankcard1: that.data.cardNumber1,
          id: that.data.bankid[that.data.bankIndex],
          username:that.data.name
        },
        method: "POST",
        success: function (res) {
          if (res.data.msg == 1) {
            wx.showToast({
              title: '已提交,请等待审核!',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../register/index'
              })
            }, 1500)
          }
        }
      })
    }else{
      wx.showToast({
        title: '暂不支持此方式!',
        icon: 'success',
        duration: 2000
      })
    }
  },
  getCard: function (e) {
    var that = this;
    that.setData({
      cardNumber: e.detail.value
    })
  },
  getpersonname:function(e){
    var that=this;
    that.setData({
      name: e.detail.value
    })
  },
  getCardSecond: function (e) {
    var that = this;
    that.setData({
      cardNumber1: e.detail.value
    })
  },
})