var server = require('../../../../utils/server');
var cPage = 1;
var ctype = "";
Page({
    data: {
        loading: true,
        tab_index: 1,
        show: false,
        select: 1,
        orderid: 0,
        status: '',
        page: 1,
        reflesh: true,
        list: [],
    },
    onLoad: function(options) {
        var that = this;
        this.setData({ tab_index: options.status })

        if (options.status == -2) {
            that.getList('');
        } else {
            that.getList(options.status);
        }

    },
    getList(status) {

        var utoken = wx.getStorageSync("utoken"),
            that = this;
        let data = {
            utoken,
            status,
            page: this.data.page
        };

        server.sendRequest({
            url: '?r=wxapp.services.order.get_list',
            showToast: false,
            data: data,
            method: 'GET',
            success: function(res) {


                if (Number(res.data.result.total) < (res.data.result.pagesize)) {
                    that.setData({ reflesh: false })
                } else {
                    that.setData({ reflesh: true })
                }


                if (that.data.page == 1) {
                    that.setData({ list: res.data.result.list, total: res.data.result.total });
                } else {
                    if (res.data.result.list.length > 0) {
                        let data = that.data.list;
                        for (let x in res.data.result.list) {
                            data.push(res.data.result.list[x]);
                        }
                        that.setData({ list: data, total: res.data.result.total });
                    }
                }

                that.setData({
                    loading: false,
                })
            }
        })
    },
    test: function(res) {
        wx.navigateTo({
            url: "../list_detail/index?order_id=" + res.currentTarget.id
        })
    },
    pay: function(e) {
        var index = e.currentTarget.dataset.index;
        var order = this.data.list[index].orderid;
        wx.navigateTo({
            url: '/pages/order/orderpay/payment?order_id=' + order + '&tabindex=' + 1
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh()
    },
    // 删除
    delete: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var order = this.data.list[index].orderid;
        wx.showModal({
            title: '提示',
            showCancel: true,
            content: '确定删除订单吗？',
            success: function(res) {
                if (res.confirm) {
                    var utoken = wx.getStorageSync("utoken");
                    server.sendRequest({
                        url: '?r=wxapp.services.order.delete',
                        data: {
                            utoken: utoken,
                            id: order
                        },
                        method: 'GET',
                        success: function(res) {
                              wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })

                that.getList(that.data.status);
                            // server.sendRequest({
                            //     url: '?r=wxapp.services.order.get_list',
                            //     data: {
                            //         utoken: utoken
                            //     },
                            //     method: 'GET',
                            //     success: function(res) {
                            //         that.setData({ data: res.data.result })
                            //     }
                            // })
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
            url: '../services_pinjia/index?order_id=' + index
        });
    },
    cancel: function(e) {
        var index = e.currentTarget.dataset.index;
        var order = this.data.list[index].orderid;
        this.setData({ show: true, orderid: order });
    },
    hidden() {
        this.setData({ show: false });
    },
    tab(e) {

        let index = e.currentTarget.dataset.index,
            that = this,
            status;
        that.setData({ reflesh: true, page: 1 });
        index == -2 ? status = '' : status = index;
        this.setData({
            tab_index: index,
            status: status
        })



        that.getList(status);
    },
    select(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            select: index
        })
    },
    submitcancel() {
        var that = this;
        let arr = ['', '我不想要了', '与商家达成一致，取消订单', '我想换个时间', '商家拒绝提供此服务'];
        this.setData({ show: false });

        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=wxapp.services.order.cancle',
            data: {
                utoken: utoken,
                id: that.data.orderid,
                cancelreason: arr[that.data.select]
            },
            method: 'GET',
            success: function(res) {
                wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    duration: 2000
                })

                that.getList(that.data.status);
            }
        })
    },
    onReachBottom() {
        let that = this;
        if (!this.data.reflesh) return;
        let page = this.data.page + 1;
        this.setData({ reflesh: false, page: page })

        that.getList(this.data.status);
    }
})