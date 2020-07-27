var WxParse = require('../../../../wxParse/wxParse.js');
var replyArr = [],
  subArr = [];
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var bid, pid, page = 1;
var pin = {}
Page({
  data: {
    isgood: 0,
    showImage: false,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    currIndex: 1,
    shareIcon: false
  },
  onLoad: function(res) {
    if (res.share) {
      this.setData({
        shareIcon: true
      })
    }
    replyArr = [], subArr = []
    utoken = wx.getStorageSync("utoken");
    console.log(res);

    var that = this;
    if (res.pid) {
      that.setData({
        xpid: res.pid
      })
    }
    if (res.bid) {
      that.setData({
        xbid: res.bid
      })
    }
    pid = that.data.xpid
    server.sendRequest({
      url: '?r=wxapp.sns.post',
      data: {
        id: that.data.xpid,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data.result.post.bid);
        that.setData({
          data: res.data.result
        })
        if (res.data.result.isgood == '1') {
          that.setData({
            check: 1
          })
        } else {
          that.setData({
            check: 0
          })
        }
        that.setData({
          isgood: parseInt(res.data.result.isgood),
          xbid: res.data.result.post.bid
        })
        bid = res.data.result.post.bid;
        WxParse.wxParse('article', 'html', that.data.data.post.content, that, 5);
        var time = new Date(parseFloat(that.data.data.post.replytime) * 1000);
        var y = time.getFullYear();
        var M = (time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
        var d = (time.getDate()) > 10 ? (time.getDate()) : "0" + (time.getDate());
        var h = (time.getHours()) > 10 ? (time.getHours()) : "0" + (time.getHours());
        var m = (time.getMinutes()) > 10 ? (time.getMinutes()) : "0" + (time.getMinutes());
        var s = (time.getSeconds()) > 10 ? (time.getSeconds()) : "0" + (time.getSeconds());
        var times = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
        that.setData({
          times: times
        })
        server.sendRequest({
          url: '?r=wxapp.sns.post.getlist',
          data: {
            bid: bid,
            pid: pid,
            utoken: utoken
          },
          method: 'GET',
          success: function(res) {
            for (let x in res.data.result.list) {
              pin[x] = res.data.result.list[x].isgood;
            }
            that.setData({
              pin: pin
            })
            if (res.data.result.list != '') {
              that.setData({
                comment: res.data.result.list
              })
              for (var x in that.data.comment) {
                var y = x;
                subArr.push(res.data.result.list[x].parent.content)
                x = res.data.result.list[x].content;
                replyArr.push(x);
              }
              for (let i = 0; i < replyArr.length; i++) {
                WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
                if (i === replyArr.length - 1) {
                  WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
                }
              }
              for (let i = 0; i < subArr.length; i++) {
                WxParse.wxParse('subArr' + i, 'html', subArr[i], that);
                if (i === subArr.length - 1) {
                  WxParse.wxParseTemArray("subtempArr", 'subArr', subArr.length, that)
                }
              }
            }

          }
        })
      }
    })
  },
  bottom: function() {

    var that = this;
    if (that.data.refresh) return;
    replyArr = [], subArr = []
    that.setData({
      refresh: true
    })
    page = page + 1;
    server.sendRequest({
      url: '?r=wxapp.sns.post.getlist',
      data: {
        bid: bid,
        pid: pid,
        page: page,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        console.log(res);
        var arr = [];
        for (let x in that.data.comment) {
          arr.push(that.data.comment[x])
        }

        if (res.data.result.list == '') {
          page = page - 1;
          that.setData({
            refresh: true
          })
        } else {
          for (let x in res.data.result.list) {
            pin[x] = res.data.result.list[x].isgood;
          }
          that.setData({
            pin: pin
          });
          for (let x in res.data.result.list) {
            arr.push(res.data.result.list[x])
          }
          console.log(arr);
          that.setData({
            comment: arr
          })
          that.setData({
            refresh: false
          })
        }

      }
    })

  },
  onPullDownRefresh: function() {
    replyArr = [], subArr = []
    server.sendRequest({
      url: '?r=wxapp.sns.post.getlist',
      data: {
        bid: bid,
        pid: pid,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        for (let x in res.data.result.list) {
          pin[x] = res.data.result.list[x].isgood;
        }
        that.setData({
          pin: pin
        })
        if (res.data.result.list != '') {
          that.setData({
            comment: res.data.result.list
          })
          for (var x in that.data.comment) {
            var y = x;
            subArr.push(res.data.result.list[x].parent.content)
            x = res.data.result.list[x].content;
            replyArr.push(x);
          }
          console.log(subArr);
          for (let i = 0; i < replyArr.length; i++) {
            WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
            if (i === replyArr.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
            }
          }
          for (let i = 0; i < subArr.length; i++) {
            WxParse.wxParse('subArr' + i, 'html', subArr[i], that);
            if (i === subArr.length - 1) {
              WxParse.wxParseTemArray("subtempArr", 'subArr', subArr.length, that)
            }
          }
        }

      }
    })

  },
  onShow: function() {
    console.log(this.data.pid)

    replyArr = [], subArr = []
    var that = this;
    that.setData({
      refresh: false
    })
    server.sendRequest({
      url: '?r=wxapp.sns.post',
      data: {
        id: that.data.xpid,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          data: res.data.result,
        })
        if (that.data.data.post.images_arr != '') {
          that.setData({
            imgUrls: that.data.data.post.images_arr,
            imgLength: that.data.data.post.images_arr.length
          })
        }
        if (res.data.result.isgood == '1') {
          that.setData({
            check: 1
          })
        } else {
          that.setData({
            check: 0
          })
        }
        that.setData({
          isgood: parseInt(res.data.result.isgood),
          xbid: res.data.result.post.bid
        })
        var bid = res.data.result.post.bid;
        WxParse.wxParse('article', 'html', that.data.data.post.content, that, 5);
        var time = new Date(parseFloat(that.data.data.post.replytime) * 1000);
        var y = time.getFullYear();
        var M = (time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
        var d = (time.getDate()) > 10 ? (time.getDate()) : "0" + (time.getDate());
        var h = (time.getHours()) > 10 ? (time.getHours()) : "0" + (time.getHours());
        var m = (time.getMinutes()) > 10 ? (time.getMinutes()) : "0" + (time.getMinutes());
        var s = (time.getSeconds()) > 10 ? (time.getSeconds()) : "0" + (time.getSeconds());
        var times = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
        that.setData({
          times: times
        })

        server.sendRequest({
          url: '?r=wxapp.sns.post.getlist',
          data: {
            bid: bid,
            pid: pid,
            utoken: utoken
          },
          method: 'GET',
          success: function(res) {
            for (let x in res.data.result.list) {
              pin[x] = res.data.result.list[x].isgood;
            }
            that.setData({
              pin: pin
            })
            if (res.data.result.list != '') {
              that.setData({
                comment: res.data.result.list
              })
              for (var x in that.data.comment) {
                var y = x;
                subArr.push(res.data.result.list[x].parent.content)
                x = res.data.result.list[x].content;
                replyArr.push(x);
              }
              console.log(subArr);
              for (let i = 0; i < replyArr.length; i++) {
                WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
                if (i === replyArr.length - 1) {
                  WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
                }
              }
              for (let i = 0; i < subArr.length; i++) {
                WxParse.wxParse('subArr' + i, 'html', subArr[i], that);
                if (i === subArr.length - 1) {
                  WxParse.wxParseTemArray("subtempArr", 'subArr', subArr.length, that)
                }
              }
            }

          }
        })

      }
    })
  },

  currChange: function(e) {
    var that = this;
    that.setData({
      currImage: e.detail.current,
      currIndex: e.detail.current + 1
    })


  },
  joinImage: function() {
    var that = this;
    if (!that.data.showImage) {
      that.setData({
        showImage: true
      })
    }
  },

  showImages: function() {
    var that = this;
    that.setData({
      showImage: false
    })
  },
  toPerson: function(res) {
    wx.navigateTo({
      url: "../person/center?pid=" + res.currentTarget.dataset.pid + "&bid=" + res.currentTarget.dataset.bid
    })
  },
  to_topic: function(res) {
    wx.navigateTo({
      url: "../p_topic/index?pid=" + res.currentTarget.dataset.pid + "&bid=" + res.currentTarget.dataset.bid + "&rid=" + res.currentTarget.dataset.rid
    })
  },
  complaints: function(res) {
    wx.navigateTo({
      url: "../complaints/index?id=" + res.currentTarget.dataset.id
    })
  },
  X: function(res) {
    wx.navigateTo({
      url: "../p_topic/index?pid=" + res.currentTarget.dataset.pid + "&bid=" + res.currentTarget.dataset.bid
    })
  },
  zan: function(res) {
    var that = this;
    server.sendRequest({
      url: '?r=sns.post.like',
      data: {
        bid: res.currentTarget.dataset.bid,
        pid: res.currentTarget.dataset.pid,
        isgood: that.data.isgood,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        if (res.data.result.isgood == '1') {
          that.setData({
            check: 1,
            isgood: parseInt(that.data.isgood) + 1
          })
        } else {
          if (that.data.isgood != 0) {
            that.setData({
              check: 0,
              isgood: parseInt(that.data.isgood) - 1
            })
          } else {
            that.setData({
              check: 0,
              isgood: parseInt(that.data.isgood)
            })
          }
        }
      }
    })
  },
  isGood: function(res) {
    var x = res.currentTarget.dataset.index;
    var isgood = res.currentTarget.dataset.isgood;
    var that = this;
    server.sendRequest({
      url: '?r=sns.post.like',
      data: {
        bid: res.currentTarget.dataset.bid,
        pid: res.currentTarget.dataset.pid,
        isgood: res.currentTarget.dataset.isgood,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        if (res.data.result.isgood == '1') {
          var num = parseInt(isgood) + 1;
          pin[x] = num
        } else {
          if (isgood != 0) {
            var num = parseInt(isgood) - 1
          } else {
            var num = parseInt(isgood)
          }

          pin[x] = num
        }
        that.setData({
          pin: pin

        })
      }
    })
  },
  onShareAppMessage: function() {
    var that = this;
    var str = '/packageA/pages/community/topic/index?pid=' + that.data.xpid + '&share=' + 'share' 
    return {
      title: that.data.data.post.title,
      path: str
    }
  }
})