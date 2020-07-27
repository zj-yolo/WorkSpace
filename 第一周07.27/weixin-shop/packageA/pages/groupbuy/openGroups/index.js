var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({

    data: {
        width: Math.ceil(wx.getSystemInfoSync().windowWidth) * 2,
        loading: true,
        nameArr: '',
        priceId: '',
        groupPrice: '',
        isverify: '',
        storeids: ''
    },
    onLoad: function(res) {
        var ss = res.name_arr.split(",");
        if (ss == "undefined") {
            ss = ''
        }
        var that = this;
        that.setData({
            id: res.id,
            type: res.type,
            nameArr: ss,
            priceId: res.priceId,
            groupPrice: res.groupPrice,
            isverify: res.isverify,
            storeids: res.storeids
        })
        that.loadPageData();
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh()
    },

    loadPageData: function() {
        utoken = wx.getStorageSync("utoken");
        var that = this;
        server.sendRequest({
            url: '?r=wxapp.groups.goods.openGroups',
            showToast: false,
            data: {
                utoken: utoken,
                id: that.data.id
            },
            method: 'GET',
            success: function(res) {
                that.setData({
                    data: res.data.result,
                    loading: false
                })
            }
        })
    },onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
    toopen: function(res) {
        var that = this;
        wx.navigateTo({
            url: '../confirmOrder/index?id=' + res.currentTarget.dataset.id + "&type=" + that.data.type + "&heads=1" + '&nameArr=' + that.data.nameArr + "&priceId=" + that.data.priceId + '&groupPrice=' + that.data.groupPrice + '&isverify=' + that.data.isverify + '&storeids=' + that.data.storeids
        })
    },
    tofight: function(res) {
        var that = this;
        wx.navigateTo({
            url: '../fightGroups/index?id=' + res.currentTarget.dataset.id
        })
    },
    todetail: function(res) {
        wx.navigateBack({
            delta: 2
        })
    }

})