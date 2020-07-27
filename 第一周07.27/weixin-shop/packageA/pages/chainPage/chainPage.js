// chainPage.js
var server = require('../../../utils/server.js');

var utoken = wx.getStorageSync("utoken");
// var temp;
Page({
    data: {

    },
    onLoad: function(e) {
        // 传给外链的数据
        var that = this;

        let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
        var i = extConfig.uniacid;
        utoken = wx.getStorageSync("utoken");
        var r = 'adactivity';
        // console.log(i);
        server.sendRequest({
            url: '?r=wxapp.indexpage.getdetail',
            data: {

                id: e.cate,
            },
            method: 'GET',
            success: function(res) {
                var cate = e.cate;
                console.log(e.cate);
                that.setData({
                    wl: {
                        i: i,
                        r: r,
                        cate: e.cate,
                        utoken: utoken,
                        temp_id: res.data.result.temp_id
                    }
                })
                server.sendRequest({
                    url: '?r=wxapp.indexpage.getUrl',
                    data: {
                        cate,
                    },
                    method: 'GET',
                    success: function(res) {

                        that.setData({
                            wl: {
                                url: res.data.result.domain
                            }
                        })
                    }
                });
            }
        });


    },
})