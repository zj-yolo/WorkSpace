var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var arr = [];
var goodsList = [],
    level = [],
    imgGood = [],
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
        grade:1
    },
    onLoad: function(res) {
        utoken = wx.getStorageSync("utoken");
        var that = this;
        that.setData({
            orderid: res.order_id
        })
        that.loadData();

    },
    loadData: function() {
        var that = this;
        arr = [];
        goodsList = [], level = [], imgGood = [], content = [];
        // https://tws.cnweisou.com/wxapi/index.php?r=wxapp.services.comment&i=564&utoken=utoken_ebf00aae9249203a513bbc9c1eefdb3d&orderid=1061

        server.sendRequest({
            url: '?r=wxapp.services.comment',
            data: {
                utoken: utoken,
                id: that.data.orderid
            },
            method: 'GET',
            success: function(res) {

                that.setData({
                    data: res.data.result.goods,
                    //   store_name:res.data.result.store_name
                })
                // for(let x in res.data.result.goods_list){
                //   var goodsid={goodsid:res.data.result.goods_list[x].goodsid};
                //   goodsList.push(goodsid);
                //   goodsList[x]["optionid"]=res.data.result.goods_list[x].optionid;
                // }
                // for(let x in goodsList){
                //    goodsList[x]['level']=0,
                //     level[x]=0
                // }
                // that.setData({
                //   level:level
                // })
            }
        })
    },
    onShow: function() {
        var that = this;
        // var utoken = wx.getStorageSync("utoken");
        //  server.sendRequest({
        //   url: '?r=wxapp.order.comment',
        //   data: {
        //    utoken:utoken,
        //    order_id:that.data.orderid
        //   },
        //   method: 'GET',
        //   success: function(res) {
        //   }
        // })
    },

    // show:function(res){
    //   var that = this;
    //   for(let x in goodsList){
    //   if(x==res.currentTarget.dataset.index){
    //     if(!that.data.arrI)
    //     {
    //       that.setData({
    //         arrI:{
    //         [x]:1
    //         }
    //       })
    //     }
    //     else if(that.data.arrI[x]==1){
    //       that.setData({
    //         arrI:{
    //         [x]:0
    //         }
    //       })
    //     }
    //     else{
    //       that.setData({
    //         arrI:{
    //           [x]:1
    //     }
    //     })
    //       }
    //     }
    //   }
    // },
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

        let xinarr=['','好评','中评','差评'];

        var arrs = {};
        arrs.content = res.detail.value.text;
        arrs.level =xinarr[that.data.grade];
        arrs.images = arr
        arrs.goodsid=that.data.data.id;
        goodsList.push(arrs);

        // console.log(goodsList);

        // if (!that.data.xin) {
        //     wx.showToast({
        //         title: '整单评分不能为空',
        //         icon: 'loading',
        //         duration: 2000
        //     })
        //     return;
        // }
        // if (!res.detail.value.text) {
        //     wx.showToast({
        //         title: '整单评价不能为空',
        //         icon: 'loading',
        //         duration: 2000
        //     })
        //     return;
        // }
// 
// https://tws.cnweisou.com/wxapi/index.php?r=wxapp.services.comment.submit&i=564&utoken=utoken_ebf00aae9249203a513bbc9c1eefdb3d&orderid=1061
        server.sendRequest({
            url: '?r=wxapp.services.comment.submit',
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
                                imgGood[index] = Arr;
                            } else {
                                arr = Arr;
                            }
                        }
                    })
                }
                if (index) {
                    imgGood[index] = tempFilePaths;
                    that.setData({
                        imgGood: imgGood
                    })
                } else {
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
            imgGood[index].splice(e.currentTarget.dataset.index, 1);
            that.setData({
                imgGood: imgGood
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
    select(e){
        var index = e.currentTarget.dataset.index;
        this.setData({
            grade:index
        })
    }
})