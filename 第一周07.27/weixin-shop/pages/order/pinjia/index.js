var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var arr = [];
var goodsList = [],
    level = [],
    imgGood = [],
    img_arr = [],
    content = [];
Page({
    data: {
        show: 1,
        images: [],
        imgGood: [],
        xin: 0,
        text: '',
        level: [],
        animationData: {},
        evaluteType:1
    },
    onLoad: function(options) {
        utoken = wx.getStorageSync("utoken");
        var that = this;
        console.log(options)
        if (options.evaluteType){
          var evaluteType = options.evaluteType;
        }else{
          var evaluteType = 1;
        }
        that.setData({
            orderid: options.order_id,
            evaluteType
        })
        ;
        that.loadData();

    },
    loadData: function() {
        var that = this;
        arr = [];
        goodsList = [], level = [], imgGood = [], content = [];
        server.sendRequest({
            url: '?r=wxapp.order.detail',
            data: {
                utoken: utoken,
                id: that.data.orderid
            },
            method: 'GET',
            success: function(res) {
                that.setData({
                    data: res.data.result.goods_list,
                    store_name: res.data.result.store_name
                })
                for (let x in res.data.result.goods_list) {
                    var goodsid = { goodsid: res.data.result.goods_list[x].goodsid };
                    goodsList.push(goodsid);
                    goodsList[x]["optionid"] = res.data.result.goods_list[x].optionid;
                }
                for (let x in goodsList) {
                    goodsList[x]['level'] = 0,
                        level[x] = 0
                }
                that.setData({
                    level: level
                })
            }
        })
    },
    onShow: function() {
        // var that = this;
        // var utoken = wx.getStorageSync("utoken");
        // server.sendRequest({
        //     url: '?r=wxapp.order.comment',
        //     data: {
        //         utoken: utoken,
        //         order_id: that.data.orderid
        //     },
        //     method: 'GET',
        //     success: function(res) {
        //         console.log(res);
        //     }
        // })
    },

    show: function(res) {
        var that = this;
        for (let x in goodsList) {
            if (x == res.currentTarget.dataset.index) {
                if (!that.data.arrI) {
                    that.setData({
                        arrI: {
                            [x]: 1
                        }
                    })
                } else if (that.data.arrI[x] == 1) {
                    that.setData({
                        arrI: {
                            [x]: 0
                        }
                    })
                } else {
                    that.setData({
                        arrI: {
                            [x]: 1
                        }
                    })
                }
            }
        }
    },
    bindFormSubmit: function(res) {
        var that = this;
        var contents = [];
        for (var x in res.detail.value) {
            if (x == "text") {
                break;
            } else {
                contents.push(res.detail.value[x]);
            }
        }
        var arrs = {};
        arrs.content = res.detail.value.text;
        arrs.level = that.data.xin;
        arrs.images = arr
        for (var x in level) {
            if (level[x] != '') {
                for (var x in goodsList) {
                    if (level) {
                        if (level[x]) {
                            goodsList[x].level = level[x];
                            console.log(111);
                        } else {
                            if (arrs.level != '') {
                                console.log(222);
                                goodsList[x].level = arrs.level;
                            } else {
                                console.log(333);
                                wx.showToast({
                                    title: '商品评价不能为空111',
                                    icon: 'loading',
                                    duration: 2000
                                })
                                return;
                            }
                        }
                    } else {
                        goodsList[x].level = 0
                    }

                    if (imgGood) {
                        if (imgGood[x]) {
                            goodsList[x].images = imgGood[x];
                        } else {
                            if (arrs.images != '') {
                                goodsList[x].images = arrs.images;
                            }
                        }
                    }

                    if (contents) {
                        if (contents[x]) {
                            goodsList[x].content = contents[x]
                        } else {
                            if (arrs.content != '') {
                                goodsList[x].content = arrs.content
                            } else {
                                wx.showToast({
                                    title: '商品评价不能为空222',
                                    icon: 'loading',
                                    duration: 2000
                                })
                                return;
                            }
                        }
                    }
                }
            } else {
              if (!that.data.xin && (that.data.evaluteType == 1) ) {
                    wx.showToast({
                        title: '整单评分不能为空',
                        icon: 'loading',
                        duration: 2000
                    })
                    return;
                }
                if (!res.detail.value.text) {
                    wx.showToast({
                        title: '整单评价不能为空',
                        icon: 'loading',
                        duration: 2000
                    })
                    return;
                }
                goodsList[x].level = that.data.xin;
                goodsList[x].content = arrs.content
                if (arrs.images != '') {
                    goodsList[x].images = arrs.images;
                }
            }
        }
        server.sendRequest({
            url: '?r=wxapp.order.comment.submit',
            data: {
                utoken: utoken,
                orderid: that.data.orderid,
                comments: goodsList
            },
            method: 'POST',
            success: function(res) {
                wx.navigateBack({
                    delta: 2
                })

            }
        })

    },
    xin: function(res) {
        var that = this;
        console.log(res)
        if (res.target.id) {
            if (res.currentTarget.dataset.index == '1') {
                if (level[res.target.id] == 1) {
                    level[res.target.id] = 0
                    that.setData({
                        level: level
                    })
                } else {
                    level[res.target.id] = 1
                    that.setData({
                        level: level
                    })
                }
            } else {
                level[res.target.id] = res.currentTarget.dataset.index
                that.setData({
                    level: level
                })
            }
        } else {

            if (that.data.xin == 0) {
                if (res.currentTarget.dataset.index == '1') {
                    that.setData({
                        xin: 1
                    })
                } else {
                    that.setData({
                        xin: res.currentTarget.dataset.index
                    })
                }
            } else if (res.currentTarget.dataset.index == '1') {
                if (that.data.xin == 1) {
                    that.setData({
                        xin: 0
                    })
                } else {
                    that.setData({
                        xin: 1
                    })
                }
            } else {
                that.setData({
                    xin: res.currentTarget.dataset.index
                })
            }
        }
    },
    chooseImage: function(res) {
        var that = this;
        console.log(res)
        if (res.target.id) {
            var index = res.target.id
        }
        wx.chooseImage({
            count: 5,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) { 
                var Arr = [];
                var tempFilePaths = res.tempFilePaths;
                console.log(res)
                for (var i = 0; i < tempFilePaths.length; i++) {
                    wx.uploadFile({
                        url: 'https://tws.cnweisou.com/wxapi/index.php?r=wxapp.util.uploader&i=450',
                        filePath: tempFilePaths[i],
                        name: 'file',
                        method: 'POST',
                        header: {
                            'content-type': 'multipart/form-data'
                        },
                        success: function(res) {
                            var x = res.data;
                            var dataObj = JSON.parse(x);
                            Arr.push(dataObj.url);
                            if (index) {
                                if (!imgGood[index]) {
                                    imgGood[index] = [];
                                }
                                imgGood[index].push(dataObj.url);
                            } else {
                                arr.push(dataObj.url);
                            }
                            // console.log(dataObj.url)
                        }
                    })
                }

                if (index) {
                    if (!img_arr[index]) {
                        img_arr[index] = [];
                    }
                    for (let x in tempFilePaths) {
                        img_arr[index].push(tempFilePaths[x]);
                    }
                    that.setData({
                        img_arr: img_arr
                    })
                } else {
                    // 整单评论的本地路径
                    that.setData({
                        images: that.data.images.concat(tempFilePaths),
                    })
                }

                if (that.data.images.length > 5) {}
            },
        })


    },

    previewImage: function(res) {
        var that = this;
        if (that.data.imgGood) {
            wx.previewImage({
                urls: that.data.imgGood[res.target.id]
            })
        } else {
            wx.previewImage({
                urls: that.data.images
            })
        }

    },
    delete: function(e) {
        var that = this;
        if (e.target.id) {
            var index = e.target.id
            img_arr[index].splice(e.currentTarget.dataset.index, 1);
            imgGood[index].splice(e.currentTarget.dataset.index, 1);
            that.setData({
                imgGood: imgGood,
                img_arr: img_arr
            })
        } else {
            var index = e.currentTarget.dataset.index;
            var images = that.data.images;
            images.splice(index, 1);
            arr.splice(index, 1)
            that.setData({
                images: images,
            })
        }

    },
    goodDetail:function(res){
      console.log(res.currentTarget.dataset.goodsid);
      var goodsid = res.currentTarget.dataset.goodsid;
      wx.redirectTo({
        url: '/pages/goods/detail/detail?objectId=' + goodsid,
      });
    }
})