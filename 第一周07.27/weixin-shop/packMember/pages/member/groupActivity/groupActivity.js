var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var app = getApp()
Page({
  data: {
    loading: true,
    isDisable: true,
    clickImg: false,
    clickType: false,
    clickCont: false,
    imgUrls: ['http://tws.cnweisou.com/images/groundActivity.jpg'],
    indicatorDots: true,
    autoplay: false,
    Startdate: null,
    Starttimne: null,
    Enddate: null,
    Endtime: null,
    formInfo: {},
    activityTip: false,
    ClassNum: 0,
    index: 0,
    arraySystem: [],
    payNumLists: [],
    payType: '',
    payNum: '',
    activityType: [],
    activityIntroduce: '',
    verification: '',
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=activity.index.cost_type&utoken=' + utoken,
      showToast: false,
      data: {},
      method: 'GET',
      success: function (res) {
        var arraySystemList = []
        var payLength = res.data.result.length;
        for (var i = 0; i < payLength; i++) {
          arraySystemList.push(res.data.result[i].desc)
        }
        var payNumList = []
        var payLength1 = res.data.result.length;
        for (var j = 0; j < payLength1; j++) {
          payNumList.push(res.data.result[j].value)
        }
        that.setData({
          arraySystem: arraySystemList,
          payNumLists: payNumList,
          payType: res.data.result[0].desc,
          payNum: res.data.result[0].value,
        })

      }
    })
    server.sendRequest({
      url: '?r=activity.index.get_imgs&utoken=' + utoken,
      method: 'GET',
      showToast: false,
      success: function (res) {
        if (res.data.result.default.length > 0) {
          var imgUrl = []
          imgUrl.push(res.data.result.default[0].url)
          that.setData({
            imgUrls: imgUrl,
            'formInfo.imgUrls': imgUrl,
          });
        }
        that.setData({
          loading: false
        })
      }
    })
    wx.removeStorageSync('images')
    wx.removeStorageSync('imageValueLists')
    wx.removeStorage({
      key: 'typeCont',
    })
    wx.removeStorage({
      key: 'textCont',
    })
    var T = new Date()
    var y = T.getFullYear()
    var m = T.getMonth() + 1
    var d = T.getDate()
    var h = T.getHours()
    var ms = T.getMinutes()
    if (m < 10) {
      m = '0' + m
    }
    if (d < 10) {
      d = '0' + d
    }
    if (h < 10) {
      h = '0' + h
    }
    if (ms < 10) {
      ms = '0' + ms
    }
    var v = new Date(Date.now() + 86400000 * 5)
    var ny = v.getFullYear()
    var nm = v.getMonth() + 1
    var nd = v.getDate()
    var nms = T.getMinutes()
    if (nm < 10) {
      nm = '0' + nm
    }
    if (nd < 10) {
      nd = '0' + nd
    }
    if (nms < 10) {
      nms = '0' + nms
    }
    this.setData({
      Startdate: y + '-' + m + '-' + d,
      Starttimne: h + ':00',
      Enddate: ny + '-' + nm + '-' + nd,
      Endtime: h + ':00',
      Nowdate: y + '-' + m + '-' + d,
      Nowttimne: h + ':' + ms,
    })
  },

  onShow: function (options) {
    var that = this;
    if (that.data.clickImg) {
      var imageValueS = []
      if (wx.getStorageSync('imageValueLists')) {
        imageValueS = wx.getStorageSync('imageValueLists');
      }

      var imageValueStr = imageValueS.join(",");
      if (wx.getStorageSync('images')) {
        that.setData({
          imgUrls: wx.getStorageSync('images'),
          imageValueLists: imageValueStr,
          'formInfo.imgUrls': wx.getStorageSync('images'),
        })
      }
    }
    if (that.data.clickType) {
      wx.getStorage({
        key: 'typeCont',
        success: function (res) {
          that.setData({
            activityType: res.data.typeCont,
            classNum: res.data.classNum,
            'formInfo.activityType': res.data.typeCont
          })
        }
      })
    }
    if (that.data.clickCont) {
      wx.getStorage({
        key: 'textCont',
        success: function (res) {
          that.setData({
            activityIntroduce: res.data.textCont,
            classNum: res.data.classNum,
          })
        }
      })

    }
  },

  //选择时间
  changeStartDate: function (e) {
    if (e.detail.value < this.data.Enddate || (e.detail.value == this.data.Enddate && this.data.Endtime > this.data.Starttimne)) {
      this.setData({
        Startdate: e.detail.value
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '结束时间不能早于开始时间'
      })
    }
    if (e.detail.value >= this.data.Nowdate || (e.detail.value == this.data.Nowdate && this.data.Endtime > this.data.Starttimne)) {
      this.setData({
        Startdate: e.detail.value
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '开始时间不得早于当前'
      })

      this.setData({
        Startdate: this.data.Nowdate
      })

    }
  },
  changeStartTime: function (e) {
    if (this.data.Startdate < this.data.Enddate || (this.data.Startdate == this.data.Enddate && e.detail.value < this.data.Endtime) || (this.data.Startdate == this.data.Nowdate && e.detail.value >= this.data.Nowttimne)) {
      if (this.data.Startdate == this.data.Nowdate) {
        if (e.detail.value >= this.data.Nowttimne) {
          this.setData({
            Starttimne: e.detail.value
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '开始时间不得早于当前'
          })

          this.setData({
            Starttimne: this.data.Nowttimne
          })
        }
      } else {

        this.setData({
          Starttimne: e.detail.value
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '结束时间不能早于开始时间'
      })
    }


  },
  changeEndDate: function (e) {
    var that = this;
    if (e.detail.value > this.data.Startdate || (this.data.Startdate == e.detail.value && this.data.Endtime > this.data.Starttimne)) {
      this.setData({
        Enddate: e.detail.value
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '结束时间不能早于开始时间'
      })
    }
  },
  changeEndTime: function (e) {
    if (this.data.Startdate < this.data.Enddate || (this.data.Startdate == this.data.Enddate && e.detail.value > this.data.Starttimne)) {
      this.setData({
        Endtime: e.detail.value
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '结束时间不能早于开始时间'
      })
    }
  },
  changeImage: function () {
    var that = this;
    that.setData({
      clickImg: true
    })
    wx.navigateTo({
      url: '/packMember/pages/member/groupActivity/changeImg/changeImg',
    })
    if (that.data.clickImg) {}
  },
  actItem: function (e) {
    var that = this;
    this.setData({
      'formInfo.actItem': e.detail.value
    })
  },

  changeadress: function (e) {
    this.setData({
      'formInfo.actAddress': e.detail.value
    })
  },
  changeMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          'formInfo.actAddress': res.name,
          'formInfo.lat': res.latitude,
          'formInfo.lng': res.longitude
        })
      },
    })
  },
  //  手机号
  verificationPhone: function (e) {
    var that = this;
    this.setData({
      verification: e.detail.value,
      activityTip: false
    })
  },
  bindblurPhone: function (e) {
    var that = this;
    if (that.data.verification != '' && !(/^1[34578]\d{9}$/.test(that.data.verification))) {
      that.setData({
        activityTip: true,
        verification: ''
      })
      wx.showToast({
        title: '手机号输入有误',
        duration: 2000
      })
    } else {
      that.setData({
        'formInfo.phone': that.data.verification
      })

    }
  },

  // 更多选项
  moreSelectArrow: function () {
    var that = this;
    if (that.data.ClassNum == 0) {
      that.setData({
        ClassNum: 1
      })
    } else {
      that.setData({
        ClassNum: 0
      })
    }
  },

  //  人数限制
  actPersonum: function (e) {
    var that = this;
    this.setData({
      'formInfo.actPersonnum': e.detail.value
    })
  },
  systemChange: function (e) {
    var that = this;
    var currIndex = e.detail.value;

    this.setData({
      index: e.detail.value,
      payType: that.data.arraySystem[currIndex],
      payNum: that.data.payNumLists[currIndex]
    })
  },

  // 选择活动类型
  choosetype: function () {
    var that = this;
    this.setData({
      clickType: true,
    })
    wx.navigateTo({
      url: '/packMember/pages/member/groupActivity/activityType/activityType',
    })
  },
  // 活动介绍
  activityIntroduce: function () {
    var that = this;
    this.setData({
      clickCont: true,
    })
    wx.navigateTo({
      url: '/packMember/pages/member/groupActivity/activityIntroduce/activityIntroduce',
    })

  },
  formSubmitAll: function () {
    var that = this;
    server.getUserInfo(function () {
      utoken = wx.getStorageSync("utoken");
      server.sendRequest({
        url: '?r=activity.index.edit&utoken=' + utoken,
        data: {
          title: that.data.formInfo.actItem,
          start_time: that.data.Startdate + ' ' + that.data.Starttimne + ":00",
          locate: that.data.formInfo.actAddress,
          lat: that.data.formInfo.lat,
          lng: that.data.formInfo.lng,
          banner_imgs: that.data.imageValueLists,
          cost_type: that.data.payNum,
          end_time: that.data.Enddate + ' ' + that.data.Endtime + ":00",
          limit_members: that.data.formInfo.actPersonnum,
          type: that.data.activityType,
          note: that.data.activityIntroduce,
          mobile: that.data.verification
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            activity_id: res.data.result.activity_id
          });
          wx.redirectTo({
            url: '/packMember/pages/member/groupActivity/establishActivity/establishActivity?activity_id=' + that.data.activity_id,
          })

        }
      })
    })
  }
})