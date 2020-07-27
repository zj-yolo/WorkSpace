var that = '';
var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var nowDate = new Date();
Page({
  data: {
    loading:true,
    showImage: false,
    isPlay: true,
    isMylist: false,
    Imagenum: 6,
    imageWidth: '',
    imageWidth2: '',
    personImageWidth1: '',
    personImageWidth2: '',
    isJoinDrtial: false,
    eidtList: {}

  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    that = this;
    utoken = wx.getStorageSync("utoken");
    that.getList();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: res.windowWidth / 3,
          imageWidth2: res.windowWidth / 9 - 10,
          personImageWidth1: res.windowWidth / 0.5,
        })
      }
    })
  },

  onShow: function () {
    var that = this;
    var showToast = false;
    that.getList(showToast);
  },
  getList: function (showToast) {
    var showToast = showToast === undefined;
    server.sendRequest({
      url: '?r=activity.index.my_activity&utoken=' + utoken,
      method: 'GET',
      showToast,
      success: function (res) {
        if (res.data.result[0]) {
          that.setData({
            concentList: res.data.result,
            isMylist: false
          });
          for (var i in that.data.concentList) {
  var time = that.data.concentList[i].date.y + '-' + that.data.concentList[i].date.m + '-' + that.data.concentList[i].date.d;
            var s = time;
            s = s.replace(/-/g, "/");
            var date = new Date(s);
            if (nowDate > date) {
              that.data.concentList[i].isTime = false
              that.setData({
                concentList: that.data.concentList
              })
            } else {
              that.data.concentList[i].isTime = true
              that.setData({
                concentList: that.data.concentList
              })
            }
          }
        } else {
          that.setData({
            isMylist: true
          })
        }
        that.setData({
          loading:false
        })
      }
    })
  },
  joinCreatActivity: function () {
    wx.redirectTo({
      url: "/packMember/pages/member/groupActivity/groupActivity",
    })
  },
  joinUserInfo: function (e) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    var currid = e.currentTarget.dataset.id
    that.setData({
      isJoinDrtial: true
    })
    server.sendRequest({
      url: '?r=activity.index.views',
      data: {
        utoken: utoken,
        activity_id: currid
      },
      method: 'POST',
      success: function (res) {
        wx.navigateTo({
          url: '/packMember/pages/member/groupActivity/establishActivity/establishActivity?activity_id=' + currid,
        })
      }
    })
  },
  deleteActivity: function (e) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    var currid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该活动吗？',
      confirmColor: '#D95940',
      success: function (res) {
        if (res.confirm) {
          server.sendRequest({
            url: '?r=activity.delete&utoken=' + utoken,
            data: {
              activity_id: currid
            },
            method: 'GET',
            success: function (res) {
              that.getList();
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },

  eidtActivity: function (e) {
    var that = this;
          that.setData({
        isEidt: true,
        eidtactivityId: e.currentTarget.dataset.id,
        isTime: true,
        eidtIndex: e.currentTarget.dataset.index
      })
  },
  closeEidt: function () {
    var that = this;
    that.setData({
      isEidt: false
    })
  },
  actItem: function (e) {
    that = this;

    if (e.detail.value) {
      that.setData({
        actItem: e.detail.value,
        'eidtList.title': e.detail.value
      })
    } else {
      that.setData({
        actItem: '',

      })
    }

  },

  phone: function (e) {
    that = this;
    var myphone = e.detail.value;
    if ((/^1(3|4|5|7|8)\d{9}$/.test(myphone))) {
      that.setData({
        myphone: myphone,
        'eidtList.mobile': myphone
      })
    } else {
      that.setData({
        myphone: '',

      })

      wx.showToast({
        title: '手机号错误',
        image: 'https://tws.cnweisou.com/images/eidtNo.png',
        duration: 2000
      })
    }

  },
  startTime(e) {
    that = this;
    console.log(e)
    var startTime = e.detail.value;
    if (startTime) {
      that.setData({
        startTime: startTime,
        'eidtList.start_time': startTime + ' ' + '00:00:00'
      })
    }

  },
  endTime(e) {
    that = this;
    var endTime = e.detail.value;
    if (endTime) {
      that.setData({
        endTime: endTime,
        'eidtList.end_time': endTime
      })
    }

  },

  map: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          mapArea: res.name,
          'eidtList.locate': res.name
        })
      },
    })
  },

  eidtContArea: function (e) {
    if (e.detail.value) {
      that.setData({
        cont: e.detail.value,
        'eidtList.note': e.detail.value
      })
    }else{
      that.setData({
        cont: e.detail.value,
      })
    }
  },
  eidtReset: function (e) {
    var that = this;
    that.setData({
      isEidt: false
    })

  },

  eidtSubmit: function (e) {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    console.log(e)
    console.log('eidtSubmit--------')
    console.log(that.data.eidtList)
    if (JSON.stringify(that.data.eidtList) == "{}") {

      wx.showToast({
        title: '没有修改信息',
        image: 'https://tws.cnweisou.com/images/eidtNo.png',
        duration: 2000
      })
    } else {
      that.data.eidtList.utoken = utoken;
      that.data.eidtList.activity_id = that.data.eidtactivityId;
      that.setData({
        eidtList: that.data.eidtList
      })
      console.log(that.data.eidtList)
      server.sendRequest({
        url: '?r=activity.index.edit',
        data: that.data.eidtList,
        method: 'POST',
        success: function (res) {
          if (that.data.eidtList.title || that.data.eidtList.note) {
            that.getList();
          }
          wx.showToast({
            title: '修改成功',
            image: 'https://tws.cnweisou.com/images/eidtSucc.png',
            duration: 2000
          })

          setTimeout(function () {
            that.setData({
              isEidt: false
            })
          }, 1500)

        }

      })
    }
  },

  toAllActivity: function () {
    wx.redirectTo({
      url: '/packMember/pages/member/groupActivity/allChannel/allChannel',
    })
  }
})