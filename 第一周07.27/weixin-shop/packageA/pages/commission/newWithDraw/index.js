const server = require('../../../../utils/server')

Page({

  data: {
    money: 0,
    withDrawMoney: ''
  },

  onLoad: function (options) {
    let money = options.num;
    this.setData({
      money,
    })
    this.getBankCardInfo();
  },
  onShow() {
    let bankInfo = wx.getStorageSync('bankInfo') ? wx.getStorageSync('bankInfo') : '';
    this.setData({
      bankInfo,
    })
  },
  getBankCardInfo() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/Distribution/getCard',
      method: 'POST',
      data: {
        utoken,
      },
      success: res => {
        if(res.data.code == 200) {
          if(res.data.result) {
            this.setData({
              bankInfo: res.data.result,
            })
            wx.setStorageSync('bankInfo', res.data.result);
          }
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  handleConfirm() {
    let utoken = wx.getStorageSync('utoken');
    if(!this.data.bankInfo.card) {
      wx.showToast({
        title: '请先添加银行卡',
        icon: 'none'
      });
      return false;
    }
    if(!this.data.withDrawMoney) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return false;
    }
    if (this.data.withDrawMoney == 0) {
      wx.showToast({
        title: '提现金额需大于0',
        icon: 'none'
      })
      return false;
    }
    if(this.data.withDrawMoney > parseInt(this.data.money)) {
      wx.showToast({
        title: '提现金额不能大于可提现佣金',
        icon: 'none'
      })
      return false;
    }
    server.sendRequest({
      url: '/api/Distribution/withdraw',
      method: 'POST',
      data: {
        utoken,
        money: this.data.withDrawMoney,
        ...this.data.bankInfo,
      },
      success: res => {
        if(res.data.code == 200) {
          wx.showToast({
            title: '提现申请成功',
            icon: 'none'
          })

          if(wx.getStorageSync('bankInfo')) {
            wx.removeStorageSync('bankInfo');
          }
          wx.navigateBack({
            delta: 1
          })
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  handleAddCard() {
    wx.navigateTo({
      url: '/packageA/pages/commission/bank/index',
    })
  },
  handleInput(e) {
    this.setData({
      withDrawMoney: e.detail.value,
    })
  }
})