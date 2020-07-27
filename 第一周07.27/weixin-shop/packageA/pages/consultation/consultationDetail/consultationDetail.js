var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var WxParse = require('../../../../wxParse/wxParse');
var that = "";
Page({
  data: {
    showImage: false,
    more: false,
    imgUrls: [],
    imgLength: '',
    circular: true,
    autoplay: false,
    duration: 1000,
    currIndex: 1,
    currImage: 0,
    aid: '',
    article_title: '',
    article_author: '',
    article_date: '',
    resp_desc: '',
    resp_img: '',
    avatar1: '',
    goodNum: '',
    numberPhone: '',
    shareIcon: false

  },

  onLoad: function (options) {
    if (options.share) {
      this.setData({
        shareIcon: true
      })
    }
    utoken = wx.getStorageSync("utoken");
    that = this;
    that.setData({
      aid: options.aid,
    })
    server.sendRequest({
      url: '?r=wxapp.article&utoken=' + utoken + '&aid=' + that.data.aid,
      method: 'GET',
      success: function (res) {
        var imgUrl = [];
        imgUrl.push(res.data.result.resp_img)
        that.setData({
          article_title: res.data.result.article_title,
          article_author: res.data.result.article_author,
          article_date: res.data.result.article_date,
          resp_desc: res.data.result.resp_desc,
          article_likenum: res.data.result.article_likenum,
          article_report: res.data.result.article_report,
          resp_img: res.data.result.resp_img,
          imgUrls: imgUrl,
          avatar: res.data.result.like_person,
          goodNum: res.data.result.article_likenum,
          article_contents: res.data.result.article_content,
          imgLength: that.data.imgUrls.length
        });
        WxParse.wxParse('article', 'html', that.data.article_contents, that, 5);
        if (that.data.avatar.length > 8) {
          that.setData({
            more: true
          })
        }
      }
    })
  },
  onShow: function () {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.article.like&utoken=' + utoken + '&aid=' + that.data.aid,
      method: 'GET',
      success: function (res) {
        if (that.getBLen(res.data.msg) == 8) {
          that.setData({
            isGood: true
          })
        } else if (that.getBLen(res.data.msg) == 14) {
          that.setData({
            isGood: false
          })
        }
      }
    })
    server.sendRequest({
      url: '?r=wxapp.article&utoken=' + utoken + '&aid=' + that.data.aid,
      method: 'GET',
      success: function (res) {
        var imgUrl = [];
        imgUrl.push(res.data.result.resp_img)
        that.setData({
          article_title: res.data.result.article_title,
          article_author: res.data.result.article_author,
          article_date: res.data.result.article_date,
          resp_desc: res.data.result.resp_desc,
          article_likenum: res.data.result.article_likenum,
          article_report: res.data.result.article_report,
          resp_img: res.data.result.resp_img,
          imgUrls: imgUrl,
          avatar: res.data.result.like_person,
          imgLength: that.data.imgUrls.length
        });
        if (res.data.result.article_tel) {
          that.setData({
            numberPhone: res.data.result.article_tel
          })
        }
        if (that.data.avatar.length > 8) {
          that.setData({
            more: true
          })
        }
      }
    })
  },
  joinReview1: function () {
    var that = this;
    wx.navigateTo({
      url: '../reviewArea/reviewArea?aid=' + that.data.aid
    })
  },
  joinReview2: function () {
    var that = this;
    wx.navigateTo({
      url: '../reviewArea/reviewArea?aid=' + that.data.aid
    })
  },
  joinImage: function () {
    that = this;
    if (!that.data.showImage) {
      that.setData({
        showImage: true
      })
    }
  },
  currChange: function (e) {
    var that = this;
    that.setData({
      currImage: e.detail.current,
      currIndex: e.detail.current + 1
    })
  },
  showImages: function () {
    that = this;
    that.setData({
      showImage: false
    })
  },

  giveGood: function () {
    that = this;
    // 点赞功能
    server.getUserInfo(function(){
    server.sendRequest({
      url: '?r=wxapp.article.like&utoken=' + utoken + '&aid=' + that.data.aid,
      method: 'GET',
      success: function (res) {
        if (that.getBLen(res.data.msg) == 8) {
          that.setData({
            isGood: true
          })
        } else if (that.getBLen(res.data.msg) == 12) {
          that.setData({
            isGood: false

          })
        }
        server.sendRequest({
          url: '?r=wxapp.article&utoken=' + utoken + '&aid=' + that.data.aid,
          method: 'GET',
          success: function (res) {
            that.setData({
              article_likenum: res.data.result.article_likenum,
              article_report: res.data.result.article_report,
              avatar: res.data.result.like_person,
            });
            if (that.data.avatar.length > 8) {
              that.setData({
                more: true
              })
            }
          }
        })
      }
    })
  })
  },
  getBLen: function (str) {
    if (str == null) return 0;
    if (typeof str != "string") {
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g, "ab").length;
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.article_title,
      path: "packageA/pages/consultation/consultationDetail/consultationDetail?aid=" + that.data.aid + '&share=' + 'share',
    }
  },
  artPhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.numberPhone
    })
  }
})