const AV = '';
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var maxTime = 60;
var interval = null;
var currentTime = -1;
var curr2Index = 0;

Page({
    data: {
        loading: true,
        login: false,
        time: '获取验证码',
        is_openmerch: '',
        merchid: '',
        utoken: "",
        order_0: '',
        order_1: '',
        order_2: '',
        balance: '',
        integral: '',
        membercard: '',
        memberLevel: '',
        level1: '普通会员',
        cardsn: '',
        customerserver: '',
        myPhone: '',
        newStyle: false,
        userInfo: '',
        smallshopname: '',
        isGrogShop: false,
        templeid: 0,
        is_mianyi: 0
    },
    isPhone: function () {
        var that = this;
        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=ewei_hotel.member.is_auth',
            data: {
                utoken: utoken
            },
            method: 'GET',
            success: function (res) {
                if (res.data.result.mobile) {
                    that.setData({
                        myPhone: res.data.result.mobile
                    })
                } else {
                    that.setData({
                        myPhone: ''
                    })
                }
            }
        })
    },
    loginb: function () {
        server.getUserInfo(function () {});
    },
    getPhoneNumber: function (e) {
        var that = this;
        utoken = wx.getStorageSync("utoken");
        var resultMsg = e.detail.errMsg;
        var storageMsg = e.detail.encryptedData;
        var selfiv = e.detail.iv;
        if (resultMsg.indexOf('getPhoneNumber:fail') > -1) {
            that.setData({
                myPhone: ''
            })
            wx.showToast({
                title: '已拒绝获取手机号',
                image: '/images/eidtNo.png',
                duration: 1500
            })
        } else {
            server.sendRequest({
                url: '?r=ewei_hotel.member.auth_mobile',
                data: {
                    utoken: utoken,
                    encryptedData: storageMsg,
                    iv: selfiv
                },
                method: "POST",
                success: function (res) {
                    if (res.data.status != 1) {
                        wx.showToast({
                            title: '授权失败',
                            image: '../../../images/eidtNo.png',
                            duration: 2000
                        })
                        return false;
                    } else {
                        server.sendRequest({
                            url: '?r=ewei_hotel.member.is_auth',
                            data: {
                                utoken: utoken
                            },
                            method: 'GET',
                            success: function (res) {
                                if (res.data.result) {
                                    if (res.data.result.mobile) {
                                        that.setData({
                                            myPhone: res.data.result.mobile
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    },

    onLoad: function (options) {
        let that = this;
        server.getUserInfo(function () {});
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight,
                })
            }
        })

        this.setData({
            is_mianyi: wx.getStorageSync('is_mianyi'),
            templeid: wx.getStorageSync('templeid')
        })
    },
    loginbtn: function () {
        wx.navigateTo({
            url: '../registered/index',
        })
    },
    stroebtn: function () {
        wx.navigateTo({
            url: '/pages/goods/shop/shop?id=' + this.data.merchid,
        })
    },
    navigateTogroup: function () {
        wx.navigateTo({
            url: '/pages/bottom/groupbuy/index'
        })
    },
    onShow: function () {
        let login = server.globalData.login;
        let that = this;
        that.setData({
            login: login,
        });
        if (server.globalData.userInfo) {
            that.setData({
                userInfo: server.globalData.userInfo
            })
        }
        if (wx.getStorageSync('userInfo') != 'undefined' && wx.getStorageSync('userInfo') != '') {
            if (typeof wx.getStorageSync('userInfo') == 'string') {
                that.setData({
                    userInfo: JSON.parse(wx.getStorageSync('userInfo'))
                })
            } else {
                that.setData({
                    userInfo: wx.getStorageSync('userInfo')
                })
            }
        }
        if (utoken != undefined || utoken) {
            utoken = wx.getStorageSync("utoken");
            that.getMemberAll();
        }
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        that.getMemberAll();
        wx.stopPullDownRefresh()
    },
    getMemberAll: function () {
        var that = this;
        utoken = wx.getStorageSync("utoken");
        // 预约服务
        if (wx.getStorageSync('templeid') == '12') {
            server.sendRequest({
                url: '?r=wxapp.services.order.get_order_list_total',
                method: 'GET',
                data: {
                    isfiveg: 1,
                    utoken: utoken
                },
                showToast: false,
                success: function (res) {
                    that.setData({
                        order_0: res.data.result.order0,
                        order_1: res.data.result.order1,
                        order_2: res.data.result.order3,
                        order_4: res.data.result.order4,
                    });
                }
            })
            server.sendRequest({
                url: '?r=member.tool&utoken=' + utoken,
                method: 'GET',
                showToast: false,
                success: function (res) {
                    that.setData({
                        toolList: res.data.result
                    })
                    if (res.data.result.mobile == 1) {
                        that.isPhone();
                    }
                }
            })
        } else {
            server.sendRequest({
                url: '?r=wxapp.member',
                method: 'GET',
                data: {
                    isfiveg: 1,
                    utoken: utoken
                },
                showToast: false,
                success: function (res) {
                    let isGrogShop = res.data.result.fivgType == 29 ? true : false;
                    that.setData({
                        isGrogShop,
                    })
                    if (!res.data.result.member_page) {
                        if (res.data.result.cardsn) {
                            var cardsn = res.data.result.cardsn;
                        } else {
                            var cardsn = null;
                        }
                        let shopname;
                        if (res.data.result.shop.shopname) {
                            shopname = res.data.result.shop.shopname
                        }
                        that.setData({
                            index: true,
                            is_openmerch: res.data.result.is_openmerch,
                            merchid: res.data.result.merchid,
                            order_0: res.data.result.order_0,
                            order_1: res.data.result.order_1,
                            order_2: res.data.result.order_2,
                            order_4: res.data.result.order_4,
                            balance: res.data.result.credit2,
                            integral: res.data.result.credit1,
                            membercard: res.data.result.credit3,
                            smallshopname: shopname,
                            // orderCenter:res.data.result.orderCenter,
                            cardsn,
                            newStyle: false
                        });
                        if (res.data.result && res.data.result.wxapp_sign) {
                            that.setData({
                                wxapp_sign: res.data.result.wxapp_sign
                            })
                        }
                        if (that.data.cardsn == null) {
                            that.setData({
                                memberLevel: that.data.level1
                            })
                            if (wx.getStorageSync('customerserver')) {
                                that.setData({
                                    customerserver: wx.getStorageSync('customerserver')
                                })
                            }
                        } else {
                            that.setData({
                                memberLevel: res.data.result.cardset.title
                            })
                        }
                    } else if (res.data.result.member_page == 2) {
                        if (res.data.result.cardsn) {
                            var cardsn = res.data.result.cardsn;
                        } else {
                            var cardsn = null;
                        }
                        that.setData({
                            newStyle: true,
                            is_openmerch: res.data.result.is_openmerch,
                            merchid: res.data.result.merchid,
                            order_0: res.data.result.order_0,
                            order_1: res.data.result.order_1,
                            order_2: res.data.result.order_2,
                            order_4: res.data.result.order_4,
                            balance: res.data.result.credit2,
                            integral: res.data.result.credit1,
                            membercard: res.data.result.credit3,
                            smallshopname: res.data.result.shop.shopname,
                            cardsn,
                        })
                    } else {
                        that.setData({
                            index: false
                        })
                        that.getMemberInfo();
                    }
                    if (res.data.status == 1) {
                        that.setData({
                            loading: false
                        })
                    }
                }
            })
            server.sendRequest({
                url: '?r=member.tool&utoken=' + utoken,
                method: 'GET',
                showToast: false,
                success: function (res) {
                    that.setData({
                        toolList: res.data.result
                    })
                    if (res.data.result.mobile == 1) {
                        that.isPhone();
                    }
                }
            })
        }

    },

    navigateToCoupon: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/coupon/myCoupon/myCoupon'
        });
    },
    yu_list: function () {
        wx.navigateTo({
            url: '/packageA/pages/services/list/index?status=-2'
        });
    },
    navigateToEvaluate: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/evaluate/evaluate'
        });
    },
    navigateToPoint: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/point/point'
        });
    },
    navigateToCollect: function () {
        if (!this.data.userInfo.avatar) {
            this.loginb();
            return
        }

        wx.navigateTo({
            url: '../collect/collect'
        });
    },
    navigateToEvaluate: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/evaluate/evaluate'
        });
    },
    joinIntegral: function () {
        swan.navigateTo({
            url: '/packMember/pages/member/integral/home/index'
        });
    },
    navigateToMoney: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/money/money'
        });
    },
    navigateToList: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/jump/jump'
        });
    },
    navigateRegister: function () {
        wx.navigateTo({
            url: '/pages/bottom/commission/index'
        });
    },
    navigateToOrder: function (e) {
        if (!this.data.userInfo.avatar) {
            this.loginb();
            return
        }
        var id = e.currentTarget.id;

        if (this.data.templeid == '12') {
            let status;

            if (id == 0) {
                status = 0
            } else if (id == 1) {
                status = 1
            } else if (id == 3) {
                status = 3
            }

            wx.navigateTo({
                url: '/packageA/pages/services/list/index?status=' + status
            });
        } else {
            wx.navigateTo({
                url: '/pages/order/list/list?id=' + id + '&currid=' + id
            });
        }

    },
    navigateTogroupbuy: function (e) {
        wx.navigateTo({
            url: '/packMember/pages/member/allTool/groupbuy/index?id=0'
        });
    },
    navigateToOrderMore: function (e) {
        if (!this.data.userInfo.avatar) {
            this.loginb();
            return
        }
        wx.navigateTo({
            url: '/pages/order/list/list?id=-1'
        });
    },
    navigateToAddress: function () {
        if (!this.data.userInfo.avatar) {
            this.loginb();
            return
        }
        wx.navigateTo({
            url: '/pages/address/list/list'
        });
    },
    logout: function () {
        server.globalData.login = false;
        server.globalData.userInfo = null;
        wx.request({
            url: 'https://wudhl.com/index.php/Api/User/logoutWX/openid/' + server.globalData.openid,
            data: {},
            method: 'GET',
            success: function (res) {
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '注销成功',
                        icon: 'success',
                    });
                    timeout = setTimeout(function doHandler() {
                        wx.switchTab({
                            url: '/pages/index/index'
                        });
                    }, 2000);
                }
            }
        })
    },

    joinAllTool: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/allTool/allTool',
        })
    },
    navigateToAddressAboutus: function () {
        wx.navigateTo({
            url: '../aboutus/aboutus'
        });
    },
    turnTologin: function (e) {
        this.setData({
            ifLogup: false
        });
        this.data.email = '';
        this.data.name = '';
        this.data.password = '';
        this.data.passwordSure = '';
    },
    turnTologup: function (e) {
        this.setData({
            ifphone: false,
            ifLogup: true,
            num: '',
        });
        this.data.name = '';
        this.data.email = '';
        this.data.phoneNum = '';
        this.data.password = '';
    },
    turnto_phone: function (e) {
        this.setData({
            ifphone: true,
        })
    },
    tap_logups(e) {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    tap_logup(e) {
        if (this.data.email == "") {
            wx.showToast({
                title: "请输入您的邮箱",
                duration: 1200,
                icon: "loading",
            });
        } else if (this.data.email.slice(-4) != ".com" || this.data.email.indexOf('@') < 0) {
            wx.showToast({
                title: "您输入的邮箱不合法",
                duration: 1200,
                icon: "loading"
            });
            this.setData({
                warn: {
                    warn_email: "color:rgb(241,1,25);",
                },
            });
        } else if (this.data.password == "") {
            wx.showToast({
                title: "请设置登陆密码",
                duration: 1200,
                icon: "loading",
            })
        } else if (this.data.password == this.data.passwordSure) {
            //将inform上传至数据库
            var user = new AV.User();
            var that = this;
            user.setUsername(this.data.name);
            user.setEmail(this.data.email);
            user.setPassword(this.data.password);
            user.signUp().then(function (loginedUser) {
                server.iflogup = true;
                wx.showToast({
                    title: '',
                    icon: 'loading'
                });
                wx.redirectTo({
                    url: '/packMember/pages/member/main/main?usrid=' + loginedUser.id
                })
            }, function (error) {
                switch (error.code) {
                    case 203:
                        wx.showToast({
                            title: "您已注册过，请登录",
                            icon: "loading",
                        });
                        that.turnTologin();
                        break;
                    case 202:
                        wx.showToast({
                            title: "此用户名已被注册",
                            icon: "loading",
                        });
                        that.setData({
                            warn: {
                                warn_name: "color:rgb(241,1,25);",
                            },
                        });
                        break;
                    case 214:
                        wx.showToast({
                            title: "您的手机已注册过请登录",
                            icon: "loading",
                        });
                        break;
                };
            });
        } else {
            wx.showToast({
                title: "两次输入的密码不一致",
                duration: 1200,
                icon: "loading",
            });
            this.setData({
                warn: {
                    warn_passwordSure: "color:rgb(241,1,25);",
                },
            });
        }
    },
    tap_login: function () {
        var user_login = new AV.User();
        var that = this;
        if (this.data.name == '') {
            wx.showToast({
                title: "请输入注册邮箱",
                duration: 1500,
                icon: "loading"
            });
        } else if (this.data.password == '') {
            wx.showToast({
                title: "请输入密码",
                duration: 1500,
                icon: "loading"
            })
        } else {
            user_login.setUsername(this.data.name);
            user_login.setPassword(this.data.password);
            user_login.logIn().then(
                function (loginedUser) {
                    wx.showToast({
                        title: '',
                        icon: 'loading'
                    });
                    var userid = loginedUser.id;
                    //匹配成功后跳转界面
                    wx.redirectTo({
                        url: '/packMember/pages/member/main/main?usrid=' + userid,
                    })
                },
                function (error) {
                    if (error.code == '210') {
                        wx.showToast({
                            title: "密码错误",
                            duration: 1500,
                            icon: "loading",
                        });
                        that.setData({
                            warn: {
                                warn_passwordSure: "color:rgb(241,1,25);",
                            },
                        });
                    } else if (error.code == '211') {
                        wx.showToast({
                            title: "该邮箱还未注册，请先注册",
                            duration: 2200,
                            icon: "loading"
                        });
                        that.setData({
                            warn: {
                                warn_name: "color:rgb(241,1,25);",
                            },
                            ifLogup: true,
                        })
                    } else if (error.code == '216') {
                        wx.showToast({
                            icon: "loading",
                            title: "请先验证邮箱",
                            duration: 2000,
                        });
                        //往邮箱中发送验证邮件
                        AV.User.requestEmailVerify(that.data.email).then(
                            function (result) {},
                            function (error) {
                                if (error.code == '1') {
                                    wx.showToast({
                                        title: "今日往此邮箱发送的邮件数已超上限",
                                        duration: 2000,
                                        icon: "loading"
                                    });
                                }
                            });
                    } else if (error.code == '219') {
                        that.setData({
                            warn: {
                                warn_passwordSure: "color:rgb(241,1,25);",
                            },
                        });
                        wx.showToast({
                            title: "登录失败次数超过限制，请稍候再试，或通过忘记密码重设密码",
                            duration: 4000,
                            icon: "loading",
                        });
                    }
                })
        }
    },
    getnum: function (e) {
        var that = this;
        if (parseInt(that.data.phoneNum).toString().length == 11) {
            that.reSendPhoneNum();
            return;
            wx.request({
                url: 'https://wudhl.com/index.php/Api/Shipper/getCaptcha.html',
                data: {
                    phone: that.data.phoneNum
                },
                method: 'POST',
                success: function (res) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                    });
                }
            })
        } else {
            wx.showToast({
                title: "请输入正确的手机号",
                icon: "loading"
            })
        }
    },
    inputNum: function (e) {
        this.data.num = e.detail.value;
    },
    quick_reguster_phone: function (e) {
        wx.navigateTo({
            url: '/pages/register/index'
        });
    },
    //短信验证码验证
    quick_login_phone: function (e) {
        var that = this;
        if (parseInt(this.data.num).toString().length == 4) {
            wx.request({
                url: 'https://wudhl.com/index.php/Api/User/validate?phone=' + this.data.phoneNum + "&num=" + this.data.num + "&openid=" + server.globalData.openid,
                data: {
                    'phone': this.data.phoneNum,
                    'num': this.data.num
                },
                method: 'GET',
                success: function (res) {
                    if (res.data.code == 200) {
                        server.globalData.login = true;
                        server.globalData.userInfo = res.data.res;
                        that.setData({
                            login: true
                        });
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                        });
                        timeout = setTimeout(function doHandler() {
                            wx.switchTab({
                                url: '/pages/index/index'
                            });
                        }, 2000);
                    } else
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'error',
                        });
                }
            })
        } else {
            wx.showToast({
                title: "无效的验证码",
                duration: 1500,
                icon: "loading"
            })
        }
    },
    getPassword: function (e) {
        this.setData({
            password: e.detail.value,
            warn: {
                warn_passwordSure: '',
            }
        })
        this.data.password = e.detail.value;
    },
    getEmail: function (e) {
        this.data.email = e.detail.value;
        this.data.name = e.detail.value;
        this.setData({
            warn: {
                warn_email: "",
            },
        });
    },
    passwordSure: function (e) {
        if (e.detail.value === this.data.password)
            this.data.passwordSure = e.detail.value;
        this.setData({
            warn: {
                warn_passwordSure: "",
            },
        });
    },
    getPhoneNum: function (e) {
        this.setData({
            phoneNum: e.detail.value,
        });
    },
    input_num: function (e) {
        this.data.num = e.detail.value;
    },
    //重置密码";
    forgetPassword: function (e) {
        var that = this;
        AV.User.requestPasswordReset(this.data.email).then(
            function (success) {
                wx.showToast({
                    title: '密码重置邮件已发送，请在邮件中重置密码',
                    icon: 'success',
                    duration: 5000,
                });
            },
            function (error) {
                if (error.code == '1') {
                    wx.showToast({
                        title: "今日往此邮箱发送的邮件数已超上限",
                        duration: 2000,
                        icon: "loading",
                    });
                } else if (error.code == '204') {
                    wx.showToast({
                        title: "请先输入注册邮箱",
                        duration: 1200,
                        icon: "loading",
                    });
                } else if (error.code == '205') {
                    wx.showToast({
                        title: "您还没注册哦",
                        duration: 1200,
                        icon: "loading",
                    });
                }
            });
    },
    reSendPhoneNum: function () {
        if (currentTime < 0) {
            var that = this
            currentTime = maxTime
            interval = setInterval(function () {
                currentTime--
                that.setData({
                    time: currentTime + "s"
                })

                if (currentTime <= 0) {
                    currentTime = -1
                    clearInterval(interval)
                    that.setData({
                        time: '获取验证码'
                    })
                }
            }, 1000)
        } else {
            wx.showToast({
                title: '短信已发到您的手机，请稍后重试!',
                icon: 'loading',
                duration: 700
            })
        }
    },
    // 进入退货款
    refundGoods: function () {
        if (this.data.templeid == '12') {
            let status = -1;
            wx.navigateTo({
                url: '/packageA/pages/services/list/index?status=' + status
            });
        } else {
            wx.navigateTo({
                url: '/pages/order/refundGoods/refundGoods',
            })
        }

    },
    // 进入会员卡中心
    joinMemberCar: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/activeCard/activeCard',
        })
    },
    joinMemberShip: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/membership/index',
        })
    },
    joinbalanceDetail: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/activeCard/integralSum/integralSum?creditType=' + 'credit2',
        })
    },

    joinintegralDetail: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/activeCard/integralSum/integralSum?creditType=' + 'credit1',
        })
    },
    // 进入关于我们
    joinUs: function () {
        wx.navigateTo({
            url: '/pages/member/aboutus/aboutus',
        })
    },
    // 进入积分商城
    joinIntegral: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/integral/home/index',
        })
    },
    // 进入VIP开卡
    joinVIPCard: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/membership/index',
        })
    },
    // 进入签到
    joinSign: function () {
        server.getUserInfo(function () {
            wx.navigateTo({
                url: '/packMember/pages/member/sign/sign',
            })
        });
    },

    joingroundShopDetail: function () {
        wx.navigateTo({
            url: '/packageA/pages/groupbuy/groupList/index',

        })

    },

    // 进入发起活动
    joinCreateActivity: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/groupActivity/groupActivity',
        })
    },
    // 进入我的活动
    joinMyActivity: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/groupActivity/channel/channel',
        })
    },

    joinSad: function () {
        wx.navigateTo({
            url: '/packageA/pages/supdem/supdem',
        })
    },
    joinMysad: function () {
        wx.navigateTo({
            url: '/packageA/pages/supdem/myexhibit/myexhibit',
        })
    },
    // 进入砍价列表
    Tobargaindetail: function () {
        wx.navigateTo({
            url: '/packMember/pages/member/bargainlist/index',
        })
    },
    // 进入自定义列表
    joincustomerForm: function () {
        wx.navigateTo({
            url: '/packageA/pages/customerForm/formSuccess/formSuccess',
        })
    },

    getMemberInfo: function () {
        var that = this;
        utoken = wx.getStorageSync("utoken");
        server.sendRequest({
            url: '?r=wxapp.member&utoken=' + utoken,
            method: 'GET',
            success: function (res) {
                that.setData({
                    memberInfo: res.data.result
                })
                if (res.data.result.cardsn == null) {
                    that.setData({
                        memberLevel: that.data.level1
                    })
                } else {
                    that.setData({
                        memberLevel: res.data.result.cardset.title
                    })
                }

                that.data.memberInfo.memberLevel = that.data.memberLevel
                that.setData({
                    memberInfo: that.data.memberInfo
                })
                var orderList = [
                    that.data.memberInfo.order_0,
                    that.data.memberInfo.order_1,
                    that.data.memberInfo.order_2,
                    that.data.memberInfo.order_2,
                    that.data.memberInfo.order_4,
                ];

                for (var i in res.data.result.member_page.data.items) {
                    if (res.data.result.member_page.data.items[i].id == "icongroup") {
                        var curr1Index = 0;
                        for (var y in res.data.result.member_page.data.items[i].data) {
                            res.data.result.member_page.data.items[i].data[y].currOrder = orderList[curr1Index]
                            curr1Index++;
                        }
                        that.data.memberInfo.member_page.data.items[i] = res.data.result.member_page.data.items[i]
                        that.setData({
                            memberInfo: that.data.memberInfo
                        })
                    }
                }
                for (var a in res.data.result.member_page.data.items) {
                    if (res.data.result.member_page.data.items[a].id == "listmenu") {
                        for (var b in res.data.result.member_page.data.items[a].data) {
                            res.data.result.member_page.data.items[a].data[b].textcolor = res.data.result.member_page.data.items[a].style.textcolor,
                                res.data.result.member_page.data.items[a].data[b].remarkcolor = res.data.result.member_page.data.items[a].style.remarkcolor,
                                curr2Index++;
                        }
                        that.data.memberInfo.member_page.data.items[a] = res.data.result.member_page.data.items[a]
                        that.setData({
                            memberInfo: that.data.memberInfo
                        })
                    }
                }


            }

        })

    },
    joinGoods(e) {
        if (e.detail.query.objectId != null) {
            wx.navigateTo({
                url: '/pages/goods/detail/detail?objectId=' + e.detail.query.objectId
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }

    },
    getToPage: function (event) {
        if (typeof event.currentTarget.dataset.text != 'undefined') {
            switch (event.currentTarget.dataset.link) {
                case '/pages/order/list/list?status=0':
                    wx.navigateTo({
                        url: '/pages/order/list/list?id=' + 1 + '&currid=' + 1
                    });
                    break;
                case '/pages/order/list/list?status=1':
                    wx.navigateTo({
                        url: '/pages/order/list/list?id=' + 2 + '&currid=' + 2
                    });
                    break;
                case '/pages/order/list/list?status=2':
                    wx.navigateTo({
                        url: '/pages/order/list/list?id=' + 3 + '&currid=' + 3
                    });
                    break;
                case '/pages/order/refundGoods/refundGoods':
                    wx.navigateTo({
                        url: '/pages/order/refundGoods/refundGoods',
                    })
                    break;
            }
        } else {
            if (event.currentTarget.dataset.link == '/pages/order/list/list') {
                wx.navigateTo({
                    url: '/pages/order/list/list?id=' + 0 + '&currid=' + 0
                });
            } else {
                server.getToPage(event);
            }
        }

    },
    // 前往自制客服
    // toChat() {
    //   if (!this.data.userInfo.avatar) {
    //     this.loginb();
    //     return
    //   }

    //   let {
    //     uniacid
    //   } = wx.getExtConfigSync();
    //   if (this.data.myshop) {
    //     if (!wx.getStorageSync('userInfo')) {
    //       wx.navigateTo({
    //         url: '/pages/getAuth/index'
    //       })
    //     } else {
    //       // myshop     店铺id
    //       // logo_shop  店铺logo
    //       wx.navigateTo({
    //         url: '/pages/chat/index?storeid=' + uniacid + '&logo=' + this.data.logo_shop + '&name=' + this.data.smallshopname
    //       })
    //     }

    //   } else {
    //     wx.navigateTo({
    //       url: '/pages/chat/index?storeid=' + uniacid + '&logo=' + this.data.logo_shop + '&name=' + this.data.smallshopname
    //     })
    //   }


    // },

    intozcpage: function () {
        wx.navigateTo({
            url: '/packageA/pages/CrowdFunding/orderList/index',
        })
    },
    handleDeliver() {
        if (!this.data.userInfo.avatar) {
            this.loginb();
            return
        }
        wx.navigateTo({
            url: '/packageA/pages/commission/index/index'
        })
    },
    navigateToWallet: function () {
        if (!this.data.userInfo.avatar) {
            this.loginb();
            return
        }

        wx.navigateTo({
            url: '/packageA/pages/commission/wallet/index'
        });
    },

})