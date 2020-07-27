Page({

  data: {
    card: '',
    realname: '',
    phone: '',
    bank: ''
  },
  onLoad(option) {
    if(wx.getStorageSync('bankInfo')) {
      let bankInfo = wx.getStorageSync('bankInfo');
      this.setData({
        card: bankInfo.card,
        realname: bankInfo.realname,
        phone: bankInfo.phone,
        bank: bankInfo.bank
      })
    }
  },
  handleInput(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      [type]: e.detail.value,
    })
  },
  handleConfirm() {
    if(!this.data.card) {
      wx.showToast({
        title: '请输入银行卡卡号',
        icon: 'none'
      })
      return false;
    }
    if(!this.data.bank) {
      wx.showToast({
        title: '请输入开户行名称',
        icon: 'none'
      })
      return false;
    }
    if(!this.data.realname) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false;
    }
    if(!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    }

    let bankInfo = {
      card: this.data.card,
      bank: this.data.bank,
      realname: this.data.realname,
      phone: this.data.phone,
    }
    wx.setStorageSync('bankInfo', bankInfo);
    wx.navigateBack({
      delta: 1
    })
  },
  handleCancel() {
    wx.navigateBack({
      delta: 1
    })
  }
})