var server = require('../../../utils/server'),
    range = 1,
    lat, lng, cateid = '',
    page = 1;

Page({
    data: {
        loading: false,
        navindex: 1,
        refresh: false,
        myKeyWord: '',
        submitData: {},
        list: []
    },
    onLoad: function(ev) {
        var that = this;
        page = 1;
        if (ev && ev.cateid) {
            cateid = ev.cateid
        }
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                console.log(res)
                lat = res.latitude;
                lng = res.longitude;
                that.data.submitData = {
                    lat: lat,
                    lng: lng,
                    site: '0',
                    keyword: that.data.myKeyWord,
                    cateid: cateid,
                    page: 1
                }
                that.getList(that.data.submitData);
            },
        });
    },

    getList: function(submitdata) {
        var that = this;
        if (submitdata.lat == '' || submitdata.lng == '') {
            wx.getLocation({
                type: 'wgs84',
                success: function(res) {
                    submitdata.lat = res.latitude;
                    submitdata.lng = res.longitude;
                },
            });
        }
        server.sendRequest({
            url: '?r=wxapp.shop.list',
            method: 'GET',
            showToast: false,
            data: submitdata,
            success: function(res) {
                wx.stopPullDownRefresh();
                var selfList = that.data.list;
                if (res.data.result.list.length > 0) {
                    for (var i in res.data.result.list) {
                        selfList.push(res.data.result.list[i])
                    }
                    that.setData({
                        refresh: false,
                        list: selfList
                    })
                } else {
                    that.setData({
                        list: selfList
                    })
                }
                that.setData({
                    loading: false,
                    data: res.data.result
                })
            }
        })
    },
    onShow: function() {
        page = 1;
    },
    onPullDownRefresh: function(e) {
        var that = this;
        page = 1;
        that.setData({
            list: []
        })
        that.data.submitData.page = page;
        that.getList(that.data.submitData);
    },
    onReachBottom: function() {
        var that = this;
        if (that.data.refresh) return;
        that.setData({ refresh: true })
        page += 1;
        that.data.submitData.page = page;
        that.getList(that.data.submitData)
    },
    merch: function(e) {
        wx.navigateTo({
            url: '/pages/goods/shop/shop?id=' + e.currentTarget.id,
        })
    },
    // 智能排序
    sort: function(e) {
        var that = this;
        page = 1;
        that.data.submitData.page = page;
        that.data.submitData.sorttype = 1;
        that.data.submitData.range = range;
        that.setData({
            navindex: e.currentTarget.id,
            list: []
        })
        that.getList(that.data.submitData);
    },
    // tab 切换
    down: function(e) {
        var that = this
        that.setData({
            navindex: e.currentTarget.id
        })
        if (that.data.navindex == 1) {
            that.setData({
                distance: true
            })
        }

    },
    // 附近的方法
    distance: function(e) {
        var that = this;
        range = e.target.dataset.index;
        page = 1;
        that.data.submitData.range = range;
        that.data.submitData.page = page;
        that.setData({
            distance: false,
            navindex: that.data.navindex,
            list: []
        })
        that.getList(that.data.submitData);
    },
    // 搜索
    formSubmit: function(e) {
        var that = this;
        console.log(e);
        let myKeyWord = typeof e.detail.value.keyword != 'undefined' ? e.detail.value.keyword : e.detail.value;
        that.setData({
            myKeyWord,
            list: []
        })
        that.data.submitData.keyword = that.data.myKeyWord;
        that.data.submitData.page = 1;
        that.getList(that.data.submitData);
    },
    list_bd: function() {
        this.setData({
            navindex: 0
        })
    },
    phone: function(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.index
        })
    },
    addr: function(e) {
        wx.openLocation({
            latitude: parseFloat(e.target.dataset.lat),
            longitude: parseFloat(e.target.dataset.lng),
            name: e.currentTarget.dataset.name,
            scale: 28,

        })

    }

})