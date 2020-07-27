var server = require('../../../utils/server');
Page({
  data: {
    username: '',
    address: '',
    mobile: '',
    remark: '',
    banner:''    
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      banner: options.banner
    })
  },
  bindRegionChange(e) {
    let province = e.detail.value[0];
    let city = e.detail.value[1];
    let area = e.detail.value[2];
    let address = province + city + area;
    this.setData({
      address: address
    })
  },
  handleInupt(e) {
    if (e.currentTarget.dataset.name == 'name') {
      let username = e.detail.value
      this.setData({
        username: username
      })
    }
    if (e.currentTarget.dataset.name == 'phone') {
      let mobile = e.detail.value
      this.setData({
        mobile: mobile
      })
    }

    if (e.currentTarget.dataset.name == 'remark') {
      let remark = e.detail.value
      this.setData({
        remark: remark
      })
    }

  },
  sumbit() {
    var that = this;
    let data = {
      username: that.data.username,
      address: that.data.address,
      mobile: that.data.mobile,
      remark: that.data.remark,
      uniacid: wx.getStorageSync('obj').wxid
    }
    if (!data.username || !data.address || !data.mobile ) {
      wx.showToast({
        title: '请输入内容!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    server.sendRequest({
      url: '?r=wxapp.setFivegInfo',
      data: data,
      method: 'POST',
      success: function(res) {
        if (res.data.status == 1) {
         
          wx.showToast({
            title: '提交成功!',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta: 1
          })
         
        } else {
          console.log(res)
          wx.showToast({
            title: '提交失败!',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }

})