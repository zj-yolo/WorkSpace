Page({
    data: {
        orderId: '',
        myList: ''
    },
    toStart: function() {
        wx.reLaunch({
            url: '../../index/index'
        })
    },
    onLoad: function(options) {

        if (options.myList == "myList") {
            this.setData({
                myList: true
            })
        }
        var orderId = options.order_id;
        var order = server.globalData.order;
        var wxdata = server.globalData.wxdata;
        this.setData({
            order: order,
            wxdata: wxdata
        })
    },
    pay: function() {
        var wxdata = server.globalData.wxdata.wdata
        var timeStamp = wxdata.timeStamp + "";
        var nonceStr = wxdata.nonceStr + "";
        var package1 = wxdata.package
        var sign = wxdata.sign;
        wx.requestPayment({
            'nonceStr': nonceStr,
            'package': package1,
            'signType': 'MD5',
            'timeStamp': timeStamp,
            'paySign': sign,
            'success': function(res) {

                wx.showToast({
                    title: '支付成功',
                    //  icon: 'success',
                    image: 'https://tws.cnweisou.com/images/eidtSucc.png',
                    duration: 2000
                })

                setTimeout(function() {
                    wx.switchTab({
                        url: "../../member/index/index"
                    });
                }, 2000);

            },
            'fail': function(res) {
                wx.showToast({
                    title: '支付失败',
                    image: 'https://tws.cnweisou.com/images/eidtNo.png',
                    duration: 1500
                })
                if (that.data.myList) {
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)

                } else {
                    setTimeout(function() {
                        wx.redirectTo({
                            url: '../list/list?id=' + 1 + '&currid=' + 1
                        });
                    }, 1500)
                }


            }
        })
    }
})