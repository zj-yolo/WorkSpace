var WxParse = require('../../../../../wxParse/wxParse');
var WxEmoji = require('../../../../../WxEmojiView/WxEmojiView');
var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var status = 0,
  page = 1,
  id, imageUrl = [],
  imageLength = [],
  replyArr = [];
Page({
  data: {
    isfollow: false,
    scroll_top: 0,
    goTop_show: false,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    refresh: false,
    shareIcon: false
  },
  onLoad: function(res) {
    if (res.share) {
      this.setData({
        shareIcon: true
      })
    }
    replyArr = [];
    utoken = wx.getStorageSync("utoken");
    var that = this;
    WxParse.emojisInit('[]', "/WxEmojiView/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });
    id = res.id;
    page = 1;
    server.sendRequest({
      url: '?r=wxapp.sns.board',
      data: {
        id: id,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          data: res.data.result,
          isfollow: res.data.result.isfollow,
          followcount: res.data.result.followcount
        })
      }
    });
    server.sendRequest({
      url: '?r=wxapp.sns.board.getlist',
      data: {
        bid: id,
        utoken: utoken,
        page: page,
      },
      method: 'GET',
      success: function(res) {
        for (let x in res.data.result.list) {
          var img = res.data.result.list[x].images;
          imageUrl.push(img);
          imageLength.push(img.length);
          x = res.data.result.list[x].content;
          replyArr.push(x);
        }
        for (let i = 0; i < replyArr.length; i++) {
          WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
          if (i === replyArr.length - 1) {
            WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
          }
        }
        that.setData({
          list: res.data.result.list,
          imageUrl: imageUrl,
          imageLength: imageLength
        })
      }
    });
  },
  onShow: function() {
    var that = this;
    // 只有在板块发布话题时 onshow再重新请求数据
    if (wx.getStorageSync("bid")) {
      page = 1;
      replyArr = [];
      that.setData({
        refresh: false
      })
      server.sendRequest({
        url: '?r=wxapp.sns.board',
        data: {
          id: id,
          utoken: utoken
        },
        method: 'GET',
        success: function(res) {
          that.setData({
            data: res.data.result,
            isfollow: res.data.result.isfollow,
            followcount: res.data.result.followcount
          })
        }
      });
      server.sendRequest({
        url: '?r=wxapp.sns.board.getlist',
        data: {
          bid: id,
          utoken: utoken,
          page: page,
        },
        method: 'GET',
        success: function(res) {
          for (let x in res.data.result.list) {
            x = res.data.result.list[x].content
            replyArr.push(x);
          }
          for (let i = 0; i < replyArr.length; i++) {
            WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
            if (i === replyArr.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
            }
          }
          that.setData({
            list: res.data.result.list
          })
        }
      });
      wx.removeStorageSync('bid')
    }


  },
  onPullDownRefresh: function() {
    var that = this;
    replyArr = []
    server.sendRequest({
      url: '?r=wxapp.sns.board.getlist',
      data: {
        bid: id,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        wx.stopPullDownRefresh()
        that.setData({
          list: res.data.result.list
        })
      }
    });
  },
  follow: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sns.board.follow',
      data: {
        bid: id,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          isfollow: res.data.result.isfollow
        })
        if (that.data.isfollow == true) {
          that.setData({
            followcount: 1 + parseInt(that.data.followcount)
          })
        } else {
          if (that.data.followcount == 0) {
            that.setData({
              followcount: 0
            })
          } else {
            that.setData({
              followcount: that.data.followcount - 1
            })
          }
        }
      }
    });
  },
  toTopic: function(res) {
    wx.navigateTo({
      url: "../../topic/index?pid=" + res.currentTarget.dataset.pid + "&bid=" + res.currentTarget.dataset.bid
    })
  },
  essencearea: function(res) {
    wx.navigateTo({
      url: "../Essencearea/index?bid=" + res.currentTarget.dataset.bid
    })
  },
  relatedsections: function(res) {
    wx.navigateTo({
      url: "../Relatedsections/index?id=" + res.currentTarget.dataset.id
    })
  },
  complaints: function(res) {
    wx.navigateTo({
      url: "../../complaints/index?id=" + res.currentTarget.dataset.id
    })
  },
  todetail: function(res) {
    wx.navigateTo({
      url: "../../topic/index?id=" + res.currentTarget.dataset.id
    })
  },
  to_post: function(res) {
    wx.navigateTo({
      url: "../../p_topic/index?bid=" + res.currentTarget.dataset.id
    })
  },
  to_index: function(res) {
    wx.reLaunch({
      url: "../../../../../pages/index/index"
    })
  },

  onReachBottom: function(e) {
    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true
    })
    imageUrl = [], imageLength = [];
    page = page + 1;
    server.sendRequest({
      url: '?r=wxapp.sns.board.getlist',
      data: {
        bid: id,
        utoken: utoken,
        page: page
      },
      method: 'GET',
      success: function(res) {
        var arr = [];
        var img;

        for (let x in that.data.list) {
          img = that.data.list[x].images;
          imageUrl.push(img);
          imageLength.push(img.length);
          arr.push(that.data.list[x])
        }
        if (res.data.result.list == '') {
          page = page - 1
        } else {
          for (let x in res.data.result.list) {
            img = res.data.result.list[x].images;
            imageUrl.push(img);
            imageLength.push(img.length);
            arr.push(res.data.result.list[x])
          }
          that.setData({
            refresh: false
          })
        }
        that.setData({
          list: arr,
          imageUrl: imageUrl,
          imageLength: imageLength
        })
      }
    });
  },
  onShareAppMessage: function() {
    var that = this;
    var str = '/packageA/pages/community/list/index/index?id=' + id + '&share=' + 'share';
    return {
      title: that.data.data.board.title,
      path: str
    }
  },
  backToIndex: function () {
    wx.switchTab({
      url: '../../../index/index',
    })
  },
})