var that;
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
    data: {},
    onLoad: function(options) {
        that = this;
        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=wxapp.diyform.diyform.getlist&utoken=' + utoken,
            method: 'GET',
            success: function(res) {
                if (res.data.result[0]) {
                    that.setData({
                        myList: res.data.result
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '目前没有可以参与的活动',
                        success: function(res) {
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
    },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
    joinDetail: function(e) {
        var currid = e.currentTarget.dataset.index;
        var typeid = that.data.myList[currid].id;
        server.getUserInfo(function() {
            wx.navigateTo({
                url: '../formDetail/formDetail?typeid=' + typeid,
            })
        });
    },
    joinCreate: function() {
        wx.redirectTo({
            url: '/pages/bottom/customerForm/customerForm',
        })
    }
})