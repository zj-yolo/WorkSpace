const server = require('../../../utils/server');

Page({
  data: {
    poster: null,
    visible: false,
    userCardPhone: ''
  },
  onLoad(option) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          heightall: res.windowHeight - 56
        })
      }
    })

    this.getData(option.id);
  },
  getData(id) {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/share/getShareCode',
      method: 'post',
      data: {
        utoken,
        card_id: id
      },
      success: res => {
        if (res.data.code == 200) {
          let userCardPhone = res.data.result.ischange == 0 ? this.hiddenPhone(res.data.result.member.mobile) : res.data.result.member.mobile;
          this.setData({
            poster: res.data.result.wx_code,
            cardInfo: res.data.result.member,
            userCardPhone
          })
        }
      }
    }, 'https://report.cnweisou.net')
  },
  hiddenPhone(phone) {
    if(phone) {
      let reg = /^(\d{3})\d{4}(\d{4})$/;
      return phone.replace(reg, '$1****$2');
    }
    return '';
  },
  preview() {
    wx.previewImage({
      urls: [this.data.poster]
    })
  },
})