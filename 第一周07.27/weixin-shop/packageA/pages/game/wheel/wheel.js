var app = getApp()
var WxParse = require('../../../../wxParse/wxParse');
var server = require('../../../../utils/server');
var timer;
var point = [];
var utoken = wx.getStorageSync("utoken");
var page = 0;
var nowPriceDetail = [],
  totalDetail;

function getPoint(r, ox, oy, count) {
  var radians = (Math.PI / 180) * Math.round(360 / count), //弧度
    i = 0;
  for (; i < count; i++) {
    var x = ox + r * Math.sin(radians * i),
      y = oy + r * Math.cos(radians * i),
      index;
    point.unshift({
      x: x,
      y: y,
      index: i
    });
  }
}

Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    prizeResult: {},
    colorYellow: '#FFF5C0',
    colorGreen: '#8CD29F',
    arcNum: 6,
    rad: Math.PI / 180,
    ispriceDetail: false,
    priceDetailList: [],
    tkshow: false
  },
  onShow: function () {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
      if (rect) {
        getPoint(parseFloat(rect.width / 2), parseFloat(rect.width / 2 - 5), parseFloat(rect.width / 2 - 5), 12)
      } else {
        getPoint(parseFloat(314 / 2), parseFloat(314 / 2 - 5), parseFloat(314 / 2 - 5), 12)
      }
      that.setData({
        circleList: point
      })
      timer = setInterval(function () {
        if (that.data.colorCircleFirst == '#FFDF2F') {
          that.setData({
            colorCircleFirst: '#fff',
            colorCircleSecond: '#FFDF2F',
          })
        } else {
          that.setData({
            colorCircleFirst: '#FFDF2F',
            colorCircleSecond: '#fff',
          })
        }
      }, 500)
    }).exec()
  },
  onUnload: function () {
    clearInterval(timer);
  },
  // onHide: function () {
  //   clearInterval(timer);
  // },
  getPrize() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=lottery.reward',
      data: {
        utoken: utoken,
        id: that.data.myId,
      },
      async: false,
      method: 'POST',
      success: function (res) {
        if (res.data.result.icon) {
          that.setData({
            prizeResult: res.data.result,
            btnDisabled: 'disabled'
          })
          var animationRun = wx.createAnimation({
            duration: 4000,
            timingFunction: 'ease'
          })
          that.animationRun = animationRun;
          animationRun.rotate(360 * that.data.rewardLen - that.data.prizeResult.id * (360 / that.data.rewardLen)).step({
            duration: 5000
          })
          that.setData({
            animationData: animationRun.export(),
          })
          setTimeout(function () {
            var animationInit = wx.createAnimation({
              duration: 500
            })
            that.animationInit = animationInit;
            animationInit.rotate(0).step()
            that.setData({
              animationData: animationInit.export(),
              btnDisabled: 'disabled',
              cover: true
            })
          }, 5500);
        } else {
          that.setData({
            cover: true,
            'prizeResult.info': '配置有误，请联系商家完善',
            'prizeResult.icon': 'https://tws.cnweisou.com/images/gameError.jpg',
          })

        }
      }
    })
  },
  getLottery: function () {
    var that = this;
    server.getUserInfo(function () {
      if (that.data.rewardResult.chance > 0) {
        that.data.rewardResult.chance--;
        that.setData({
          rewardResult: that.data.rewardResult
        })
        that.getPrize();
      } else {
        that.data.rewardResult.chance = 0;
        that.setData({
          rewardResult: that.data.rewardResult
        })
      }
    })
  },
  onLoad: function (e) {
    var that = this;
    that.getindexdata()
  },
  onPullDownRefresh: function () {
    var that = this
    that.getindexdata()
    wx.stopPullDownRefresh()
  },
  getindexdata: function () {
    var that = this
    utoken = wx.getStorageSync("utoken");

    server.sendRequest({
      url: '?r=lottery.lottery_id&type=1',
      data: {
        utoken: utoken,
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          myId: res.data.result.id
        })
        server.sendRequest({
          url: '?r=lottery.lists',
          data: {
            utoken: utoken,
            id: that.data.myId,
          },
          method: 'POST',
          success: function (res) {
            if (res.data.result.reward) {

              that.setData({
                rewardList: res.data.result.reward,
                rewardLen: res.data.result.reward.length,
                rewardResult: res.data.result,
                nowTime: res.data.result.chance
              })
              if (res.data.result.lottery.lotteryinfo) {
                WxParse.wxParse('article', 'html', res.data.result.lottery.lotteryinfo, that, 5);
              }
              var rewardLen = that.data.rewardList.length,
                trunNum = 1 / rewardLen;
              for (var i = 0; i < rewardLen; i++) {
                that.data.rewardList[i].turn = i * trunNum + 'turn'
              }
              that.setData({
                rewardList: that.data.rewardList
              })
              if (that.data.rewardResult.chance > 0) {
                that.setData({
                  btnDisabled: ''
                })
              } else {
                that.setData({
                  btnDisabled: 'disabled'
                })
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '请添加活动',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else if (res.cancel) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  prizeOk: function () {
    var that = this;
    that.setData({
      cover: false
    })
    if (that.data.rewardResult.chance > 0) {
      setTimeout(function () {
        that.setData({
          btnDisabled: ''
        })
      }, 500)
    }
  },
  getPriceDetail(page) {
    var that = this;
    server.sendRequest({
      url: '?r=lottery.record',
      data: {
        utoken: utoken,
        lottery_id: that.data.myId,
        page: page
      },
      method: 'POST',
      success: function (res) {
        if (typeof (res.data.result) != 'undefined' && res.data.result.list.length > 0) {
          totalDetail = Math.ceil(res.data.result.total / 10);
          function currPriceDetail(addtime, desc, title, id, log_id) {
            this.addtime = addtime;
            this.desc = desc;
            this.title = title;
            this.id = id;
            this.log_id = log_id;
          }
          var getData = res.data.result.list;

          for (var i = 0; i < getData.length; i++) {
            if (typeof getData[i].lottery_data.goods == 'object') {
              for (var a in getData[i].lottery_data.goods) {
                if (getData[i].lottery_data.goods[a].title) {
                  nowPriceDetail.push(new currPriceDetail(getData[i].addtime, getData[i].lottery_data.desc, getData[i].lottery_data.goods[a].title, getData[i].lottery_data.goods[a].id, getData[i].log_id))
                }
              }
            } else if (typeof getData[i].lottery_data.coupon == 'object') {
              nowPriceDetail.push(new currPriceDetail(getData[i].addtime, getData[i].lottery_data.desc, 'joinCoupon', getData[i].log_id));
            } else {
              if (getData[i].lottery_data.desc == null) {
                getData[i].lottery_data.desc = '谢谢参与'
              }
              nowPriceDetail.push(new currPriceDetail(getData[i].addtime, getData[i].lottery_data.desc, 'other', getData[i].log_id));
            }
          }
          that.setData({
            priceDetailList: nowPriceDetail
          })

        }
      }
    })
  },
  priceDetail() {
    var that = this;
    server.getUserInfo(function () {
      that.setData({
        ispriceDetail: true
      })
      page = 1;
      nowPriceDetail = [];
      that.getPriceDetail(page);
    })
  },
  priceDetailClose() {
    this.setData({
      ispriceDetail: false
    })
  },
  detailBottom() {
    page++;
    if (page > totalDetail) {} else {
      this.getPriceDetail(page);
    }
  },
  joingoodsDetail(e) {
    wx.redirectTo({
      url: '/pages/goods/preferentialDetail/preferentialDetail?logid=' + e.currentTarget.dataset.log_id
    })
  },
  joincoupon() {
    wx.redirectTo({
      url: '/pages/member/coupon/myCoupon/myCoupon'
    })
  },
  joinPrice(e) {
    switch (e.currentTarget.dataset.type) {
      case 'goods':
        wx.redirectTo({
          url: '/pages/goods/preferentialDetail/preferentialDetail?logid=' + e.currentTarget.dataset.logid
        })
        break;
      case 'coupon':
        wx.redirectTo({
          url: '/pages/member/coupon/myCoupon/myCoupon'
        })
        break;
    }
  },
  closeclose: function () {
    var that = this
    that.setData({
      tkshow: false
    })
  },
  lookdetail: function () {
    var that = this
    that.setData({
      tkshow: true
    })
  }
})