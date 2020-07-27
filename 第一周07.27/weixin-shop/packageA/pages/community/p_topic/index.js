var WxEmoji = require('../../../../WxEmojiView/WxEmojiView.js');
var arr = [];
var app = getApp();
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var imgarr = [];
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    testText: "00:01:02:03",
    show: 1,
    images: [],
    imageWidth: ""
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  show: function (e) {
    var that = this;
    if (e.currentTarget.dataset.index == 1) {
      that.setData({
        show: 1
      })
    } else if (e.currentTarget.dataset.index == 2) {
      that.setData({
        show: 2
      })
    }
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (res) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    arr = [];
    if (res.rid) {
      that.setData({
        pid: res.pid,
        bid: res.bid,
        rid: res.rid
      })
    }
    else if (res.pid) {
      that.setData({
        pid: res.pid,
        bid: res.bid
      })
    } else {
      that.setData({
        bid: res.bid
      })
    }
    WxEmoji.bindThis(this);
    that.setData({ WxEmojiObjs: { WxEmojiTextArray: "" } })
  },
  WxEmojiTextareaFocus: function (e) {
    var that = this;
    WxEmoji.WxEmojiTextareaFocus(that, e);

  },
  WxEmojiTextareaBlur: function (e) {
    var that = this;
    WxEmoji.WxEmojiTextareaBlur(that, e);
  },
  wxPreEmojiTap: function (e) {
    var that = this;
    WxEmoji.wxPreEmojiTap(that, e);
  },
  testBlur: function (e) {

    var temObjs = {};
    var that = this;
    temObjs.showWxEmojiChooseView = 1;
    temObjs.textAreaText = e.detail.value;

    that.setData({
      WxEmojiObjs: temObjs,
    });
  },
  bindFormSubmit: function (e) {
    // 判断标题，内容的长度
    if (e.detail.value.title || e.detail.value.textArea) {
      if (e.detail.value.textArea.length < '3' || e.detail.value.textArea.length < '3') {
        wx.showModal({
          title: '提示',
          content: '标题或者内容不能小于三个文字',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
        return;
      }

    }
    if (e.detail.value.textArea == '') {
      wx.showModal({
        title: '提示',
        content: '内容不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    var that = this;
    server.getUserInfo(function () {
      if (that.data.rid) {
        server.sendRequest({
          url: '?r=wxapp.sns.post.reply',
          data: {
            utoken: utoken,
            pid: that.data.pid,
            bid: that.data.bid,
            rpid: that.data.rid,
            content: e.detail.value.textArea,
            images: arr
          },
          method: "POST",
          success: function (res) {
            wx.navigateBack({
              pid: that.data.pid
            })
          }
        });
      }
      else if (that.data.pid) {
        server.sendRequest({
          url: '?r=wxapp.sns.post.reply',
          data: {
            utoken: utoken,
            pid: that.data.pid,
            bid: that.data.bid,
            content: e.detail.value.textArea,
            images: arr
          },
          method: "POST",
          success: function (res) {
            wx.navigateBack({
              pid: that.data.pid
            })
          }
        });
      } else {
        wx.setStorageSync("bid", that.data.bid);
        server.sendRequest({
          url: '?r=wxapp.sns.post.submit',
          data: {
            utoken: utoken,
            bid: that.data.bid,
            title: e.detail.value.title,
            content: e.detail.value.textArea,
            images: arr
          },
          method: "POST",
          success: function (res) {
            wx.navigateBack({
              id: that.data.bid
            })
          }
        });
      }
    })
  },

  onShow: function () {

  },
  chooseImage: function () {
    var that = this;
    var ss = []
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://tws.cnweisou.com/wxapi/index.php?r=wxapp.util.uploader&i=450',
            filePath: tempFilePaths[i],
            name: 'file',
            method: 'POST',
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function (res) {
              var x = res.data;
              var dataObj = JSON.parse(x);
              arr.push(dataObj.url);
              ss['i'] = res
            }
          })
        }

        that.setData({
          images: that.data.images.concat(tempFilePaths)
        })
        if (that.data.images.length > 5) {

        }

      },
    })
  },
  previewImage: function () {
    var that = this;
    wx.previewImage({
      urls: that.data.images
    })
  },
  delete: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.images;
    images.splice(index, 1);
    arr.splice(index, 1)
    that.setData({
      images: images
    })
  },
})
