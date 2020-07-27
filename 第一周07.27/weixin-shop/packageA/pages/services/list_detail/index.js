var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var order_id, params = {};
Page({
    data: {
        isrefund: 5,
        width: Math.ceil(wx.getSystemInfoSync().windowWidth) * 2,
        show: 1
    },
    onLoad: function(options, Zero) {
        console.log(options)
         console.log(Zero)
        utoken = wx.getStorageSync("utoken");
        var that = this;
        params = options;
        order_id = params.order_id;
        if (params.currIndex) {
            var currIndex = params.currIndex;
            that.setData({
                currIndex: currIndex,
            })
        }
        if (params.orderid) {
            that.setData({
                order_id: orderid
            })
        } else if (params.order_id) {
            that.setData({
                order_id: order_id
            })
        }
        // console.log(options);39054
        // console.log(111);
        // console.log('options');
        // var scene = decodeURIComponent(options.scene);
        // var x = 'id=1';
        // var x= 'id=5&x=2';
        // console.log();
        // var res=JSON.parse(decodeURIComponent(options.scene));



        if (params.scene) {
            let scene = decodeURIComponent(options.scene);
            console.log(scene);
            params = {};
            let temp1 = scene.split('&');
            for (let i = 0; i < temp1.length; i++) {
                let temp2 = temp1[i].split('=');
                params[temp2[0]] = temp2[1];
            }
            order_id = params.oid;
            utoken = wx.getStorageSync("utoken");
            // console.log(params);
            server.sendRequest({
                url: '?r=wxapp.services.order.allow',
                data: {
                    orderid: order_id,
                    type: 'verify',
                    utoken: utoken,
                    // orderid: order_id
                },
                method: 'GET',
                success: function(res) {

                    if (res.data.status == '-1') {
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
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
                        var result = res.data.result
                        that.setData({
                            result: result,
                        });

                        if (result.refund) {
                            that.setData({
                                refundMsg: result.refund.msg,
                                refundReply: result.refund.reply
                            })
                        }
                        var x = res.data.result.goods.timestart
                        var times = that.timex(res.data.result.goods.timestart);
                        var start = that.timex(res.data.result.order.order_start_time);
                        if (res.data.result.order.order_end_time != '0') {
                            var end = that.timex(res.data.result.order.order_end_time)
                        } else {
                            var end = '';
                        }

                        that.setData({
                            times: times,
                            start: start,
                            end: end,
                            result: {
                                log: result.order,
                                goods: result.goods
                            }
                        })

                        // 如果交易完成
                        if (that.data.result.order_status_desc && that.data.result.order_status_desc.indexOf("完成") == '2') {
                            that.setData({
                                status: 1
                            })
                        } else {
                            that.setData({
                                status: 2
                            })
                        }
                        that.setData({
                            hexiao: 1
                        })
                    }


                    // if (res.data.status == '-1') {
                    //     wx.showModal({
                    //         title: '提示',
                    //         content: '核销身份不符',
                    //         showCancel: false,
                    //         success: function(res) {
                    //             if (res.confirm) {
                    //                 wx.reLaunch({
                    //                     url: '../../index/index'
                    //                 })
                    //             }
                    //         }
                    //     })
                    // } else {
                    // console.log(res.data.status);




                }
            })


        } else {
            console.log(222);
            // 产生核销二维码的接口
            utoken = wx.getStorageSync("utoken");
            server.sendRequest({
                url: '?r=wxapp.services.order.getQrcode',
                data: {
                    utoken: utoken,
                    orderid: order_id
                },
                method: 'GET',
                success: function(res) {
                    if (res.data.result && res.data.result.url) {
                        that.setData({
                            url: res.data.result.url
                        })
                    }
                }
            })
            utoken = wx.getStorageSync("utoken");
            server.sendRequest({
                url: '?r=wxapp.services.order.detail',
                data: {
                    utoken: utoken,
                    id: order_id,
                },
                method: 'GET',
                success: function(res) {
                    var result = res.data.result
                    that.setData({
                        result: result,
                    });

                    if (result.refund) {
                        that.setData({
                            refundMsg: result.refund.msg,
                            refundReply: result.refund.reply
                        })
                    }
                    var x = res.data.result.goods.timestart
                    var times = that.timex(res.data.result.goods.timestart);
                    var start = that.timex(res.data.result.log.order_start_time);
                    if (res.data.result.log.order_end_time != '0') {
                        var end = that.timex(res.data.result.log.order_end_time)
                    } else {
                        var end = '';
                    }

                    that.setData({
                        times: times,
                        start: start,
                        end: end
                    })

                    // 如果交易完成
                    if (that.data.result.order_status_desc && that.data.result.order_status_desc.indexOf("完成") == '2') {
                        that.setData({
                            status: 1
                        })
                    } else {
                        that.setData({
                            status: 2
                        })
                    }
                }
            })

        }






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
    // 确认核销
    to_use: function() {
        var that = this;
        utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=wxapp.services.order.complete',
            data: {
                utoken: utoken,
                orderid: order_id
            },
            method: 'GET',
            success: function(res) {
                // console.log(res);
                // console.log('11111111111111111111');
                // if(res.data.status=='-1'){
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            wx.reLaunch({
                                url: '../../index/index'
                            })
                        }
                    }
                })
                // }
                // console.log(111);

                // console.log(res.data.result.url);
                // that.setData({
                //   url:res.data.result.url
                // })
                // console.log(111);
            }
        })
    },
    timex: function(x) {
        var time = new Date(parseFloat(x) * 1000);
        var y = time.getFullYear();
        var M = (time.getMonth() + 1) > 10 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
        var d = (time.getDate()) > 10 ? (time.getDate()) : "0" + (time.getDate());
        var h = (time.getHours()) > 10 ? (time.getHours()) : "0" + (time.getHours());
        var m = (time.getMinutes()) > 10 ? (time.getMinutes()) : "0" + (time.getMinutes());
        var s = (time.getSeconds()) > 10 ? (time.getSeconds()) : "0" + (time.getSeconds());
        var times = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
        // console.log(time);
        return times

    },
    //支付
    pay: function(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../orderpay/payment?order_id=' + index
        });
    },
    // 取消订单
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
                    //订单列表
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
    // 评价
    evaluation: function(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../pinjia/index?order_id=' + index
        });
    },
    // 物流信息
    logistics: function(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../logistics/index?order_id=' + index
        });
    },

    // 查看退款
    viewprogress: function() {
        var that = this;
        wx: wx.redirectTo({
            url: '/pages/order/refund/refundDetails/refundDetails?id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,
        })
    },

    withdraw: function() {
        var that = this;
        utoken = wx.getStorageSync("utoken");
        wx.showModal({
            title: '提示',
            content: '您确定要取消申请么',
            success: function(res) {
                if (res.confirm) {


                    //订单列表
                    server.sendRequest({
                        url: '?r=order.refund.cancel&utoken=' + utoken + '&id=' + that.data.order_id,

                        method: 'GET',
                        success: function(res) {
                            wx.redirectTo({
                                url: '/pages/order/details/index?order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,
                            })
                        }
                    })
                } else if (res.cancel) {}
            }
        })
    },



    // 申请退款
    applyRefund: function() {
        var that = this;
        wx.redirectTo({
            url: '../refund/refund?maxAmount=' + that.data.result.price + '&order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,

        })
    },
    // 投诉卖家
    complaint: function() {
        wx.redirectTo({
            url: '../complaint/complaint'
        })
    },
})