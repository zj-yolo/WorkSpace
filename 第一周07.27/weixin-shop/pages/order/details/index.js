var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var order_id, currIndex;
Page({
    data: {
        isrefund: 5,
        width: Math.ceil(wx.getSystemInfoSync().windowWidth) * 2,
        customerserver: '',
        show: 1,
        loading: true,
        isGrogShop: false,
    }, 
    onLoad: function(options, Zero) {
        var that = this;


        utoken = wx.getStorageSync("utoken");
        currIndex = '', order_id = '';
        if (wx.getStorageSync('customerserver')) {
            that.setData({
                customerserver: wx.getStorageSync('customerserver')
            })
        }
        if (options.order_id) {
            order_id = options.order_id;
            that.setData({
                order_id: order_id,
            })
        }
        if (options.currIndex) {
            currIndex = options.currIndex;
            that.setData({
                currIndex: currIndex
            })
        }
        if (options.myIndex) {
            that.setData({
                myIndex: options.myIndex
            })
        }
        if (typeof options.scene !== 'undefined') {
            let scene = decodeURIComponent(options.scene);

            let params = {};
            let temp1 = scene.split('&');
            for (let i = 0; i < temp1.length; i++) {
                let temp2 = temp1[i].split('=');
                params[temp2[0]] = temp2[1];
            }
            order_id = params.oid;
            that.setData({
                hexiao: 1
            })
            utoken = wx.getStorageSync("utoken");
            // type = verify
            server.sendRequest({
                url: '?r=wxapp.order.detail',
                data: {
                    id: order_id,
                    type: 'verify'
                },
                method: 'GET',
                success: function(res) {
                    var result = res.data.result
                    that.setData({
                        result: result,
                        refundstate: result.refundstate,
                        status: result.status,

                    });
                    if (res.data.result.createOrder) {
                        that.setData({
                            createOrder: res.data.result.createOrder,
                        });
                    }
                    if (result.refund) {
                        that.setData({
                            refundMsg: result.refund.msg,
                            refundReply: result.refund.reply
                        })
                    }
                    var time = new Date(parseFloat(res.data.result.createtime) * 1000);
                    var y = time.getFullYear();
                    var M = (time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
                    var d = (time.getDate()) > 10 ? (time.getDate()) : "0" + (time.getDate());
                    var h = (time.getHours()) > 10 ? (time.getHours()) : "0" + (time.getHours());
                    var m = (time.getMinutes()) > 10 ? (time.getMinutes()) : "0" + (time.getMinutes());
                    var s = (time.getSeconds()) > 10 ? (time.getSeconds()) : "0" + (time.getSeconds());
                    var times = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
                    that.setData({
                        times: times
                    })
                }
            })


        } else {
            server.sendRequest({
                url: '?r=wxapp.order.detail',
                data: {
                    utoken: utoken,
                    id: order_id
                },
                method: 'GET',
                success: function(res) {
                    var result = res.data.result
                    if(result.fiveType == 1) {
                      that.setData({
                        isGrogShop: true,
                      })
                    }
                    that.setData({
                        result: result,
                        refundstate: result.refundstate,
                        status: result.status,

                    });
                    if (result.refund) {
                        that.setData({
                            refundMsg: result.refund.msg,
                            refundReply: result.refund.reply
                        })
                    }
                    if (res.data.result.createOrder) {

                        let times;
                        if (res.data.result.distributiontime) {
                            var time = new Date(parseFloat(res.data.result.distributiontime) * 1000);
                            var y = time.getFullYear();
                            var M = (time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
                            var d = (time.getDate()) > 10 ? (time.getDate()) : "0" + (time.getDate());
                            var h = (time.getHours()) > 10 ? (time.getHours()) : "0" + (time.getHours());
                            var m = (time.getMinutes()) > 10 ? (time.getMinutes()) : "0" + (time.getMinutes());
                            var s = (time.getSeconds()) > 10 ? (time.getSeconds()) : "0" + (time.getSeconds());
                            times = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
                        } else {
                            times = '';
                        }


                        that.setData({
                            createOrder: res.data.result.createOrder,
                            cardmessage: res.data.result.cardmessage,
                            requirements: res.data.result.requirements,
                            subscribers: res.data.result.subscribers,
                            subscriberscall: res.data.result.subscriberscall,
                            distributiontime: times
                        });
                    }
                    var time = new Date(parseFloat(res.data.result.createtime) * 1000);
                    var y = time.getFullYear();
                    var M = (time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
                    var d = (time.getDate()) > 10 ? (time.getDate()) : "0" + (time.getDate());
                    var h = (time.getHours()) > 10 ? (time.getHours()) : "0" + (time.getHours());
                    var m = (time.getMinutes()) > 10 ? (time.getMinutes()) : "0" + (time.getMinutes());
                    var s = (time.getSeconds()) > 10 ? (time.getSeconds()) : "0" + (time.getSeconds());
                    var times = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
                    that.setData({
                        times: times
                    })
                    if (result.isverify == '1') {
                        // 产生核销二维码的接口
                        server.sendRequest({
                            url: '?r=wxapp.order.op.getQrcode',
                            data: {
                                utoken: utoken,
                                orderid: order_id
                            },
                            method: 'GET',
                            success: function(res) {
                                // console.log(res.data.result.url);
                                if (res.data.result && res.data.result.url) {
                                    that.setData({
                                        url: res.data.result.url
                                    })
                                }
                            }
                        })
                    }
                }
            })




        }


        setTimeout(function() {
            that.setData({
                loading: false
            })

        }, 300)



    },

    to_use: function() {
        var that = this;
        utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=wxapp.order.op.confirm',
            data: {
                utoken: utoken,
                orderid: order_id
            },
            method: 'GET',
            success: function(res) {
                console.log(res);
                if (res.data.status.errno == '-1') {
                    wx.showModal({
                        title: '提示',
                        content: res.data.status.message,
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                wx.reLaunch({
                                    url: '../../index/index'
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '核销成功',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                wx.reLaunch({
                                    url: '../../index/index'
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    show: function() {
        var that = this;


        if (that.data.show == 1) {
            that.setData({
                show: 2
            })
        } else {
            that.setData({
                show: 1
            })
        }
    },
    //支付
    pay: function(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../orderpay/payment?order_id=' + index
        });
    },
    cancel: function(e) {
        var index = e.currentTarget.dataset.index;
        var that = this;
        wx.showModal({
            title: '提示',
            showCancel: true,
            content: '确定取消订单吗？',
            success: function(res) {
                if (res.confirm) {
                    var utoken = wx.getStorageSync("utoken");
                    server.sendRequest({
                        url: '?r=wxapp.order.op.cancel',
                        data: {
                            utoken: utoken,
                            id: index
                        },
                        method: 'GET',
                        success: function(res) {
                            wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 });
                            wx.navigateTo({
                                url: '../list/list'
                            });
                        }
                    })

                }
            }
        })
    },
    evaluation: function(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../pinjia/index?order_id=' + index
        });
    },
    logistics: function(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../logistics/index?order_id=' + index
        });
    },
    viewprogress: function() {
        var that = this;
        wx: wx.redirectTo({
            url: '/pages/order/refund/refundDetails/refundDetails?id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,
        })
    },

    // 取消申请
    withdraw: function() {
        var that = this;
        utoken = wx.getStorageSync("utoken");
        wx.showModal({
            title: '提示',
            content: '您确定要取消申请么',
            success: function(res) {
                if (res.confirm) {
                    server.sendRequest({
                        url: '?r=order.refund.cancel&utoken=' + utoken + '&id=' + that.data.order_id,
                        method: 'GET',
                        success: function(res) {
                            wx.redirectTo({
                                url: '/pages/order/details/index?order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex + '&myIndex=' + that.data.myIndex,
                            })
                        }
                    })
                } else if (res.cancel) {}
            }
        })
    },

    applyRefund: function() {
        var that = this;
        wx.redirectTo({
            url: '../refund/refund?maxAmount=' + that.data.result.price + '&order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex + '&myIndex=' + that.data.myIndex + '&dispatchprice=' + that.data.result.dispatchprice + '&vipCard=' + that.data.result.deductcredit3,
        })
    },
    complaint: function() {
        wx.redirectTo({
            url: '../complaint/complaint'
        })
    },
    joinDetail: function(e) {
        wx.redirectTo({
            url: '../../goods/detail/detail?objectId=' + e.currentTarget.dataset.id
        })

    },
    joinGoods(e) {
        if (e.detail.query.objectId != null) {
            wx.navigateTo({
                url: '/pages/goods/detail/detail?objectId=' + e.detail.query.objectId
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    },

})