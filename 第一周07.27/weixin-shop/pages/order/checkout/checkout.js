var server = require('../../../utils/server');
var timeout = null
var exit;
Page({
    data: {
        amount: 0,
        carts: [],
        addressList: [],
        addressIndex: 0,
        height: 0
    },
    addressObjects: [],
    doHandler: function() {
        if (server.globalData.login) {
            wx.switchTab({
                url: '/pages/member/index/index'
            });
        }
    },
    onShow: function() {
        if (exit) {
            wx.navigateBack({
                delta: 1,
                success: function(res) {},
                fail: function() {},
                complete: function() {}
            })
        }
    },
    onLoad: function(options) {
        exit = false;
        var that = this;
        var cartIds = options.cartIds;
        var amount = options.amount;
        if (options.mid) { that.setData({ mid: options.mid }) }
        if (options.time) { var time = options.time; }
        var utoken = wx.getStorageSync("utoken");
        server.globalData.cartIds = cartIds;
        server.globalData.amount = amount;
        this.setData({
            cartIds: cartIds,
            amount: amount,
            time: time
        });
        timeout = setTimeout(function doHandler() {
            if (!server.globalData.login) {
                exit = true;
                wx.switchTab({
                    url: '/pages/member/index/index'
                });
            } else {
                server.sendRequest({
                    url: '?r=wxapp.member.address.selector',
                    data: {
                        utoken: utoken
                    },
                    method: 'GET',
                    success: function(res) {
                        var data = res.data
                        exit = true;
                        if (data.msg == "没有数据") {
                
                            if (that.data.mid) {
                                
                                wx.navigateTo({ url: "../../../../../../address/add/add?cartIds=" + cartIds + "&mid=" + that.data.mid + '&returnTo=1' })
                            } else {
                                // console.log(time)
                                if (time) {
                                
                                    wx.reLaunch({
                                        url: '../../address/add/add?cartIds=' + cartIds + '&amount=' + amount + '&title=' + options.title + '&time=' + options.time + '&price=' + options.price + '&img=' + options.img + '&returnTo=1'
                                    });
                                } else {
                              
                                    wx.navigateTo({
                                        url: '../../address/add/add?returnTo=1'
                                    });
                                }

                            }
                        } else {
                            if (time) {
                                wx.reLaunch({
                                    url: '../ordersubmit/index?cartIds=' + cartIds + '&amount=' + amount + '&title=' + options.title + '&time=' + options.time + '&price=' + options.price + '&img=' + options.img + '&store=' + options.store,
                                });
                            } else {
                                if (that.data.mid) {
                                    wx.navigateTo({ url: "../ordersubmit/index?cartIds=" + cartIds + "&mid=" + that.data.mid })
                                } else {
                                    wx.navigateTo({
                                        url: '../ordersubmit/index'
                                    });
                                }

                            }

                        }
                    }
                })

            }
        }, 500);

        wx.getSystemInfo({

            success: function(res) {
                that.setData({ height: res.windowHeight })
            }

        })
    },
    readCarts: function(options) {
        var amount = parseInt(options.amount);
        this.setData({
            amount: amount
        });
        var cartIds = options.cartIds;
        var cartIdArray = cartIds.split(',');
        var carts = [];
        for (var i = 0; i < cartIdArray.length; i++) {
            var query = new AV.Query('Cart');
            query.include('goods');
            query.get(cartIdArray[i]).then(function(cart) {
                carts.push(cart);
            }, function(error) {

            });
        }
        this.setData({
            carts: carts
        });
    },
})