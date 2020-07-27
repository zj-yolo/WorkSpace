var that = '';
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({

    data: {
        showType: false,
    },
    onLoad: function(options) {
        that = this;


        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=sad.detail&utoken=' + utoken + '&id=' + options.id,
            data: {},
            method: 'GET',
            success: function(res) {
                that.setData({
                    detialList: res.data.result,
                })
                if (that.data.detialList.status) {
                    if (that.data.detialList.status == 1) {
                        that.setData({
                            isFinish: '消息待完成',
                        })
                    } else {
                        that.setData({
                            isFinish: '消息已完成',
                        })

                    }
                }
                var reg = /^(\d{3})\d{4}(\d{4})$/;
                var phoneHide = that.data.detialList.mobile.replace(reg, "$1****$2");
                that.setData({
                    phone: phoneHide
                })
            }
        })

        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=sad.get_type&utoken=' + utoken,
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
    clickphone: function() {
        that = this;
        that.setData({
            phone: that.data.phone
        })
    },

    clickEnd: function() {
        that = this;
        var utoken = wx.getStorageSync("utoken");
        // 完成

        if (that.data.detialList.status == 1) {
            wx.showModal({
                title: '提示',
                content: '您确定结束此消息么',
                success: function(res) {
                    if (res.confirm) {
                        server.sendRequest({
                            url: '?r=sad.finish&utoken=' + utoken + '&id=' + that.data.detialList.id,
                            method: 'GET',
                            success: function(res) {
                                wx.redirectTo({
                                    url: '../myexhibit/myexhibit?issd=' + '22222' + '&sub=' + that.data.detialList.type,
                                })
                            }
                        })
                    } else if (res.cancel) {

                    }
                }
            })

        } else {

        }
    },


    returnIndex: function() {
        var that = this;
        that.setData({
            cardAgain: false,
        })
    },
    returnIndexf: function() {
        var that = this;
        that.setData({
            cardf: false,
        })
    },
    chooseType: function(e) {

        var currIndex = e.currentTarget.dataset.index;

        that.setData({
            showType: false,
            currtype: that.data.listType[currIndex]

        })
    },

    modifyName: function() {
        that = this;
        if (!that.data.fname) {
            that.setData({
                fname: true
            })
        } else {
            that.setData({
                fname: false
            })
        }
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

    modifyPhone: function() {
        that = this;
        if (!that.data.fphone) {
            that.setData({
                fphone: true
            })
        } else {
            that.setData({
                fphone: false
            })
        }
    },
    phone: function(e) {
        that = this;
        var myphone = e.detail.value;
        if ((/^1(3|4|5|7|8)\d{9}$/.test(myphone))) {
            that.setData({
                myphone: myphone,
            })
        } else {
            that.setData({
                myphone: '',
                cardAgain: true
            })

        }
    },
    modifyType: function() {
        that = this;

        if (!that.data.ftype) {
            that.setData({
                ftype: true
            })
        } else {
            that.setData({
                ftype: false
            })
        }
    },

    type: function(e) {
        that = this;
        that.setData({
            showType: true,
            listType: that.data.typeList

        })

    },

    modifyCont: function() {
        that = this;
        if (!that.data.fcont) {
            that.setData({
                fcont: true
            })
        } else {
            that.setData({
                fcont: false
            })
        }
    },

    cont: function(e) {
        that = this;
        var cont = e.detail.value;
        that.setData({
            cont: cont,
        })

    },


    clickmodify: function() {
        that = this;

        if (that.data.pname) {
            that.setData({
                name: that.data.pname
            })
        } else {
            that.setData({
                name: that.data.detialList.name
            })
        }
        if (that.data.myphone) {
            that.setData({
                nowphone: that.data.myphone
            })
        } else {
            that.setData({
                nowphone: that.data.detialList.mobile
            })
        }

        if (that.data.currtype) {
            that.setData({
                nowtype: that.data.currtype
            })
        } else {
            that.setData({
                nowtype: that.data.detialList.desc
            })
        }

        if (that.data.cont) {
            that.setData({
                nowcont: that.data.cont
            })
        } else {
            that.setData({
                nowcont: that.data.detialList.content
            })
        }
        if (!that.data.pname && !that.data.myphone && !that.data.currtype && !that.data.cont) {
            that.setData({
                cardf: true
            })
        } else {

            wx.showModal({
                title: '提示',
                content: '您确定修改该消息吗？',
                success: function(res) {
                    if (res.confirm) {
                        var utoken = wx.getStorageSync("utoken");
                        server.sendRequest({
                            url: '?r=sad.edit&utoken=' + utoken + '&id=' + that.data.detialList.id,
                            data: {
                                desc: that.data.nowtype,
                                content: that.data.nowcont,
                                name: that.data.name,
                                mobile: that.data.nowphone,
                            },
                            method: 'POST',
                            success: function(res) {
                                wx.redirectTo({
                                    url: '../myexhibit/myexhibit?issd=' + '22222' + '&sub=' + that.data.detialList.type,
                                })
                            }
                        })

                    } else if (res.cancel) {
                        that.setData({
                            pname: '',
                            phone: '',
                            currtype: '',
                            cont: '',
                        })
                    }
                }
            })
        }
    }
})