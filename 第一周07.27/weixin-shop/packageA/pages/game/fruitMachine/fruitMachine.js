import FruitMachine from "../../../../components/fruitMachine.js";
var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse');
var countYou = '',
  timer;
var utoken = wx.getStorageSync("utoken");
var page = 0;
var nowPriceDetail = [],
  totalDetail;
Page({
  data: {
    btnList: [1, 2, 3, 8, 0, 4, 7, 6, 5],
    myData: {},
    circleList: [],
    prizeList: '',
    myId: '',
    ispriceDetail: false,
    priceDetailList: [],
  },
  onShow: function () {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 45;
        leftCircle = 10;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 9;
        leftCircle = 527;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 550;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 550;
      } else if (i < 18) {
        topCircle = 515;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 515;
        leftCircle = 37;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({
        topCircle: topCircle,
        leftCircle: leftCircle,
        index: i
      });
    }
    this.setData({
      "myData.circleList": circleList
    })
    //圆点闪烁
    timer = setInterval(function () {
      if (that.data.myData.colorCircleFirst == '#FFDF2F') {
        that.setData({
          'myData.colorCircleFirst': '#F97B74',
          'myData.colorCircleSecond': '#FFDF2F',
        })
      } else {
        that.setData({
          'myData.colorCircleFirst': '#FFDF2F',
          'myData.colorCircleSecond': '#F97B74',
        })
      }
    }, 500)
  },
  onUnload: function () {
    var that = this;
    clearInterval(timer)
  },
  // onUnload: function () {
  //   clearInterval(timer)
  // },
  onLoad() {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=lottery.lottery_id&type=3',
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
              var prizeBtn = {
                titleBtn: '立即抽奖'
              }
              if (res.data.result.lottery.lotteryinfo) {
                WxParse.wxParse('article', 'html', res.data.result.lottery.lotteryinfo, that, 5);
              }
              res.data.result.reward.splice(4, 0, prizeBtn)
              that.setData({
                prizeList1: res.data.result.reward,
                prizeList: res.data.result.reward,
                prizeResult: res.data.result
              })
              that.data.prizeList.splice(3, 1, that.data.prizeList1[8])
              that.data.prizeList.splice(5, 1, that.data.prizeList1[3])
              that.data.prizeList.splice(6, 1, that.data.prizeList1[7])
              that.data.prizeList.splice(7, 1, that.data.prizeList1[6])
              that.data.prizeList.splice(8, 1, that.data.prizeList1[5])
              that.setData({
                prizeList: that.data.prizeList
              })
              for (var i = 0; i < that.data.prizeList.length; i++) {
                that.data.prizeList[i].id = that.data.btnList[i]
              }
              that.setData({
                prizeList: that.data.prizeList
              })
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
            if (typeof that.data.prizeResult != 'undefined' && that.data.prizeResult.chance == 0) {
              that.setData({
                'myData.btnDisabled': 'disabled'
              })
            }
          }
        })
      }
    })
  },
  startPrize: function () {
    var that = this;
    server.getUserInfo(function () {
      that.setData({
        'myData.btnDisabled': 'disabled'
      })
      that.fruitMachine = new FruitMachine(that, {
        callback: () => {
          that.setData({
            'myData.cover': true
          })
        }
      })
      if (that.data.prizeResult.chance > 0) {
        utoken = wx.getStorageSync("utoken");
        server.sendRequest({
          url: '?r=lottery.reward',
          data: {
            utoken: utoken,
            id: that.data.myId,
          },
          method: 'POST',
          success: function (res) {
            that.data.prizeResult.chance--;
            if (res.data.result.icon) {
              that.setData({
                luckDraw: res.data.result,
                prizeResult: that.data.prizeResult,
              })
              countYou = parseInt(that.data.luckDraw.id)
              that.fruitMachine.ret = countYou + 1;
              that.fruitMachine.speed = 80;
              that.start();
            } else {
              that.setData({
                'myData.cover': true,
                'luckDraw.info': '支付配置有误，请联系商家完善',
                'luckDraw.icon': 'https://tws.cnweisou.com/images/gameError.jpg',
              })
            }
          }
        })
      } else if (that.data.prizeResult.chance == 0) {
        that.data.prizeResult.chance = 0;
        that.setData({
          prizeResult: that.data.prizeResult,
          'myData.btnDisabled': 'disabled'
        })
      }
    })
  },
  prizeOk: function () {
    var that = this;
    that.fruitMachine.reset();
    that.setData({
      'myData.btnDisabled': '',
      'myData.cover': false
    })
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
      default:
        break;
    }

  }
})