var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
function date_time(data) {

        var time = new Date(data * 1000);

        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        return (y + '-' + M + '-' + d + ' ' + h + ":" + m + ":" + s);
    }
Page({
    data: {
        loading: true
    },
    onLoad: function(options) {
        utoken = wx.getStorageSync("utoken");
        var that = this
        that.setData({ id: options.id })
        that.loadingData();
    },
    loadingData: function() {
        utoken = wx.getStorageSync("utoken");
        var that = this;
        server.sendRequest({
            url: "?r=wxapp.creditshop.log.detail&id=" + that.data.id,
            showToast: false,
            data: {
                utoken: utoken
            },
            method: "GET",
            success: function(res) {

                let data = res.data.result;
                data.log.createtime = date_time(data.log.createtime);

                if (data.log.paytime) {
                    data.log.paytime = date_time(data.log.paytime);
                }

                that.setData({
                    loading: false,
                    data: data
                })
                if (that.data.data.goods.money || that.data.data.goods.money) {
                    var sum = parseFloat(that.data.data.goods.money) + parseFloat(that.data.data.goods.dispatch)
                    that.setData({
                        sum: sum
                    })
                }
            }
        })
    },
      onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
    pay: function() {
        var that = this;
        wx.reLaunch({
            url: "/packageA/pages/groupbuy/cashier/index?orderid=" + that.data.data.goods.id + '&addressid=' + that.data.data.log.address.id + "&name=integral"
        })
    },
    toindex: function() {
        wx.reLaunch({
            url: "/pages/index/index"
        })
    }
})