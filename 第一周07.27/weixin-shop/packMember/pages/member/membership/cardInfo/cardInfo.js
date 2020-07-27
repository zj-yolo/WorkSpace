var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
    data: {
        money: '',
        cardid: '',
        goods_name: '',
        user: '',
        ordersn: '',
        price: '',
        orderid: '',
        weixin_app: '',
        weixin_app_paycon: '',
        weixin_app_payimg: '',
        wxdata: '',
        order: '',
        weixin_app: '',
        infoList: {}
    },

    onLoad: function(options) {
        utoken = wx.getStorageSync("utoken");
        var that = this;
        console.log(options)
        that.setData({
            money: options.money,
            cardid: options.cardid,
            realname: options.realname,
            mobile: options.mobile

        });
        console.log(that.data.infoList)
        server.sendRequest({
            url: '?r=wxapp.member.vipcard.doPay',
            data: {
                utoken: utoken,
                fee: that.data.money,
                cardid: that.data.cardid,
            },
            method: 'POST',
            success: function(res) {
                server.globalData.wxdata = res.data.result[0].data
                server.globalData.order = res.data.result[0].order;
                that.setData({
                    goods_name: res.data.result.params_data.title,
                    ordersn: res.data.result.params_data.ordersn,
                    price: res.data.result.params_data.fee,
                    user: res.data.result.params_data.user,
                    orderid: res.data.result[0].orderid,
                    paydata: res.data.result.data,
                    order: res.data.result.order,
                    weixin_app: res.data.result[0].data.weixin_app,
                    weixin_app_paycon: res.data.result[0].data.weixin_app_paycon,
                    weixin_app_payimg: res.data.result[0].data.weixin_app_payimg,
                    wxdata: res.data.result[0].data,
                    orderCont: res.data.result[0].order,
                    weixin_app: res.data.result[1].weixin_app,
                });
                wx.setStorageSync('wxdata', that.data.wxdata)
                console.log('wxdata', that.data.orderid)
            },
        })
    },
    payCard: function() {
        var that = this;
        wx.navigateTo({
            url: '../cardSuccess/cardSuccess?orderid=' + that.data.orderid + '&cardid=' + that.data.cardid + '&weixin_app=' + that.data.weixin_app + '&realname=' + that.data.realname + '&mobile=' + that.data.mobile
        })
    },
})