var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var input_value,
    that;
var shopId = '';
Page({

    data: {
        loading: true,
        numid: 0,
        sub: 0,
        isAdvs: '',
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        showshopcode: false,
        top: 300,
        left: 0,
        showIndex: false,
        shareIcon: false
    },


    onLoad: function(options) {
        if (options.share) {
            this.setData({
                shareIcon: true
            })
        }
        var that = this;

        if (options.scene) {
            if (typeof options.scene !== 'undefined') {
                let scene = decodeURIComponent(options.scene);
                let params = {};
                let temp1 = scene.split('&');
                for (let i = 0; i < temp1.length; i++) {
                    let temp2 = temp1[i].split('=');
                    params[temp2[0]] = temp2[1];
                }
                shopId = params.merchid;
                that.setData({
                    shopId: shopId
                })
            }
        } else {
            shopId = options.id;
            that.setData({
                shopId: shopId
            })
        }
        that.getShop(that.data.shopId);
        var pages = getCurrentPages()
        if (pages.length == 1) {
            that.setData({
                showIndex: true
            })
        }

    },
    getShop: function(shopid) {
        // 获取店铺介绍
        var that = this;
        server.sendRequest({
            url: '?r=wxapp.shop',
            showToast: false,
            data: {
                merchid: shopid
            },
            method: 'GET',
            success: function(res) {
                that.setData({
                    shopinfo: res.data.result.shopinfo,
                    goods: res.data.result.goods,
                    newgoods: res.data.result.newgoods,
                    indexrecommands: res.data.result.indexrecommands,
                    totalsales: res.data.result.totalsales,
                    totalfavor: res.data.result.totalfavor,
                    averscore: Math.round(res.data.result.averscore),
                    totalgoods: res.data.result.totalgoods,
                    totalnewgoods: res.data.result.totalnewgoods,
                    totalrecommands: res.data.result.totalrecommands,
                    loading: false
                })
                if (res.data.result) {
                    if (res.data.result.advs[0]) {

                        that.setData({
                            advs: res.data.result.advs,
                            isAdvs: true
                        })
                    } else {
                        that.setData({
                            isAdvs: false
                        })
                    }
                }
                that.setData({
                    averscoreImg: "http://tws.cnweisou.com/images/stars" + that.data.averscore + ".gif"
                })
            }
        })
    },
    getSearch: function(value) {
        var that = this;
        var keyword;
        if (value) {
            keyword = value;
        } else {
            keyword = ''
        }
        server.sendRequest({
            url: '?r=wxapp.shop&merchid=' + that.data.shopId,
            data: {
                keyword: keyword
            },
            method: 'GET',
            success: function(res) {
                that.setData({
                    shopinfo: res.data.result.shopinfo,
                    goods: res.data.result.goods,
                    newgoods: res.data.result.newgoods,
                    indexrecommands: res.data.result.indexrecommands,
                    totalsales: res.data.result.totalsales,
                    totalfavor: res.data.result.totalfavor,
                    averscore: Math.round(res.data.result.averscore),
                    totalgoods: res.data.result.totalgoods,
                    totalnewgoods: res.data.result.totalnewgoods,
                    totalrecommands: res.data.result.totalrecommands
                })
                if (res.data.result) {
                    if (res.data.result.advs[0]) {

                        that.setData({
                            advs: res.data.result.advs,
                            isAdvs: true,
                        })
                    } else {
                        that.setData({
                            isAdvs: false,
                        })
                    }
                }
                that.setData({
                    averscoreImg: "http://tws.cnweisou.com/images/stars" + that.data.averscore + ".gif"
                })
            }
        })
    },
    formSubmit: function(e) {
        var that = this;

        that.getSearch(input_value);

    },
    inputchange: function(e) {
        input_value = e.detail.value;
    },
    //拨打电话
    giveTelePhone: function(e) {
        var that = this;
        var curtel = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: curtel
        })
    },
    //点击二维码
    sceneCode: function(e) {
        var that = this;
        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=shop.merch_code',
            data: {
                merchid: that.data.shopId,
                utoken: utoken
            },
            method: "GET",
            success: function(res) {
                var codeImg = res.data.result.url;
                var shopCode = [];
                shopCode.push(codeImg);
                that.setData({
                    shopCodeImg: codeImg,
                    showshopcode: true,
                    arrayShopCode: shopCode
                })
            }
        })
    },
    //预览二维码图片
    previewCodeImg: function() {
        var that = this;
        wx.previewImage({
            urls: that.data.arrayShopCode
        })
    },
    //关闭二维码图片
    closeShopCode: function() {
        var that = this;
        that.setData({
            showshopcode: false
        })
    },
    // 点击头部列表
    clickTitle: function(e) {
        var that = this;
        var sub = e.currentTarget.dataset.index;
        that.setData({
            sub: sub,
        })
    },
    // 点击商品
    tapGoods: function(e) {
        that = this;
        var objectId = e.currentTarget.dataset.objectId
        wx.navigateTo({
            url: "../detail/detail?objectId=" + objectId + "&myshop=" + shopId
        });
    },
    // 进入详细页
    joinIndu: function(e) {
        var that = this;
        var sub = e.currentTarget.dataset.index;
        that.setData({
            sub: 0,
        })
        wx.navigateTo({
            url: 'introduceShop/introduceShop?id=' + that.data.shopId,
        })
    },
    onShareAppMessage: function() {
        return {
            path: '/pages/goods/shop/shop?id=' + this.data.shopId + '&share=' + 'share',
        }
    },
    // 前往自制客服
    toChat() {
      let that =this;
        if (!wx.getStorageSync('userInfo')) {
            wx.navigateTo({
                url: '/pages/getAuth/index'
            })
        } else {
            // myshop     店铺id
            // logo_shop  店铺logo
            wx.navigateTo({
                url: '/pages/chat/index?storeid=' + that.data.shopId + '&logo=' + that.data.shopinfo.logo + '&name=' + that.data.shopinfo.merchname
            })
        }



    }
})