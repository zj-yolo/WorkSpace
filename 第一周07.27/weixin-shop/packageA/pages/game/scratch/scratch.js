import Scratch from "../../../../components/scrath.js";
var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse');
var awardTxtMy = '',
  chanceMy = '',
  imageResourceMy = '';
var utoken = wx.getStorageSync("utoken");
var page = 0;
var nowPriceDetail = [],
  totalDetail;

Page({
  data: {
    isStart: true,
    txt: "重新刮奖",
    imageResource: "https://tws.cnweisou.com/images/scratchCont.png",
    scratchPrize: {},
    noprize: true,
    myId: '',
    ispriceDetail: false,
    priceDetailList: [],
  },

  onLoad: function () {
    var that = this;
    that.setData({
      btndisabled: 'disabled'
    })
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=lottery.lottery_id&type=2',
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
                scratchResult: res.data.result
              })
              if (res.data.result.lottery.lotteryinfo) {
                WxParse.wxParse('article', 'html', res.data.result.lottery.lotteryinfo, that, 5);
              }
              that.scratchReady()
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
  onShow() {
    utoken = wx.getStorageSync("utoken");
  },
  getMy: function () {
    var that = this;
    this.scratch = new Scratch(this, {
      canvasWidth: 377,
      canvasHeight: 152,
      imageResource: imageResourceMy,
      maskColor: '#2A8A6C',
      r: 8,
      awardTxt: awardTxtMy,
      awardTxtColor: "#3985ff",
      awardTxtFontSize: "24px",
      chance: chanceMy,
      callback: () => {
        this.setData({
          imageResource: that.data.imageResource,
          btndisabled: '',
          cover: true

        })
      }
    })
  },

  prizeOk: function () {
    var that = this;
    that.setData({
      imageResource: that.data.imageResource,
      cover: false,
      noprize: true
    })
    if (that.data.scratchResult.chance > 0) {
      that.data.scratchResult.chance--;
      that.setData({
        btndisabled: '',
        scratchResult: that.data.scratchResult
      })
    } else {
      that.data.scratchResult.chance = 0;
      this.setData({
        btndisabled: 'disabled',
        scratchResult: that.data.scratchResult
      })
    }
  },
  scratchReady() {
    var that = this;
    if (that.data.scratchResult.chance > 0) {

      that.setData({
        scratchResult: that.data.scratchResult,
        btndisabled: 'disabled'
      })
      utoken = wx.getStorageSync("utoken");
      server.sendRequest({
        url: '?r=lottery.reward',
        data: {
          utoken: utoken,
          id: that.data.myId,
        },
        method: 'POST',
        success: function (res) {
          if (res.data.result.icon) {
            that.setData({
              scratchPrize: res.data.result,
              scratchResult: that.data.scratchResult,
              noprize: true,
            })
            awardTxtMy = that.data.scratchPrize.info
            chanceMy = that.data.scratchResult.chance
            imageResourceMy = that.data.imageResource
            that.getMy();
          } else {
            that.setData({
              noprize: false,
              cover: true,
              scratchResult: that.data.scratchResult,
              'scratchPrize.info': '支付配置有误，请联系商家完善',
              'scratchPrize.icon': 'https://tws.cnweisou.com/images/gameError.jpg'
            })
          }
        }
      })
    } else if (that.data.scratchResult.chance = 0) {
      that.data.scratchResult.chance = 0;
      that.setData({
        scratchResult: that.data.scratchResult
      })
    }
  },
  onStart() {
    var that = this;
    server.getUserInfo(function () {
      that.scratch.reset();
      that.scratchReady();
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
    }

  }
})