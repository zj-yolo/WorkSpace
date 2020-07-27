var that;
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken"),
    _page = 1,
    commentsList = [];
Page({
    data: {
        isClick: false,
        lookPhone: '点击查看',
        comments: '',
        hasmessage: '',
        contDetail: '',
        noCommentsList: ''
    },
    onLoad: function(options) {
        that = this;
        utoken = wx.getStorageSync("utoken");
        that.setData({
            nowId: options.id
        })
        that.detailInfo(utoken, that.data.nowId)
    },
    detailInfo: function(utoken, id, page) {
        that = this;
        server.sendRequest({
            url: '?r=sad2.detail',
            data: {
                utoken: utoken,
                id: id
            },
            method: 'GET',
            success: function(res) {
                if (res.data.result) {
                    var num = res.data.result.createtime.indexOf(' ');
                    that.setData({
                        detialList: res.data.result,
                        createtime: res.data.result.createtime.substring(0, num),
                    })
                    if (res.data.result.comments.length > 0) {
                        _page = 1;
                        that.getComments(utoken, id, _page)
                    }
                }
            }
        })
    },
    clickphone: function() {
        that = this;
        var utoken = wx.getStorageSync("utoken");
        if (!that.data.isClick) {
            server.sendRequest({
                url: '?r=sad.show_mobile&utoken=' + utoken,
                data: {},
                method: 'GET',
                success: function(res) {
                    if (res.data.status == 0) {
                        that.setData({
                            phone: that.data.detialList.mobile,
                            isClick: true,
                            lookPhone: '点击拨号',
                        })
                    }

                }
            })
        } else {

            wx.makePhoneCall({
                phoneNumber: that.data.phone
            })
        }
    },
    clickLike: function() {
        server.sendRequest({
            url: '?r=sad2.like&utoken=' + utoken,
            data: {
                id: that.data.nowId
            },
            method: 'GET',
            success: function(res) {
                that.detailInfo(utoken, that.data.nowId)
            }
        })
    },
    message: function() {
        var that = this;
        that.setData({
            hasmessage: true
        })
    },
    closeMessage: function() {
        var that = this;
        that.setData({
            hasmessage: false
        })
    },

    callHoster: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定与发布人进行通话吗？',
            confirmColor: '#F35155',
            success: function(res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: that.data.detialList.mobile
                    })
                } else if (res.cancel) {}
            }
        })
    },
    sendMessage: function(utoken, id, content, page) {
        that = this;
        server.sendRequest({
            url: '?r=sad2.comment',
            data: {
                utoken: utoken,
                id: id,
                content: content
            },
            method: 'GET',
            success: function(res) {
                that.detailInfo(utoken, id)
                that.getComments(utoken, id, page)
            }
        })
    },
    formMessage: function(e) {
        var that = this;
        that.setData({
            contDetail: e.detail.value['cont']
        })
        if (that.data.contDetail) {
            _page = 1;
            that.sendMessage(utoken, that.data.nowId, that.data.contDetail)
            that.setData({
                contDetail: ''
            })
        } else {
            wx.showToast({
                title: '内容不能为空',
                image: 'https://tws.cnweisou.com/images/eidtNo.png',
                duration: 2000
            })
        }
    },
    clickSumbit: function() {},
    bindscrolltolower: function() {
        var that = this;
        if (that.data.detialList.comments.length > 0) {
            if (!that.data.noCommentsList) {
                _page++;
                that.getComments(utoken, that.data.nowId, _page);
            } else {
                wx.showToast({
                    title: '没有更多评论喔',
                    image: 'https://tws.cnweisou.com/images/eidtNo.png',
                    duration: 500
                })
            }
        }
    },
    getComments: function(utoken, id, page) {
        that = this;
        server.sendRequest({
            url: '?r=sad2.get_comments',
            data: {
                utoken: utoken,
                id: id,
                page: page
            },
            method: 'GET',
            success: function(res) {
                if (res.data.result.length > 0) {
                    var timeNum;
                    for (var i in res.data.result) {
                        timeNum = res.data.result[i].createtime.indexOf(' ');
                        res.data.result[i].createtime = res.data.result[i].createtime.substring(0, timeNum)
                    }
                    if (_page == 1) {
                        commentsList = [];
                        commentsList = res.data.result.reverse();
                    } else {
                        commentsList.concat(res.data.result.reverse())
                    }

                    that.setData({
                        commentsAll: commentsList,
                        noCommentsList: false
                    })

                } else {
                    _page--;
                    that.setData({
                        noCommentsList: true
                    })
                    wx.showToast({
                        title: '没有更多评论喔',
                        image: 'https://tws.cnweisou.com/images/eidtNo.png',
                        duration: 1000
                    })
                }
            }
        })
    },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
    previewImg: function(e) {
        var that = this;
        wx.previewImage({
            current: e.currentTarget.dataset.url,
            urls: that.data.detialList.imgs
        })
    }
})