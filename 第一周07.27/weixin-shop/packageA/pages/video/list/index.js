var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
const app = getApp()
Page({
    data: {
        loading: true
    },
    todetail: function(res) {
        wx.navigateTo({
            url: "../detail/index?id=" + res.currentTarget.dataset.id
        })
    },
    onLoad: function() {
        var utoken = wx.getStorageSync("utoken");
        var that = this;
        server.sendRequest({
            url: '?r=wxapp.video.getlist',
            showToast: false,
            method: 'GET',
            data: {
                utoken: utoken
            },
            success: function(res) {
                if (res.data.result) {
                    that.setData({
                        loading: false,
                        data: res.data.result,
                        search: res.data.result,
                    });
                }
            }
        })
    },
    formSubmit: function(e) {
        var that = this;
        var nowCont = e.detail.value;

        that.setData({
            nowCont: nowCont
        })
        var utoken = wx.getStorageSync("utoken");

        server.sendRequest({
            url: '?r=wxapp.video.getlist&keyword=' + that.data.nowCont,
            method: 'POST',
            data: {
                utoken: utoken
            },
            success: function(res) {
                if (res.data.result) {
                    that.setData({
                        data: res.data.result,
                        search: res.data.result,
                    });
                    if (that.data.data.length == 0) {
                        wx.showModal({
                            title: '提示',
                            content: '没有搜索到相应内容',
                            success: function(res) {
                                if (res.confirm) {
                                    that.setData({
                                        nowCont: ''
                                    })
                                } else if (res.cancel) {
                                    that.setData({
                                        nowCont: ''
                                    })
                                }
                            }
                        })

                    }

                }
            }
        })

    },

})