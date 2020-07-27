var that;
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
    data: {
        cardAgain: false,
        items: [
            { name: 'man', value: '男', checked: 'true' },
            { name: 'woman', value: '女', },
        ],
        psex: 'man',
        list: ['供求', '需求'],
        sub: 0,
        showType: false,
        typeNum: 0,
        formList: {},
        imgs: [],
        position: '',
        images: [],
        values: [],
        area: ''
    },

    onLoad: function(options) {
        var that = this;
        if (options.sub) {
            that.setData({
                sub: options.sub,
                typeNum: options.sub,
            })
        }
        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=sad2.get_type&utoken=' + utoken,
            method: 'GET',
            success: function(res) {
                that.setData({
                    typeList: res.data.result
                })
            }
        })
    },
       onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
    clickTitle: function(e) {
        var that = this;
        var sub = e.currentTarget.dataset.index;
        that.setData({
            sub: sub,
            pname: '',
            psex: 'man',
            phone: '',
            cont: '',
            currtype: '',
            typeNum: sub,
        })
    },


    type: function(e) {
        that = this;
        that.setData({
            showType: true,
            listType: that.data.typeList

        })
    },
    chooseType: function(e) {
        var currIndex = e.currentTarget.dataset.index;

        that.setData({
            showType: false,
            currtype: that.data.listType[currIndex]
        })
    },


    pname: function(e) {
        that = this;
        var pname = e.detail.value;
        if (pname) {

            that.setData({
                pname: pname
            })

        } else {
            that.setData({
                pname: '',
                cardAgain: true
            })
        }
    },
    radioChange: function(e) {
        that = this;
        var psex = e.detail.value;
        that.setData({
            psex: psex,

        })
    },

    phone: function(e) {
        that = this;
        var phone = e.detail.value;
        if ((/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
            that.setData({
                phone: phone,
            })
        } else {
            that.setData({
                phone: '',
                cardAgain: true
            })

        }
    },
    areaCont: function(e) {
        that = this;
        var cont = e.detail.value;
        that.setData({
            cont: cont,
        })
    },

    position: function(e) {
        var that = this;
        wx.chooseLocation({
            success: function(res) {
                if (res.address) {
                    var num = res.address.indexOf('市');
                    var numArea = res.address.indexOf('区');
                    that.setData({
                        positionAll: res.address,
                        position: res.address.substring(0, num + 1),
                        area: res.address.substring(0, numArea + 1)
                    })
                }
            },
        })
    },
    returnIndex: function() {
        var that = this;
        that.setData({
            cardAgain: false,
        })
    },


    chooseImage: function() {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: 'https://tws.cnweisou.com/wxapi/index.php?r=sad2.upload_img&i=170&utoken=' + utoken,
                    filePath: tempFilePaths[0],
                    name: 'img',
                    success: function(res) {

                        var data = JSON.parse(res.data);
                        var imgs = that.data.images;
                        var values = that.data.values;

                        imgs.push(data.result.url);
                        values.push(data.result.value)
                        if (imgs.length > 5 || values.length > 5) {
                            wx.showToast({
                                title: '最多只能选5张',
                                image: 'https://tws.cnweisou.com/images/eidtNo.png',
                                duration: 2000
                            })

                            imgs.splice(5, imgs.length)
                            values.splice(5, values.length)
                            that.setData({
                                images: imgs,
                                ValueLists: values,
                            })
                        } else {
                            that.setData({
                                images: imgs,
                                ValueLists: values
                            })
                        }
                    }
                })
            },
        })
    },
    previewImage: function() {
        var that = this;
        wx.previewImage({
            urls: that.data.images
        })
    },
    delete: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var images = that.data.images;
        var values = that.data.ValueLists;
        images.splice(index, 1);
        values.splice(index, 1);
        that.setData({
            images: images,
            ValueLists: values
        })
    },
    formSubmitAll: function() {
        that = this;
        var utoken = wx.getStorageSync("utoken");
        server.getUserInfo(function() {
            server.sendRequest({
                url: '?r=sad2.edit&utoken=' + utoken,
                data: {
                    desc: that.data.currtype,
                    content: that.data.cont,
                    type: that.data.typeNum,
                    name: that.data.pname,
                    mobile: that.data.phone,
                    imgs: that.data.ValueLists,
                    city: that.data.position,
                    area: that.data.area
                },
                method: 'POST',
                success: function(res) {
                    wx.redirectTo({
                        url: 'myexhibit/myexhibit?issd=' + 'true' + '&sub=' + that.data.typeNum,
                        success: function() {
                            that.setData({
                                pname: '',
                                phone: '',
                                currtype: '',
                                cont: '',
                            })
                        }
                    })
                }
            })
        })
    }
})