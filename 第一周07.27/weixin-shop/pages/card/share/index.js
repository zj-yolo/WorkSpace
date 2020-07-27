const server = require('../../../utils/server');

Page({
  data: {
    poster: null,
    visible: false,
    cardId: ''
  },
  onLoad(option) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          heightall: res.windowHeight
        })
      }
    })
    this.setData({
      cardId: option.id
    })
    this.getData();
  },
  getData() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/share/getShareCode',
      method: 'post',
      data: {
        utoken,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            poster: res.data.result.haibao_code,
          })
        }
      }
    }, 'https://report.cnweisou.net')
  },
  preview() {
    wx.previewImage({
      urls: [this.data.poster]
    })
  },
  saveImg() {
    if (this.data.poster == null) {
      return;
    }
    server.reportedData('savecard', {
      card_id: this.data.cardId,
    });
    wx.downloadFile({
      url: this.data.poster,
      success: res => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
              })
            },
            fail: (res) => {
              if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                wx.showToast({
                  title: '暂无相册的写入权限。',
                  icon: 'none',
                })
              } else {
                wx.showToast({
                  title: '保存失败，请刷新后重试',
                  icon: 'none',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '保存失败，请刷新后重试',
            icon: 'none',
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '保存失败，请刷新后重试',
          icon: 'none',
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      path: '/pages/vrindex/index',
    }
  },
})