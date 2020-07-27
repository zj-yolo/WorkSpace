Page({
  data: {
    isMove: false,
    cardAgain: false,
    images: [],
    values: [],
    imageWidth: '',
    imageWidth2: '',
    imageSrc: [],
    imageSrcLists: [],
    CombinationLists: [],
    AllvalueLists: [],
    text: ''
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          imageWidth: res.windowWidth / 4 - 10,
          imageWidth2: res.windowWidth / 2 - 20
        })
      }
    })
    let images = wx.getStorageSync("images");
    if (images != "undefined" && typeof images == 'string' && images != '') {
      this.setData({
        images: JSON.parse(wx.getStorageSync("images"))
      });
    } else if (images != "undefined" && typeof images == 'object' && images != '') {
      this.setData({
        images: wx.getStorageSync("images")
      });
    }
  },
  chooseImage: function () {
    let that = this;
    let utoken = wx.getStorageSync("utoken");
    let imgs = that.data.images;
    let values = that.data.values;
    if (imgs.length >= 5 || values.length >= 5) {
      wx.showToast({
        title: '最多只能选5张',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://tws.cnweisou.com/wxapi/index.php?r=activity.index.upload_banner&utoken=' + utoken,
          filePath: tempFilePaths[0],
          name: 'banner_img',
          success: function (res) {
            let data = JSON.parse(res.data);
            imgs.push(data.result.url);
            values.push(data.result.value);
            that.setData({
              images: imgs,
              ValueLists: values
            })
          }
        })
      }
    })
  },
  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.images
    })
  },
  // 删除图片
  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images
    })
  },
  submit: function () {
    let that = this;
    that.setData({
      isMove: true
    })
    if (that.data.images == '' && that.data.imageSrcLists != '') {
      wx.setStorageSync('images', that.data.imageSrcLists)
      wx.setStorageSync('imageValueLists', that.data.imageValueLists)
      wx.navigateBack();
      that.setData({
        isMove: true
      })
    } else if (that.data.images != '' && that.data.imageSrcLists == '') {
      wx.setStorageSync('images', that.data.images)
      wx.setStorageSync('imageValueLists', that.data.ValueLists)
      that.setData({
        isMove: true
      })
      wx.navigateBack();
    } else if (that.data.images != '' && that.data.imageSrcLists != '') {
      that.setData({
        CombinationLists: that.data.images.concat(that.data.imageSrcLists),
        AllvalueLists: that.data.ValueLists.concat(that.data.imageValueLists),
        isMove: true
      })
      wx.setStorageSync('images', that.data.CombinationLists)
      wx.setStorageSync('imageValueLists', that.data.AllvalueLists)
      wx.navigateBack();
    } else if (that.data.images == '' && that.data.imageSrcLists == '') {
      that.setData({
        cardAgain: true
      })
    }
  },
  returnIndex: function () {
    let that = this;
    that.setData({
      cardAgain: false,
    })
  },
})