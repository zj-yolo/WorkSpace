// refund.js
var that = '';
var TreatmentmodeCurrNum = '';
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
    data: {
        Treatmentmode: false,
        Refundreason: false,
        Treatmentmodeitems: ['退款', '退款退货', '换货（不退款）'],

        TreatmentmodeValue: '',
        Refundreasonitems: [
            '不想要了', '卖家缺货', '拍错了/订单信息错误', '其它'
        ],
        RefundreasonValue: '',
        images: [],
        values: [],
        RefundreasonSelectIndex: -1,
    },
    onLoad: function(options) {
        that = this;
        console.log(options)
        that.setData({
            maxAmount: parseFloat(options.maxAmount),
            order_id: options.order_id,
            currIndex: options.currIndex,
            myIndex: options.myIndex,
            vipCard: parseFloat(options.vipCard),
            maxMoney: (parseFloat(options.maxAmount) + parseFloat(options.vipCard)).toFixed(2)
        })
        if (that.data.myIndex == 2) {
            var Treatmentmodeitems = [
                '退款'
            ]
            that.setData({
                Treatmentmodeitems: Treatmentmodeitems
            })
        }

        if (that.data.myIndex == 3) {
            that.setData({
                maxAmount: options.maxAmount - options.dispatchprice
            })
        }


    },
    Treatmentmode: function() {
        that = this;
        that.setData({
            Treatmentmode: true,
        })
    },

    TreatmentmodeSelect: function(e) {
        that = this;
        var currIndex = e.detail.value
        that.setData({
            TreatmentmodeValue: that.data.Treatmentmodeitems[currIndex],
            Treatmentmode: false,
            TreatmentmodeNum: currIndex
        })
    },
    radioChange1: function(e) {
        that = this;
        that.setData({
            TreatmentmodeValue: e.detail.value,
            Treatmentmode: false,
        })
        var Treatment = []
        for (let i = 0; i < that.data.Treatmentmodeitems.length; i++) {
            Treatment.push(that.data.Treatmentmodeitems[i].name)
        }
        for (let j = 0; j < Treatment.length; j++) {
            if (Treatment[j] == that.data.TreatmentmodeValue) {
                TreatmentmodeCurrNum = j
            }
        }
        that.setData({
            TreatmentmodeNum: TreatmentmodeCurrNum,
        })
    },
    Refundreason: function() {
        that = this;
        that.setData({
            Refundreason: true,
        })


    },
    RefundreasonSelect: function(e) {
        that = this;
        that.setData({
            RefundreasonValue: that.data.Refundreasonitems[e.detail.value],
            Refundreason: false
        })
    },

    radioChange2: function(e) {
        that = this;
        that.setData({
            RefundreasonValue: e.detail.value,
            Refundreason: false
        })
    },

    Refunddescription: function(e) {
        that = this;
        that.setData({
            RefunddescriptionValue: e.detail.value
        })
    },



    // 退款金额
    refundamount: function(e) {
        this.setData({
            refundamountValue: e.detail.value
        })
    },

    chooseImage: function() {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths, 111);
                wx.uploadFile({
                    url: 'https://tws.cnweisou.com/wxapi/index.php?r=order.refund.upload_img&utoken=' + utoken + '&i=' + 450,

                    filePath: tempFilePaths[0],
                    // name: 'img',
                    name: 'file',
                    method: 'POST',
                    header: {
                        'content-type': 'multipart/form-data'
                    },
                    success: function(res) {
                      console.log(that.data)
                        console.log(res);
                        var data = JSON.parse(res.data);
                        var imgs = that.data.images;
                        var values = that.data.values;

                        imgs.push(data.result.url);
                        values.push(data.result.value)
                        if (imgs.length > 5 || values.length > 5) {
                            wx.showToast({
                                title: '最多只能选5张',
                                icon: 'success',
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
        wx.previewImage({
            urls: that.data.images
        })
    },
    delete: function(e) {
        var index = e.currentTarget.dataset.index;
        var images = that.data.images;
        images.splice(index, 1);
        that.setData({
            images: images
        })
    },
    formSubmit: function(e) {
        that = this;
        console.log(e)
        if (!that.data.TreatmentmodeValue) {
            wx.showModal({
                title: '提示',
                content: '请选择处理方式',
                showCancel: false
            })
            return;
        }
        if (!that.data.RefundreasonValue) {
            wx.showModal({
                title: '提示',
                content: '请选择退款原因',
                showCancel: false
            })
            return;
        }
        utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=order.refund.apply&utoken=' + utoken + '&id=' + that.data.order_id,
            data: {
                price: that.data.refundamountValue,
                rtype: that.data.TreatmentmodeNum,
                reason: that.data.RefundreasonValue,
                content: that.data.RefunddescriptionValue,
                imgs: that.data.ValueLists,
            },
            method: 'POST',
            success: function(res) {
                console.log(res);
                res = res.data;
                if (res.status == 1) {
                    console.log(1568978, res.status)
                    wx.showModal({
                        title: '提示',
                        content: '申请提交成功',
                        showCancel: false,
                        success() {
                            wx.redirectTo({
                                url: '../details/index?order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex + "&myIndex=" + that.data.myIndex,
                            })
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: false
                    })
                }
            }
        })
    },

    formReset: function() {

        wx.navigateBack({}) 

    },

})