var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
    data: {
        loading: true,
        list: [
            '消费记录', '充值记录'
        ],
        creditType: '',
        sub: '0',
        typeid: "2"
    },
    onLoad: function(options) {
        var that = this;
        var creditType = options.creditType;
        that.setData({
            creditType: creditType
        })
        if (options.creditType == 'credit1') {
            wx.setNavigationBarTitle({
                title: '积分明细',
            });
        } else {
            wx.setNavigationBarTitle({
                title: '余额明细',
            });
        }
    },
    onShow: function() {
        var that = this;
        that.getIntegralSum(that.data.typeid, that.data.creditType);
    },
    //获取记录
    getIntegralSum: function(typeId, creditType) {
        var that = this;
        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=wxapp.member.vipcard.getCreditLog',
            showToast: false,
            data: {
                utoken: utoken,
                typeid: typeId,
                credittype: creditType
            },
            method: 'GET',
            success: function(res) {
                if (res.data.result) {
                    that.setData({
                        consumption: res.data.result
                    })
                }
                that.setData({
                    loading: false
                })
            }
        })
    },
    clickTitle: function(e) {
        var that = this;
        var sub = e.currentTarget.dataset.index;
        var creditType = that.data.creditType;
        that.setData({
            sub: sub
        })
        if (that.data.sub == 0) {
            var currType = 2;
        } else {
            var currType = 1;
        }
        that.getIntegralSum(currType, creditType);
    },
})