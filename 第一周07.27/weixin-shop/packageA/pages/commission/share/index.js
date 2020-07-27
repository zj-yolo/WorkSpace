const server = require('../../../../utils/server');

Page({
  data: {
    poster: null,
    visible: false,
  },
  onLoad(option) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          heightall: res.windowHeight
        })
      }
    })
    if(option.goodsId) {
      this.setData({
        goodsId: option.goodsId,
      })
    }
    this.getData();
  },
  getData() {
    let url = '/api/Distribution/shareAll';
    let utoken = wx.getStorageSync('utoken');
    let data = {
      utoken,
    }
    if(this.data.goodsId) {
      data.goodsid = this.data.goodsId;
      url = '/api/Distribution/shareGoods';
    }
    server.sendRequest({
      url,
      method: "post",
      data,
      success: res => {
        if (res.data.code = 200) {
          this.setData({
            poster: res.data.result.url
          })
        }
      }
    }, 'https://5g-center.cnweisou.net')
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
                duration: 2000
              })
            },
            fail: (res) => {
              if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                wx.showModal({
                  title: '提示',
                  content: '暂无相册的写入权限',
                  cancelText: '取消',
                  confirmText: '去设置',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(settingdata) { }
                      })
                    } else if (res.cancel){
                      wx.showToast({
                        title: '暂无权限,请授权后再试',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '保存失败，请刷新后重试',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '保存失败，请刷新后重试',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '保存失败，请刷新后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
})