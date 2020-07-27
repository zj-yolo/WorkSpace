var app = getApp(),
  calendarSignData,
  date,
  calendarSignDay;
var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    loading: true,
    signIn: 12,
    cardAgain: false,
    cardFirst: false,
    cardRule: false,
    showType: false,
    isCard: false,
    orderday: '',
    credit1: '',
    sum: '',
    message: '',
    sign_rule: '',
    currYear: '',
    currMonth: '',
    today: '',
    nowYear: '',
    nowMonth: '',
    article: '',
    signed: '',
    yearMonthList: [],
    currMouthDate: [],
    currMouthDay: [],
    listSign: [],
    monthList: [],
    signInfo: {},
    nowNum: 0,
    curNum: 1

  },
  detailRecord: function () {
    wx.navigateTo({
      url: 'detail/detail',
    })
  },
  showMonth: function () {
    this.setData({
      showType: true,
      position: 'fixed'
    })
  },
  onLoad: function () {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    var date = new Date;
    var yearNow = date.getFullYear();
    var monthNow = date.getMonth() + 1;
    that.setData({
      nowNum: parseInt(String(yearNow) + parseInt(monthNow))
    })
    server.sendRequest({
      url: '?r=wxapp.sign&utoken=' + utoken,
      showToast: false,
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          if (res.data.result.json_arr) {
            that.setData({
              signSet: res.data.result.set,
              yearMonthList: res.data.result.month,
              currYear: res.data.result.json_arr.year,
              currMonth: res.data.result.json_arr.month,
              today: res.data.result.json_arr.today,
              orderday: res.data.result.json_arr.signinfo.orderday,
              credit1: res.data.result.member.credit1,
              sum: res.data.result.json_arr.signinfo.sum,
              signed: res.data.result.json_arr.signed,
              article: res.data.result.sign_rule,
            });
            that.setData({
              nowYear: that.data.currYear,
              nowMonth: that.data.currMonth,
              curNum: parseInt(String(that.data.currYear) + parseInt(that.data.currMonth))
            })
            WxParse.wxParse('article', 'html', that.data.article, that, 5);
            that.getCurrDate();

          } else {
            that.setData({
              noCard: res.data.msg,
              isCard: true,
            })
          }
        }
      }
    })
    server.sendRequest({
      url: '?r=wxapp.sign.getCalendar&utoken=' + utoken,
      method: 'GET',
      showToast: false,
      success: function (res) {
        that.setData({
          monthList: res.data.result
        });
      }
    })

  },

  cardSign: function () {
    this.Sign();

  },

  supplementSign: function (e) {
    var that = this;
    if (parseInt(that.data.currMonth) != parseInt(that.data.nowMonth) || parseInt(that.data.currMonth) == parseInt(that.data.nowMonth) && parseInt(e.currentTarget.dataset.item.day) < parseInt(that.data.today)) {
      if (that.data.signSet.signold == 1 && e.currentTarget.dataset.item.signed == 0) {
        var typeCur = that.data.signSet.signold_type == 0 ? '余额' : '积分';
        var unit = that.data.signSet.signold_type == 0 ? '元' : '分';
        var note = '补签要扣除' + typeCur + that.data.signSet.signold_price + unit + '，确定继续补签吗？';
        wx.showModal({
          title: '提示',
          content: note,
          confirmColor: '#24b2f2',
          success: function (res) {
            if (res.confirm) {
              that.Sign(that.data.currYear + '-' + that.data.currMonth + '-' + e.currentTarget.dataset.item.day);
            } else if (res.cancel) {
            }
          }
        })
      }
    }
  },


  Sign: function (date) {
    var that = this;
    var dateObj = {};
    if (date) {
      dateObj.date = date;
      dateObj.day = parseInt(that.data.orderday + 1);

    } else {
      dateObj.day = parseInt(that.data.orderday + 1);
    }
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.sign.dosign&utoken=' + utoken,
      data: dateObj,
      method: 'POST',
      success: function (res) {
        // console.log(res)
        if(res.data.status == 1) {
          that.setData({
            orderday: res.data.result.signorder,
            credit1: res.data.result.credit,
            sum: res.data.result.signsum,
            message: res.data.result.message,
            cardFirst: true
          })
          server.sendRequest({
            url: '?r=wxapp.sign&utoken=' + utoken,
            method: 'GET',
            success: function (res) {
              // console.log('补签成功--------------------')
              that.setData({
                signSet: res.data.result.set,
                yearMonthList: res.data.result.month,
                orderday: res.data.result.json_arr.signinfo.orderday,
                credit1: res.data.result.member.credit1,
                sum: res.data.result.json_arr.signinfo.sum,
                signed: res.data.result.json_arr.signed,
              });
              that.getCurrDate();
            }
          })
        } else {
          that.setData({
            message: res.data.msg,
            cardFirst: true
          })
        }
      },
    })

  },


  getCurrDate() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sign.getCalendar&date=' + that.data.currYear + '-' + that.data.currMonth + '&utoken=' + utoken,
      method: 'GET',
      showToast: false,
      success: function (res) {
        that.setData({
          currMouthDate: res.data.result,
        });
        var currMouthDate5 = [];
        var currMouthDateSign = []
        for (var i = 0; i < that.data.currMouthDate.length; i++) {
          var dayLength = that.data.currMouthDate[i].length;
          for (var j = 0; j < dayLength; j++) {
            var Str = {};
            Str.day = that.data.currMouthDate[i][j].day;
            Str.signed = that.data.currMouthDate[i][j].signed;
            currMouthDate5.push(Str);
          }
          that.setData({
            currMouthDay: currMouthDate5,
            listSign: currMouthDateSign
          });
        }
      }
    })

  },


  returnIndexFirst: function () {
    var that = this;
    that.setData({
      cardFirst: false,
    })
  },

  cardSignAgain: function () {
    var that = this;
    that.setData({
      cardAgain: true,
    })
  },

  returnIndex: function () {
    var that = this;
    that.setData({
      cardAgain: false,
    })
  },
  cardRule: function () {
    var that = this;
    that.setData({
      cardRule: true,
    })
  },
  ruleReturnIndex: function () {
    var that = this;
    that.setData({
      cardRule: false
    })
  },
  isCard: function () {
    var that = this;
    that.setData({
      isCard: false
    })
    wx.navigateBack({
      delta: 1
    })
  },

  // 获取个人信息
  onShow: function () {
    let login = server.globalData.login;
    let userInfo = server.globalData.userInfo;
    let that = this;
    var utoken = wx.getStorageSync("utoken");
    that.setData({
      login: login,
      userInfo: userInfo
    });
    server.sendRequest({
      url: '?r=wxapp.member',
      showToast: false,
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          loading: false,
          is_openmerch: res.data.result.is_openmerch,
          merchid: res.data.result.merchid,
          order_0: res.data.result.order_0,
          order_1: res.data.result.order_1,
          order_2: res.data.result.order_2
        })
      }
    })

  },
  chooseDate: function (e) {
    var that = this;
    // console.log('chooseDate---------------')
    var currIndex = e.currentTarget.dataset.index;
    that.setData({
      showType: false,
      currYear: that.data.yearMonthList[currIndex].year,
      currMonth: that.data.yearMonthList[currIndex].month,
      curNum: parseInt(String(that.data.yearMonthList[currIndex].year) + parseInt(that.data.yearMonthList[currIndex].month))
    })
    that.getCorrespondingDate();

  },
  //  获取对应日期
  getCorrespondingDate: function () {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.sign.getCalendar&date=' + that.data.currYear + '-' + that.data.currMonth + '&utoken=' + utoken,
      data: {

      },
      method: 'GET',
      success: function (res) {
        that.setData({
          currMouthDate: res.data.result,
        });

        var currMouthDate5 = [];
        var currMouthDateSign = []
        for (var i = 0; i < that.data.currMouthDate.length; i++) {
          var dayLength = that.data.currMouthDate[i].length;
          for (var j = 0; j < dayLength; j++) {
            var Str = {};
            Str.day = that.data.currMouthDate[i][j].day;
            Str.signed = that.data.currMouthDate[i][j].signed;
            currMouthDate5.push(Str);
          }
          that.setData({
            currMouthDay: currMouthDate5,
            listSign: currMouthDateSign
          });
        }
      }
    })
  }

})