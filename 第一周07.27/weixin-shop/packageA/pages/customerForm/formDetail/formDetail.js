var that;
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    that = this;
    var typeid = options.typeid;
    that.setData({
      typeid: options.typeid
    })

    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.diyform.diyform.getlistdetail&utoken=' + utoken + '&typeid=' + that.data.typeid,
      data: {},
      method: 'GET',
      success: function (res) {
        if (res.data.result.sj) {
          if (res.data.result.sj[0]) {
            that.setData({
              myList: res.data.result.sj,
              title: res.data.result.type.title
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '您还未参与该活动，点击确定即可申请',
            success: function (res) {
              if (res.confirm) {
                let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
                if (extConfig.tabBarPage) {
                  var tabBarPage = extConfig.tabBarPage;
                  for (var i in tabBarPage) {
                    if (tabBarPage[i] == '/pages/customerForm/customerForm') {
                      if (that.data.typeid) {
                        wx.reLaunch({
                          url: '/pages/bottom/customerForm/customerForm?id=' + that.data.typeid
                        });
                      } else {
                        wx.switchTab({
                          url: '/pages/bottom/customerForm/customerForm'
                        })
                      }
                    } else {
                      wx.redirectTo({
                        url: '/pages/bottom/customerForm/customerForm?id=' + that.data.typeid
                      })
                    }
                  }
                }
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
  },
  joinCreate: function () {
    wx.redirectTo({
      url: '/pages/bottom/customerForm/customerForm?id=' + that.data.typeid,
    })
  }

})