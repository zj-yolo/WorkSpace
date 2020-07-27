let server = require('../../../utils/server')
let utils = require('../../../utils/util.js'),
  utoken = wx.getStorageSync("utoken"),
  WxParse = require('../../../wxParse/wxParse'),
  tp, pay_points, points_rate, coupon_name,
  coupon_num, coupon_price, coupon_id, coupon_backstr, ID, couponprice, sub_couponprice, id, merchid, shangmen = 1,
  time, app = getApp(),
  carrierData = {},
  optionid, total, yuanjia;
Page({
  data: {
    loading: true,
    use_money: 0,
    use_point: 0,
    createInfo: [],
    check: ['true', ''],
    "coupon": [],
    cv: '请选择优惠劵',
    cpos: -1,
    "couponCode": '',
    Data: "",
    orderid: '',
    coupon_paper: 0,
    Height: Math.ceil(wx.getSystemInfoSync().screenHeight),
    select_coupon: 'x',
    coupon_name: '',
    coupon_num: '',
    coupon_price: '',
    coupon_id: '',
    coupon_backstr: '',
    ID: '',
    goodsPrice: "",
    couponprice: "",
    sub_couponprice: "",
    credit3: "",
    active: '1',
    checkbox: 0,
    false: false,
    array: ['8:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'],
    arrayValue: '',
    customerserver: '',
    myList: '',
    cartIds: '',
    discountvipcardprice: 0,
    logid: '',
    distributiontime: '请选择配送时间',
    date: '请选择详细时间',
    text: 'tomfriwel',
    numArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    selectedNum: 0,
    enterTime: '',
    leaveTime: '',
    timeSpace: '',
    arriveTime: '',
    username: [],
    userMobile: '',
    isGrogShop: false,
    isDisable: true,
    cneworder: '',
    cnewprice: '',
    uid: '',
    templateID:''
  },
  onLoad: function(e) {
    if (e.uid) {
      this.setData({
        uid: e.uid,
      })
    }

    let that = this;
    that.setData({
      storeIDB: e.storeid,
      templateID: wx.getStorageSync('templeid')
    })
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();

    this.setData({
      currentTime: `${year}-${month}-${day}`,
    })
    utoken = wx.getStorageSync("utoken"), id = '', optionid = '', total = '', carrierData = {}, coupon_name = '', coupon_num = '', coupon_price = '', coupon_id = '', coupon_backstr = '', ID = '', couponprice = '', time = '';
    if (typeof e.logid != 'undefined') {
      that.setData({
        logid: e.logid
      })
    }
    e.myList == "myList" ? that.setData({
      myList: true
    }) : '';
    wx.getStorageSync('customerserver') ? that.setData({
      customerserver: wx.getStorageSync('customerserver')
    }) : '';
    // 从商品详情传来的数据
    if (e.id || e.optionid && e.total) {
      id = e.id, optionid = e.optionid, total = e.total;
    };
    e.cartIds ? that.setData({
      cartIds: e.cartIds
    }) : '';

    e.id ? that.setData({
      id: e.id
    }) : '';
    e.id && e.mid ? that.setData({
      mid: e.mid,
      bargainid: e.id
    }) : '';
    e.bargaintype ? that.setData({
      bargaintype: e.bargaintype
    }) : '';
    that.setData({
      bargainOptionid: e.bargainOptionid ? e.bargainOptionid : ''
    });
    if (e.time && e.cartIds) {
      time = e.time;
      tp = parseFloat(e.amount) * parseFloat(e.price);
      that.getCoupons();
      that.setData({
        active: 2,

        totalPrice: {
          total_fee: tp
        },
        Data: {
          amount: e.amount,
          cartIds: e.cartIds,
          time: e.time,
          title: e.title,
          price: e.price,
          img: e.img,
          tabindex: 1,
          store: e.store,
          optionid: e.optionid,
          name_arr: e.name_arr
        },
        totalPrice: {
          realprice: e.price
        }
      })
      if (app.globalData.store) {
        that.setData({
          storeid: app.globalData.store.id,
          carrierData: app.globalData.store
        })
      } else {
        that.setData({
          active: 1
        })
        that.timeloadingdata();
      }

      let couponprice = parseFloat(that.data.Data.price) * parseFloat(that.data.Data.amount);
      that.setData({
        couponprice: couponprice
      })
      that.setData({
        selfTotalPrice: couponprice,
        realPay: couponprice
      })

    }
    e.mid != 'undefined' && !e.id && e.cartIds ? that.setData({
      mid: e.mid,
      cartIds: e.cartIds
    }) : '';
    e && e.active ? that.setData({
      active: e.active
    }) : '';
    if (e.storeid) {
      that.setData({
        store_id: e.storeid,


      })
    }!time ? this.getCarts(that.data.cartIds) : that.timeloadingdata();
  },
  onShow: function(res) {
    let that = this;
    utoken = wx.getStorageSync("utoken"), shangmen = 1;
    if (server.globalData.cartIds) {
      let cartIds = server.globalData.cartIds;
      this.setData({
        cartIds: cartIds
      });
    }
    if (wx.getStorageSync('carrierData')) {
      var carrierData = wx.getStorageSync('carrierData')
      that.setData({
        carrierData,
        active: carrierData.active
      })
      wx.getStorageSync('carrierData') ? wx.removeStorageSync('carrierData') : '';
    } else if (wx.getStorageSync('addrdata')) {
      // if (that.data.store_id) {
      //   this.getCarts(that.data.cartIds)
      // }
      var address = that.data.address;
      if (!address) {
        if (wx.getStorageSync('addrdata')) {
          that.to_get_addr();
          this.getCarts(that.data.cartIds);
        } else {
          that.to_add_addr('请添加新的地址')
        }
      } else if (!address.province || !address.city || !address.area) {
        if (wx.getStorageSync('addrdata')) {
          that.to_get_addr();
          this.getCarts(that.data.cartIds);
        } else {
          that.to_add_addr('省市区请填写完整')
        };
      } else {
        if (wx.getStorageSync('addrdata')) {
          that.to_get_addr();
          this.getCarts(that.data.cartIds);
        }
      }
      wx.getStorageSync('addrdata') ? wx.removeStorageSync('addrdata') : '';
    } else {
      !time ? this.getCarts(that.data.cartIds) : that.timeloadingdata();
    }
    if (wx.getStorageSync('isOrder')) {
      that.setData({
        isOrder: wx.getStorageSync('isOrder')
      })
      wx.removeStorageSync('isOrder')
    }
  },
  bindDateChange: function(e) {
    this.setData({
      distributiontime: e.detail.value
    })
  },
  bindTimeChanges(e) {
    this.setData({
      date: e.detail.value
    })
  },
  handleInput(e) {
    let username = this.data.username;
    let index = e.currentTarget.dataset.index;
    username[index] = e.detail.value;
    this.setData({
      username,
    })
  },
  handleMobileInput(e) {
    this.setData({
      userMobile: e.detail.value,
    })
  },
  handleRoomChange(e) {
    this.setData({
      selectedNum: this.data.numArray[e.detail.value],
    })
  },
  handleArriveTimeChange(e) {
    this.setData({
      arriveTime: e.detail.value
    })
  },
  handleMobileInput(e) {
    this.setData({
      userMobile: e.detail.value,
    })
  },
  handleEnterTimeChange(e) {
    this.setData({
      enterTime: e.detail.value,
      isDisable: false
    })
    wx.showToast({
      title: '请选择离店时间',
      icon: 'none'
    })
  },
  handleLeaveTimeChange(e) {
    this.setData({
      leaveTime: e.detail.value
    })
    this.getDay();
  },
  getDay() {
    let space = (new Date(this.data.leaveTime) - new Date(this.data.enterTime)) / 1000 / 60 / 60 / 24;
    this.setData({
      timeSpace: space,
    })
  },
  bindinput: function(e) {},
  // 积分抵扣
  checkboxChange: function(e) {
    let that = this;
    e.detail.value[0] ? that.setData({
      checkbox: 1,
      realPay: that.data.realPay - that.data.totalPrice.deductmoney
    }) : that.setData({
      checkbox: 0,
      realPay: that.data.realPay + that.data.totalPrice.deductmoney
    });
  },
  // 配送时间
  bindTimeChange: function(e) {
    let that = this;
    that.setData({
      arrayValue: that.data.array[e.detail.value]
    });
  },
  // 获取优惠券数据
  getCoupons: function() {
    let that = this;
    server.sendRequest({
      url: "?r=wxapp.sale.coupon.util.query1111",
      showToast: false,
      data: {
        money: tp,
        type: 0,
        utoken: utoken
      },
      success: function(res) {
        that.setData({
          coupons: res.data.result
        })
      }
    })
  },
  // 获取预约服务地址
  timeloadingdata: function() {
    let that = this;
    server.sendRequest({
      url: "?r=services.order.address",
      showToast: false,
      data: {
        utoken: utoken
      },
      success: function(res) {
        if (res.data.result) {
          if (res.data.result.province && res.data.result.area && res.data.result.city) {
            var str = `${res.data.result.province} ${res.data.result.area} ${res.data.result.city}`;
            that.setData({
              address: {
                realname: res.data.result.realname,
                address: str,
              },
              enabled: res.data.result.enabled,
              addressid: res.data.result.id,
              loading: false
            });
          } else {
            that.setData({
              address: "",
              loading: false
            })
          }

        } else {
          that.setData({
            address: "",
            loading: false
          })
        }
      }
    })
  },
  // 选择地址
  addressSelect: utils.throttle(function(e) {
    server.getUserInfo(function() {
      wx.navigateTo({
        url: '../../address/list/list?type=1'
      });
    })
  }, 3000),
  // tap切换
  active: function(res) {
    let that = this;
    that.setData({
      checkbox: 0
    })
    if (shangmen == '1') {
      that.data.active != res.currentTarget.dataset.index ? that.setData({
        active: res.currentTarget.dataset.index
      }) : '';
    } else {
      if (res.currentTarget.dataset.index == '2') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择同一店铺商品自提',
          success: function(res) {
            if (res.confirm) {}
          }
        })
      }
    }
    if (that.data.active == '2') {
      couponprice = parseFloat(that.data.couponprice) - parseFloat(that.data.dispatch_price);
      couponprice = couponprice.toFixed(2);
      that.setData({
        couponprice: couponprice,
      })
      var totalFee = that.data.totalPrice.total_fee;
      if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) { //会员卡折扣
        totalFee = totalFee * (0.1 * that.data.discountvipcard);
      }
      if (that.data.totalPrice.discountprice != 0 && that.data.totalPrice.discountprice != '' && that.data.totalPrice.discountprice != null) { //商品优惠
        totalFee = totalFee - that.data.totalPrice.discountprice;
      }
      if (that.data.totalPrice.enoughdeduct && that.data.totalPrice.enoughmoney) { //满减优惠
        totalFee = totalFee - that.data.totalPrice.enoughdeduct

      }
      if (that.data.coupon_price) {
        totalFee = totalFee - that.data.sub_couponprice; //使用优惠券后的总价
      }
      that.setData({
        selfTotalPrice: totalFee
      })
      //重新计算实付金额
      if (that.data.credit3) {
        let realPay;
        if (that.data.credit3 >= that.data.selfTotalPrice) {
          realPay = 0;
        } else {
          realPay = that.data.selfTotalPrice - that.data.credit3
        }
        that.setData({
          realPay: realPay.toFixed(2)
        })
      } else {
        realPay: that.data.selfTotalPrice.toFixed(2)
      }
    } else {
      couponprice = parseFloat(that.data.couponprice) + parseFloat(that.data.dispatch_price);
      couponprice = parseFloat(couponprice).toFixed(2);
      that.setData({
        couponprice: couponprice
      })
      var totalFee = parseFloat(that.data.totalPrice.total_fee);
      if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) { //会员卡折扣

        totalFee = parseFloat(totalFee) * parseFloat(0.1 * parseFloat(that.data.discountvipcard));
      }
      if (that.data.totalPrice.discountprice != 0 && that.data.totalPrice.discountprice != '' && that.data.totalPrice.discountprice != null) { //商品优惠

        totalFee = parseFloat(totalFee) - parseFloat(that.data.totalPrice.discountprice.discountprice);
      }
      if (that.data.coupon_price) {

        totalFee = parseFloat(totalFee) - parseFloat(that.data.sub_couponprice); //使用优惠券后的总价
      }
      if (that.data.totalPrice.dispatch_price != 0 && that.data.totalPrice.dispatch_price != '' && that.data.totalPrice.dispatch_price != null) {

        totalFee = parseFloat(totalFee) + parseFloat(that.data.totalPrice.dispatch_price);
        that.setData({
          selfTotalPrice: totalFee //优惠后的价格加邮费 
        })
      }

      //重新计算实付金额
      if (that.data.credit3) {
        let realPay;
        if (that.data.credit3 >= that.data.selfTotalPrice) {
          realPay = 0;
        } else {
          realPay = parseFloat(that.data.selfTotalPrice) - parseFloat(that.data.credit3)
        }
        that.setData({
          realPay: realPay.toFixed(2)
        })
      } else {
        realPay: parseFloat(that.data.selfTotalPrice).toFixed(2)
      }

    }
  },
  // 优惠券显示打开
  Tocoupon: function() {
    let that = this;
    that.setData({
      coupon_paper: 1
    });
  },
  // 优惠券显示关闭
  getunCoupon: function() {
    let that = this;
    that.setData({
      coupon_paper: 0
    })
  },
  // 使用优惠券
  getCoupon: function(e) {
    let that = this;
    if (that.data.active == '2') {
      couponprice = yuanjia - that.data.dispatch_price;
      that.setData({
        couponprice: couponprice
      })
    } else {
      couponprice = yuanjia;
      that.setData({
        couponprice: yuanjia
      })
    }
    if (e.currentTarget.dataset.index == 'no') {
      that.setData({
        coupon_name: '',
        coupon_price: '',
        coupon_id: '',
        coupon_backstr: '',
        ID: '',
        select_coupon: 'x',
        sub_couponprice: 0
      })
      that.setData({
        coupon_paper: 0
      })
    } else {
      if (coupon_name == '') {
        wx.showModal({
          title: '提示',
          content: '您还未选择优惠卷',
          showCancel: false,
          success: function(res) {
            return;
          }
        })
      }
      that.setData({
        coupon_name: coupon_name,
        coupon_price: coupon_price,
        coupon_id: coupon_id,
        coupon_backstr: coupon_backstr,
        ID: ID
      })
      that.setData({
        coupon_paper: 0
      })
      if (that.data.Data.time) {
        if (that.data.coupon_backstr == "立减") {
          sub_couponprice = that.data.coupon_price;
          that.setData({
            sub_couponprice: sub_couponprice
          })
        } else if (that.data.coupon_backstr == "返现") {
          sub_couponprice = that.data.coupon_price;
          that.setData({
            sub_couponprice: 0
          })
        } else if (that.data.coupon_backstr == "折") {
          sub_couponprice = that.data.totalPrice.realprice - 0.1 * (that.data.totalPrice.realprice * that.data.coupon_price);
          that.setData({
            sub_couponprice: sub_couponprice
          })
        } else {
          sub_couponprice = 0;
          that.setData({
            sub_couponprice: sub_couponprice
          })
        }
        if (that.data.coupon_backstr == "立减") {
          couponprice = that.data.Data.price * that.data.Data.amount - that.data.coupon_price;
          let realPay;
          if (that.data.sub_couponprice > tp) {
            realPay = 0.01
          } else {
            realPay = tp - that.data.sub_couponprice
          }

          that.setData({
            couponprice: couponprice,
            realPay: realPay
          })
        } else if (that.data.coupon_backstr == "返现") {
          couponprice = that.data.Data.price
          let realPay;
          if (that.data.sub_couponprice > tp) {
            realPay = 0.01
          } else {
            realPay = tp - that.data.sub_couponprice
          }


          that.setData({
            couponprice: couponprice,
            realPay: realPay
          })
        } else if (that.data.coupon_backstr == "折") {
          couponprice = 0.1 * (that.data.Data.price * that.data.coupon_price) * that.data.Data.amount;
          let realPay;
          if (that.data.sub_couponprice > tp) {
            realPay = 0.01
          } else {
            realPay = tp - that.data.sub_couponprice
          }
          that.setData({
            couponprice: couponprice,
            realPay: realPay
          })
        } else {
          couponprice = that.data.Data.price * that.data.Data.amount
          let realPay = tp
          that.setData({
            couponprice: couponprice,
            realPay: realPay
          })
        }
      } else {
        if (that.data.coupon_backstr == "立减") {

          if (parseFloat(that.data.totalPrice.total_fee) <= parseFloat(that.data.coupon_price)) {
            sub_couponprice = that.data.totalPrice.total_fee;
            let realPay
            that.setData({
              sub_couponprice: sub_couponprice
            })
          } else {
            sub_couponprice = that.data.coupon_price;
            that.setData({
              sub_couponprice: sub_couponprice
            })

          }
        } else if (that.data.coupon_backstr == "返现") {
          sub_couponprice = that.data.coupon_price;
          that.setData({
            sub_couponprice: 0
          })
        } else if (that.data.coupon_backstr == "折") {
          sub_couponprice = that.data.totalPrice.total_fee - 0.1 * (that.data.totalPrice.total_fee * that.data.coupon_price);

          that.setData({
            sub_couponprice: sub_couponprice
          })
        } else {
          sub_couponprice = 0;
          that.setData({
            sub_couponprice: sub_couponprice
          })
        }
        if (that.data.coupon_backstr == "立减") {
          if (that.data.totalPrice.total_fee <= that.data.coupon_price) {
            if (that.data.dispatch_price != '0') {
              couponprice = parseFloat(that.data.dispatch_price);
              that.setData({
                couponprice: couponprice
              })
            } else {
              couponprice = 0
              that.setData({
                couponprice: couponprice
              })
            }
          } else {
            couponprice = couponprice - parseFloat(that.data.coupon_price);
            that.setData({
              couponprice: couponprice
            })
          }
        } else if (that.data.coupon_backstr == "返现") {
          couponprice = parseFloat(that.data.totalPrice.realprice)
          that.setData({
            couponprice: couponprice
          })
        } else if (that.data.coupon_backstr == "折") {
          if (that.data.dispatch_price) {
            couponprice = parseFloat(0.1 * (that.data.totalPrice.total_fee) * that.data.coupon_price) + parseFloat(that.data.dispatch_price);
          } else {
            couponprice = parseFloat(0.1 * (that.data.totalPrice.total_fee * that.data.coupon_price));
          }
          couponprice = couponprice.toFixed(2);
          that.setData({
            couponprice: couponprice
          })
        } else {
          couponprice = that.data.totalPrice.realprice
          that.setData({
            couponprice: couponprice
          })
        }
        couponprice = parseFloat(couponprice)
        if (that.data.credit3 && couponprice) {
          if (that.data.credit3 < couponprice) {
            couponprice = couponprice - that.data.credit3
            that.setData({
              couponprice: couponprice,
            })
          } else if (that.data.credit3 >= couponprice) {
            that.setData({
              couponprice: 0
            })
          }
        }
      }
      var a = sub_couponprice.toString();
      var x = a.indexOf('.') + 3;
      a = Number(a);
      sub_couponprice = a.toFixed(2); //a.substr(0, x);
      that.setData({
        sub_couponprice: sub_couponprice
      })
      var a = couponprice.toString();
      if (a.indexOf('.') > 0) {
        var x = a.indexOf('.') + 3;
        a = Number(a);
        couponprice = a.toFixed(2);

        that.setData({
          couponprice: couponprice
        })
      }
    }
    var totalFee = parseFloat(that.data.totalPrice.total_fee) ? parseFloat(that.data.totalPrice.total_fee) : parseFloat(that.data.Data.amount) * parseFloat(that.data.Data.price);

    if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) { //会员卡折扣
      totalFee = totalFee * (0.1 * that.data.totalPrice.discountvipcard);
    }
    if (that.data.totalPrice.discountprice != 0 && that.data.totalPrice.discountprice != '' && that.data.totalPrice.discountprice != null) { //商品优惠
      totalFee = totalFee - that.data.totalPrice.discountprice;
    }
    if (that.data.totalPrice.enoughdeduct && that.data.totalPrice.enoughmoney) { //满减优惠
      totalFee = totalFee - that.data.totalPrice.enoughdeduct
    }
    totalFee = totalFee - that.data.sub_couponprice; //使用优惠券后的总价
    if (that.data.totalPrice.dispatch_price != 0 && that.data.totalPrice.dispatch_price != '' && that.data.totalPrice.dispatch_price != null && that.data.active != 2) {
      totalFee = totalFee + that.data.totalPrice.dispatch_price;
      that.setData({
        selfTotalPrice: totalFee //优惠后的价格加邮费 
      })
    } else {
      that.setData({
        selfTotalPrice: totalFee
      })
    }
    //重新计算实付金额
    if (that.data.credit3) {
      let realPay;
      if (that.data.credit3 >= that.data.selfTotalPrice) {
        realPay = 0;
      } else {
        realPay = that.data.selfTotalPrice - that.data.credit3
      }
      that.setData({
        realPay: realPay.toFixed(2)
      })
    } else {
      realPay: that.data.selfTotalPrice.toFixed(2)
    }
  },
  // 选择优惠券
  Select: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var index = e.currentTarget.dataset.index;
    let that = this;
    if (that.data.select_coupon == index) {
      coupon_price = '';
      coupon_name = '';
      coupon_id = '';
      coupon_backstr = '';
      ID = '';
      that.setData({
        select_coupon: 'x',
        backtype: ''
      })
    } else {
      if (e.currentTarget.dataset.backstr == "立减") {
        coupon_price = e.currentTarget.dataset.price;
      } else if (e.currentTarget.dataset.backstr == "返现") {
        coupon_price = e.currentTarget.dataset.price;
      } else if (e.currentTarget.dataset.backstr == "折") {
        coupon_price = parseFloat(e.currentTarget.dataset.price)
      }
      coupon_price = coupon_price;
      coupon_name = e.currentTarget.dataset.name;
      coupon_id = e.currentTarget.dataset.id;
      coupon_backstr = e.currentTarget.dataset.backstr;
      ID = e.currentTarget.dataset.id;

      that.setData({
        select_coupon: index,
        backtype: e.currentTarget.dataset.backtype
      })
    }
    that.getCoupon(e);
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },
  tomendian: function() {
    if (merchid != undefined) {
      wx.navigateTo({
        url: "../mendian/index?merchid=" + merchid + "&men=1&id=" + id + "&optionid=" + optionid + "&total=" + total
      })
    } else {
      wx.navigateTo({
        url: "../mendian/index?men=1&id=" + id + "&optionid=" + optionid + "&total=" + total + "&merchid=0"
      })
    }
  },
  submit(e) {
    utoken = wx.getStorageSync("utoken");
    let that = this,
      formId = e.detail.formId,
      use_money = that.data.use_money,
      pay_points = that.data.use_point,
      couponTypeSelect = that.data.check[0] == "true" ? 1 : 2,
      coupon_id = 0,
      beizhu,
      realname=e.detail.value.realname,
      mobile=e.detail.value.mobile;

    that.setData({
      formId: formId
    })
    this.data.cpos != -1 ? coupon_id = this.data.couponList[this.data.cpos].id : '';
    if (e.detail.value.beizhu != '') {
      beizhu = e.detail.value.beihzu;
    } else {
      beizhu = '';
    }
    let createInfo = that.data.createInfo,
      couponCode = that.data.couponCode,
      merchid;
    that.data.merch ? merchid = that.data.merch.id : merchid = 0;
    if (that.data.isOrder) {
      wx.showModal({
        title: '提示',
        content: '该订单已存在请前往支付',
        showCancel: false,
        success: function(res) {
          that.data.isOrder ? delete that.data.isOrder : ''
          if (res.confirm) {
            wx.switchTab({
              url: '../../member/index/index',
            })
          }
        }
      })
      return false;
    }
    if (that.data.active == '1') {
      if (that.data.Data.time) {

        if (app.globalData.store) {
          var storeid = app.globalData.store.id
        } else {
          var storeid = ''
        }
        if (that.data.Data.store == '1') {
          if (that.data.enabled == '1') {
            if (!that.data.arrayValue) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请选择配送时间',
                success: function(res) {
                  if (res.confirm) {
                    return false;
                  }
                }
              })
            } else {
              let money = parseFloat(that.data.Data.amount) * parseFloat(that.data.Data.price)
              server.sendRequest({
                url: '?r=wxapp.services.order.pay',
                method: "POST",
                data: {
                  amount: that.data.Data.amount,
                  cartIds: that.data.Data.cartIds,
                  time: that.data.Data.time,
                  goods: that.data.Data.title,
                  storeid: storeid,
                  money: money,
                  addressid: that.data.addressid,
                  utoken: utoken,
                  remark: beizhu,
                  type: that.data.backtype,
                  ptime: that.data.arrayValue,
                  deduct: that.data.checkbox,
                  couponid: that.data.coupon_id,
                  optionid: that.data.Data.optionid
                },
                showToast: false,
                success: function(res) {
                  wx.hideLoading();
                  try {
                    that.setData({
                      orderid: res.data.result['0'].orderid
                    })

                    wx.navigateTo({
                      url: '../orderpay/payment?order_id=' + res.data.result['0'].orderid + '&tabindex=' + that.data.Data.tabindex + '&formId=' + that.data.formId,
                    })
                  } catch (e) {
                    setTimeout(function() {
                      wx.showToast({
                        title: '已经下架',
                        icon: 'success',
                        duration: 3000
                      })
                    }, 200)
                  }
                }
              });
            }
          } else {
            let money = parseFloat(that.data.Data.amount) * parseFloat(that.data.Data.price)
            if (that.data.addressid) {
              server.sendRequest({
                url: '?r=wxapp.services.order.pay',
                method: "POST",
                data: {
                  amount: that.data.Data.amount,
                  cartIds: that.data.Data.cartIds,
                  time: that.data.Data.time,
                  goods: that.data.Data.title,
                  storeid: storeid,
                  money: money,
                  addressid: that.data.addressid,
                  utoken: utoken,
                  remark: beizhu,
                  type: that.data.backtype,
                  deduct: that.data.checkbox,
                  couponid: that.data.coupon_id,
                  optionid: that.data.Data.optionid
                },
                showToast: false,
                success: function(res) {
                  wx.hideLoading();
                  try {
                    that.setData({
                      orderid: res.data.result['0'].orderid
                    })

                    wx.navigateTo({
                      url: '../orderpay/payment?order_id=' + res.data.result['0'].orderid + '&tabindex=' + that.data.Data.tabindex + '&formId=' + that.data.formId,
                    })
                  } catch (e) {
                    setTimeout(function() {
                      wx.showToast({
                        title: '已经下架',
                        icon: 'success',
                        duration: 3000
                      })
                    }, 200)
                  }
                }
              });
            } else {
              wx.showModal({
                title: '没有填写地址',
                content: '请先填写地址',
                success: function(res) {
                  if (res.confirm) {} else if (res.cancel) {

                  }
                }
              })
            }

          }
        } else {
          let money = parseFloat(that.data.Data.amount) * parseFloat(that.data.Data.price)
          server.sendRequest({
            url: '?r=wxapp.services.order.pay',
            method: "POST",
            showToast: false,
            data: {
              amount: that.data.Data.amount,
              cartIds: that.data.Data.cartIds,
              time: that.data.Data.time,
              goods: that.data.Data.title,
              storeid: storeid,
              utoken: utoken,
              money: money,
              remark: beizhu,
              type: that.data.backtype,
              deduct: that.data.checkbox,
              ptime: that.data.arrayValue,
              addressid: that.data.address.id,
              couponid: that.data.coupon_id
            },
            success: function(res) {
              wx.hideLoading();
              try {
                that.setData({
                  orderid: res.data.result['0'].orderid
                })
                wx.navigateTo({
                  url: '../orderpay/payment?order_id=' + res.data.result['0'].orderid + '&tabindex=' + that.data.Data.tabindex + '&formId=' + that.data.formId,
                })
              } catch (e) {
                setTimeout(function() {
                  wx.showToast({
                    title: '已经下架',
                    icon: 'success',
                    duration: 3000
                  })
                }, 200)
              }
            }
          });
        }
      } else if (that.data.bargainid) {
        if (that.data.bargaintype) {

          var submitData = {
            utoken: utoken,
            orderid: 0,
            id: createInfo.id,
            goods: createInfo.goods,
            gdid: createInfo.id,
            diydata: '',
            dispatchtype: 0,
            fromcart: createInfo.fromcart,
            carrierid: merchid,
            addressid: that.data.address.id,
            carriers: '',
            deduct2: 0,
            couponprice: that.data.couponprice,
            couponid: that.data.ID,
            bargainid: that.data.bargainid,
            mid: that.data.mid,
            remark: beizhu,
            deduct: that.data.checkbox,
            logid: that.data.logid
          }
        } else {
          var submitData = {
            utoken: utoken,
            orderid: 0,
            id: createInfo.id,
            goods: createInfo.goods,
            gdid: createInfo.id,
            diydata: '',
            dispatchtype: 0,
            fromcart: createInfo.fromcart,
            carrierid: merchid,
            addressid: that.data.address.id,
            carriers: '',
            deduct2: 0,
            couponprice: that.data.couponprice,
            couponid: that.data.ID,
            mid: that.data.mid,
            remark: beizhu,
            deduct: that.data.checkbox,
            logid: that.data.logid
          }
        }
        server.sendRequest({
          url: '?r=wxapp.activity.orders.submit',
          data: submitData,
          showToast: false,
          method: 'POST',
          success: function(res) {
            wx.hideLoading();
            if (res.data.status == -1) {
              WxParse.wxParse('article', 'html', res.data.msg, that, 5);
              that.setData({
                noorder: true
              })
            }
            if (res.data.status == 10) {
              wx.showToast({
                title: res.data.msg,
                duration: 1000
              });
              wx.switchTab({
                url: "../../member/index/index"
              });
              return;
            }
            var orderid = res.data.result.orderid
            if (res.data.status == 1) {
              that.get_order(orderid, formId);
            }
          }
        })
      } else if (that.data.store_id) {
        if (that.data.dispatch_status == 0) {
          that.setData({
            dispatchtypeB: 1
          })
        } else if (that.data.dispatch_status == 1) {
          that.setData({
            dispatchtypeB: 0
          })
        }
        server.sendRequest({
          url: '?r=wxapp.store.create.submit',
          showToast: false,
          data: {
            utoken: utoken,
            orderid: 0,
            id: createInfo.id,
            goods: createInfo.goods,
            gdid: createInfo.id,
            diydata: '',
            dispatchtype: that.data.dispatchtypeB,
            fromcart: createInfo.fromcart,
            // 门店id
            carrierid: merchid,
            addressid: that.data.address.id,
            carriers: '',
            storeid: that.data.carrierData.carrierid,
            deduct2: 0,
            couponprice: that.data.couponprice,
            couponid: that.data.ID,
            remark: beizhu,
            deduct: that.data.checkbox,
            logid: that.data.logid
          },
          method: 'POST',
          success: function(res) {
            wx.hideLoading();
            if (res.data.status == -1) {
              WxParse.wxParse('article', 'html', res.data.msg, that, 5);
              that.setData({
                noorder: true
              })
            }
            if (res.data.status == 10) {
              wx.showToast({
                title: res.data.msg,
                duration: 1000
              });
              wx.switchTab({
                url: "../../member/index/index"
              });
              return;
            }
            var orderid = res.data.result.orderid
            if (res.data.status == 1) {
              that.get_order(orderid, formId);
            }
          }
        })
      } else {
        if (that.data.mid) {
          server.sendRequest({
            url: '?r=wxapp.order.create.submit',
            showToast: false,
            data: {
              utoken: utoken,
              orderid: 0,
              id: createInfo.id,
              goods: createInfo.goods,
              gdid: createInfo.id,
              diydata: '',
              dispatchtype: 0,
              fromcart: createInfo.fromcart,
              carrierid: merchid,
              addressid: that.data.address.id,
              carriers: '',
              deduct2: 0,
              couponid: 0,
              mid: that.data.mid,
              remark: beizhu,
              deduct: that.data.checkbox,
              logid: that.data.logid
            },
            method: 'POST',
            success: function(res) {
              wx.hideLoading();
              if (res.data.status == -1) {

                WxParse.wxParse('article', 'html', res.data.msg, that, 5);
                that.setData({
                  noorder: true
                })
              }
              if (res.data.status == 10) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000
                });

                wx.switchTab({
                  url: "../../member/index/index"
                });
                return;
              }
              var orderid = res.data.result.orderid
              if (res.data.status == 1) {
                that.get_order(orderid, formId);
              }
            }
          })
        } else {
          if (that.data.createOrder && that.data.createOrder.type == 'flower') {
            let cardmessage = e.detail.value.cardmessage;
            let requirements = e.detail.value.requirements;
            let subscribers = e.detail.value.subscribers;
            let subscriberscall = e.detail.value.subscriberscall;
            let distributiontime = that.data.distributiontime;
            let date = that.data.date;



            if (distributiontime.indexOf('-') == -1) {
              wx.showModal({
                title: '提示',
                content: '请填写配送时间',
                showCancel: false,

              })
              return false;
            }

            if (date.indexOf(':') == -1) {
              wx.showModal({
                title: '提示',
                content: '请填写详细时间',
                showCancel: false,

              })
              return false;
            }

            distributiontime = distributiontime + ' ' + date;

            // if (cardmessage == '') {
            //     wx.showModal({
            //         title: '提示',
            //         content: '请填写留言',
            //         showCancel: false,

            //     })
            //     return false;
            // }
            // if (subscribers == '') {
            //     wx.showModal({
            //         title: '提示',
            //         content: '请填写订购人姓名',
            //         showCancel: false,

            //     })
            //     return false;
            // }

            if (subscriberscall == '') {
              wx.showModal({
                title: '提示',
                content: '请填写订购人电话',
                showCancel: false,

              })
              return false;
            }

            if (!(/^1[345789]\d{9}$/).test(subscriberscall)) {
              wx.showModal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel: false,
                confirmColor: '#f26740'
              })
              return false;
            }

            // if(cardmessage.length<5){
            //    wx.showModal({
            //         title: '提示',
            //         content: '留言不能低于五个字符',
            //         showCancel: false,

            //     })
            //     return false;
            // }


            server.sendRequest({
              url: '?r=wxapp.order.create.submit',
              showToast: false,
              data: {
                utoken: utoken,
                orderid: 0,
                id: createInfo.id,
                goods: createInfo.goods,
                gdid: createInfo.id,
                diydata: '',
                dispatchtype: 0,
                fromcart: createInfo.fromcart,
                // 门店id
                carrierid: merchid,
                addressid: that.data.address.id,
                carriers: '',
                deduct2: 0,
                couponprice: that.data.couponprice,
                couponid: that.data.ID,
                remark: beizhu,
                deduct: that.data.checkbox,
                logid: that.data.logid,
                cardmessage,
                requirements,
                subscribers,
                subscriberscall,
                distributiontime,
              },
              method: 'POST',
              success: function(res) {
                wx.hideLoading();
                if (res.data.status == -1) {
                  WxParse.wxParse('article', 'html', res.data.msg, that, 5);
                  that.setData({
                    noorder: true
                  })
                }
                if (res.data.status == 10) {
                  wx.showToast({
                    title: res.data.msg,
                    duration: 1000
                  });
                  wx.switchTab({
                    url: "../../member/index/index"
                  });
                  return;
                }
                var orderid = res.data.result.orderid
                if (res.data.status == 1) {
                  that.get_order(orderid, formId);
                }
              }
            })

          } else {
            let submitData = {
              utoken: utoken,
              orderid: 0,
              id: createInfo.id,
              goods: createInfo.goods,
              gdid: createInfo.id,
              diydata: '',
              dispatchtype: 0,
              fromcart: createInfo.fromcart,
              // 门店id
              carrierid: merchid,
              addressid: that.data.address.id,
              carriers: '',
              deduct2: 0,
              couponprice: that.data.couponprice,
              couponid: that.data.ID,
              remark: beizhu,
              deduct: that.data.checkbox,
              logid: that.data.logid,
              p_id: that.data.uid,
            };
            let temporaryTime = [];
            if (that.data.enterTime) {
              temporaryTime[0] = that.data.enterTime;
            }
            if (that.data.leaveTime) {
              temporaryTime[1] = that.data.leaveTime;
            }
            /* 酒店版 */
            if (that.data.isGrogShop) {
              submitData = {
                utoken: utoken,
                orderid: 0,
                id: createInfo.id,
                goods: createInfo.goods,
                gdid: createInfo.id,
                diydata: '',
                dispatchtype: 0,
                fromcart: createInfo.fromcart,
                // 门店id
                carrierid: merchid,
                addressid: that.data.address.id,
                carriers: '',
                deduct2: 0,
                couponprice: that.data.couponprice,
                couponid: that.data.ID,
                remark: beizhu,
                deduct: that.data.checkbox,
                logid: that.data.logid,
                cardmessage: that.data.arriveTime,
                subscriberscall: that.data.userMobile,
                requirements: that.data.selectedNum,
                subscribers: that.data.username,
                distributiontime: that.data.timeSpace,
                seckillday: temporaryTime,
              }
              if (!that.data.enterTime) {
                wx.showToast({
                  title: '请选择入住时间',
                  icon: 'none',
                });
                return false;
              }
              if (!that.data.leaveTime) {
                wx.showToast({
                  title: '请选择离店时间',
                  icon: 'none',
                });
                return false;
              }
              if (!that.data.selectedNum) {
                wx.showToast({
                  title: '请选择预定房间数',
                  icon: 'none',
                });
                return false;
              }
              if (!that.data.arriveTime) {
                wx.showToast({
                  title: '请选择到店时间',
                  icon: 'none',
                });
                return false;
              }
              if (that.data.username.length == 0) {
                wx.showToast({
                  title: '请填写入住人信息',
                  icon: 'none',
                });
                return false;
              }
              if (!that.data.userMobile) {
                wx.showToast({
                  title: '请填写联系手机号码',
                  icon: 'none',
                });
                return false;
              }
              if (!(/^1\d{10}/).test(that.data.userMobile)) {
                wx.showToast({
                  title: '请正确填写联系手机号码',
                  icon: 'none',
                });
                return false;
              }
            }
            server.sendRequest({
              url: '?r=wxapp.order.create.submit',
              showToast: false,
              data: submitData,
              method: 'POST',
              success: function(res) {
                wx.hideLoading();
                if (res.data.status == -1) {
                  WxParse.wxParse('article', 'html', res.data.msg, that, 5);
                  that.setData({
                    noorder: true
                  })
                }
                if (res.data.status == 10) {
                  wx.showToast({
                    title: res.data.msg,
                    duration: 1000
                  });
                  wx.switchTab({
                    url: "../../member/index/index"
                  });
                  return;
                }
                var orderid = res.data.result.orderid
                if (res.data.status == 1) {
                  that.get_order(orderid, formId);
                }
              }
            })
          }

        }
      }

    } else if (that.data.active == '2') {

      if (that.data.store_id) {


        if (e.detail.value.person == '') {
          wx.showToast({
            icon: 'loading',
            title: '联系人不能为空',
            duration: 1000
          });
          return;
        }
        if (e.detail.value.phone == '') {
          wx.showToast({
            icon: 'loading',
            title: '联系电话不能为空',
            duration: 1000
          });
          return;
        }
        var carriers = {
          carrier_realname: e.detail.value.person,
          carrier_mobile: e.detail.value.phone,
          realname: that.data.carrierData.realname,
          mobile: that.data.carrierData.mobile,
          storename: that.data.carrierData.storename,
          address: that.data.carrierData.address,
        }
        if (that.data.dispatch_status == 0) {
          that.setData({
            dispatchtypeB: 1
          })
        } else if (that.data.dispatch_status == 1) {
          that.setData({
            dispatchtypeB: 0
          })
        }
        server.sendRequest({
          url: '?r=wxapp.store.create.submit',
          // url: '?r=wxapp.store.pay',
          showToast: false,
          data: {
            utoken: utoken,
            orderid: 0,
            id: createInfo.id,
            goods: createInfo.goods,
            gdid: createInfo.id,
            diydata: '',
            dispatchtype: that.data.dispatchtypeB,
            fromcart: createInfo.fromcart,
            carrierid: that.data.carrierData.carrierid,
            storeid: that.data.carrierData.carrierid,
            // dispatchtype: 2,
            addressid: 0,
            carriers: carriers,
            remark: beizhu,
            deduct2: 0,
            couponprice: that.data.couponprice,
            couponid: that.data.ID,
            deduct: that.data.checkbox,
            logid: that.data.logid
          },
          method: 'POST',
          success: function(res) {
            wx.hideLoading();
            if (res.data.status == -1) {
              WxParse.wxParse('article', 'html', res.data.msg, that, 5);
              that.setData({
                noorder: true
              })
            }
            if (res.data.status == 10) {
              wx.showToast({
                title: res.data.msg,
                duration: 1000
              });
              wx.switchTab({
                url: "../../member/index/index"
              });
              return;
            }
            var orderid = res.data.result.orderid
            if (res.data.status == 1) {
              that.get_order(orderid, formId);
            }
          }
        })
      } else {

        if (e.detail.value.person == '') {
          wx.showToast({
            icon: 'loading',
            title: '联系人不能为空',
            duration: 1000
          });
          return;
        }
        if (e.detail.value.phone == '') {
          wx.showToast({
            icon: 'loading',
            title: '联系电话不能为空',
            duration: 1000
          });
          return;
        }
        if (that.data.Data.store == '1') {
          if (app.globalData.store) {
            var storeid = app.globalData.store.id
          }
          if (that.data.carrierData && that.data.carrierData.carrierid) {
            var storeid = that.data.carrierData.carrierid
          }
          if (!that.data.carrierData) {
            wx.showToast({
              icon: 'loading',
              title: '请选择门店',
              duration: 1000
            });
            return;
          }
          

          server.sendRequest({
            url: '?r=wxapp.services.order.pay',
            method: "POST",
            data: {
              amount: that.data.Data.amount,
              cartIds: that.data.Data.cartIds,
              time: that.data.Data.time,
              goods: that.data.Data.title,
              storeid: storeid,
              utoken: utoken,
              remark: beizhu,
              ptime: that.data.arrayValue,
              deduct: that.data.checkbox,
              couponid: that.data.coupon_id,
              optionid: that.data.Data.optionid,
              realname:realname,
              mobile:mobile,
            },
            showToast: false,
            success: function(res) {
              wx.hideLoading();
              try {
                that.setData({
                  orderid: res.data.result['0'].orderid
                })

                wx.navigateTo({
                  url: '../orderpay/payment?order_id=' + res.data.result['0'].orderid + '&tabindex=' + that.data.Data.tabindex + '&formId=' + that.data.formId,
                })
              } catch (e) {
                setTimeout(function() {
                  wx.showToast({
                    title: '已经下架',
                    icon: 'success',
                    duration: 3000
                  })
                }, 200)
              }
            }
          });
        } else if (that.data.carrierData) {
          var carriers = {
            carrier_realname: e.detail.value.person,
            carrier_mobile: e.detail.value.phone,
            realname: that.data.carrierData.realname,
            mobile: that.data.carrierData.mobile,
            storename: that.data.carrierData.storename,
            address: that.data.carrierData.address,
          }

          server.sendRequest({
            url: '?r=wxapp.order.create.submit',
            showToast: false,
            data: {
              utoken: utoken,
              orderid: 0,
              id: createInfo.id,
              goods: createInfo.goods,
              gdid: createInfo.id,
              diydata: '',
              dispatchtype: 0,
              fromcart: createInfo.fromcart,
              carrierid: that.data.carrierData.carrierid,
              addressid: 0,
              carriers: carriers,
              remark: beizhu,
              deduct2: 0,
              couponprice: that.data.couponprice,
              couponid: that.data.ID,
              deduct: that.data.checkbox,
              logid: that.data.logid
            },
            method: 'POST',
            success: function(res) {
              wx.hideLoading();
              if (res.data.status == -1) {
                WxParse.wxParse('article', 'html', res.data.msg, that, 5);
                that.setData({
                  noorder: true
                })
              }
              if (res.data.status == 10) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000
                });
                wx.switchTab({
                  url: "../../member/index/index"
                });
                return;
              }
              var orderid = res.data.result.orderid

              if (res.data.status == 1) {
                that.get_order(orderid, formId);
              }
            }
          })
        } else if (that.data && that.data.carrier && that.data.carrier[0] && that.data.carrier[0].id) {
          var carriers = {
            carrier_realname: e.detail.value.person,
            carrier_mobile: e.detail.value.phone,
            realname: that.data.carrier[0].realname,
            mobile: that.data.carrier[0].mobile,
            storename: that.data.carrier[0].storename,
            address: that.data.carrier[0].address,
          }
          server.sendRequest({
            url: '?r=wxapp.order.create.submit',
            showToast: false,
            data: {
              utoken: utoken,
              orderid: 0,
              id: createInfo.id,
              goods: createInfo.goods,
              gdid: createInfo.id,
              diydata: '',
              dispatchtype: 0,
              fromcart: createInfo.fromcart,
              carrierid: that.data.carrier[0].id,
              addressid: 0,
              carriers: carriers,
              remark: beizhu,
              deduct2: 0,
              couponprice: that.data.couponprice,
              couponid: that.data.ID,
              deduct: that.data.checkbox,
              logid: that.data.logid
            },
            method: 'POST',
            success: function(res) {
              wx.hideLoading();
              if (res.data.status == -1) {
                WxParse.wxParse('article', 'html', res.data.msg, that, 5);
                that.setData({
                  noorder: true
                })
              }
              if (res.data.status == 10) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000
                });
                wx.switchTab({
                  url: "../../member/index/index"
                });
                return;
              }
              var orderid = res.data.result.orderid
              if (res.data.status == 1) {
                that.get_order(orderid, formId);
              }
            }
          })
        } else {
          wx.showToast({
            icon: 'loading',
            title: '该店铺暂时没有门店',
            duration: 2000
          });
        }
      }
    }
  },
  // formSubmit: function(e) {
  //   let that = this;
  //   server.getUserInfo(function() {
  //     that.submit(e);
  //   })
  // },
  formSubmit: utils.throttle(function(e) {
    let that = this
    server.getUserInfo(function() {
      that.submit(e)
    })
  }, 3000),
  // 获取订单的数据
  get_order: function(orderid, formId) {

    let that = this;
    utoken = wx.getStorageSync("utoken");
    var url
    if (that.data.storeIDB) {
      url = '?r=wxapp.store.pay'

    } else {
      url = '?r=wxapp.order.pay'

    }
    server.sendRequest({
      url: url,
      data: {
        utoken: utoken,
        id: orderid,
        formId: formId
      },
      method: 'GET',
      success: function(res) {
        let pricec = parseFloat(res.data.result.order.price);
        that.setData({
          cneworder: orderid,
          cnewprice: pricec
        })
        server.reportedData('goods_call_pay', {
          order_id: orderid,
          price: pricec
        });
        if (res.data.status == 1) {
          server.globalData.wxdata = res.data.result.data;
          server.globalData.order = res.data.result.order;

          that.setData({
            paydata: res.data.result.data,
            order: res.data.result.order
          });

          let wxdata = server.globalData.wxdata
          let timeStamp = wxdata.timeStamp + "";
          // 有企业支付直接微信支付
          if (wxdata.timeStamp && res.data.result.order && res.data.result.order.creditpay != '1') {
            that.pay();

          }
          // 没有就走二维码支付
          else {
            let selfPrice;
            if (that.data.Data.time) {
              selfPrice = that.data.Data.amount * that.data.Data.price;
            } else {
              selfPrice = that.data.totalPrice.total_fee;
            }
            if (that.data.coupon_price) {
              selfPrice = selfPrice - that.data.sub_couponprice; //优惠券优惠
            }
            if (that.data.dispatch_price != '0' && that.data.dispatch_price != null && that.data.active != 2) {
              selfPrice = selfPrice + parseInt(that.data.dispatch_price); //邮费
            }
            selfPrice = selfPrice - parseInt(that.data.discountprice); //商品优惠
            if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) {
              selfPrice = selfPrice * (0.1 * that.data.totalPrice.discountvipcard); //会员卡折扣
            }


            wx.navigateTo({
              url: '../orderpay/payment?order_id=' + orderid + '&formId=' + formId + '&couponprice=' + selfPrice + '&storeid=' + that.data.storeIDB
            });
          }
        } else if (res.data.status == 10) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            url: "../../member/index/index"
          });
          return;
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            url: "../../member/index/index"
          });
          return;
        }
      }
    })
  },
  // 支付
  pay: function() {
    let that = this;
    var wxdata = server.globalData.wxdata
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package
    var sign = wxdata.sign;
    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': package1,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': sign,
      'success': function(res) {
        if (time) {
          server.sendRequest({
            url: "?r=wxapp.services.order.updateStatus",
            data: {
              utoken: utoken,
              orderid: orderId
            },
            method: 'GET',
            success: function(res) {}
          })
        }
        server.reportedData('goods_pay_success', {
          order_id: that.data.cneworder,
          price: that.data.cnewprice,
        });
        wx.navigateTo({
          url: '../success/index'
        });
      },
      'fail': function(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 1000
        })
        if (that.data.myList) {
          setTimeout(function() {
            wx.redirectTo({
              delta: 1
            })
          }, 1000)
        } else {
          if (that.data.store_id) {
            setTimeout(function() {
              // wx.reLaunch({
              //   url: '../../store/detail/index?id=' + that.data.store_id
              // });
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            setTimeout(function() {
              wx.reLaunch({
                url: '../../member/index/index'
              });
            }, 1000)
          }

        }
      }
    })
  },
  isOK: function() {
    let that = this;
    that.setData({
      noorder: false
    })
  },
  toStart: function() {
    wx.reLaunch({
      url: '../../index/index'
    })
  },
  getCarts: function(cartIds) {
    let that = this
    var utoken = wx.getStorageSync("utoken");
    // 砍价
    if (that.data.bargainid) {
      if (that.data.bargaintype) {
        //砍完一次再立即购买
        var submitData = {
          utoken: utoken,
          mid: that.data.mid,
          bargainid: that.data.bargainid,
          optionid: that.data.bargainOptionid
        }
      } else {
        //砍价的原价购买
        var submitData = {
          utoken: utoken,
          mid: that.data.mid,
          id: that.data.bargainid,
          optionid: that.data.bargainOptionid
        }
      }
      server.sendRequest({
        url: '?r=wxapp.activity.orders', //原来的接口?r=wxapp.order.create
        showToast: false,
        data: submitData,
        method: 'GET',
        success: function(res) {
          that.setData({
            loading: false
          })
          if (res.data.status != 1) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function() {
                wx.switchTab({
                  url: '../../member/index/index',
                })
              }
            });
            return false;
          }
          let user_data = server.globalData.userInfo;
          server.globalData.userInfo = user_data;
          let address = res.data.result.addressList; //收货地址
          let cartList = res.data.result.cartList; //购物车列表
          let userInfo = res.data.result.userInfo; //用户详情
          let totalPrice = res.data.result.totalPrice; //总计

          // 会员卡
          if (userInfo.credit3) {
            var credit3 = userInfo.credit3;
          } else {
            var credit3 = 0;
          }
          that.setData({
            credit3: credit3,
            discountprice: res.data.result.totalPrice.discountprice,
            createInfo: res.data.result.createInfo
          });
          // 解决邮费小数点问题
          var dispatch_price = totalPrice.dispatch_price;
          var a = dispatch_price.toString();
          if (a.indexOf('.') > 0) {
            var x = a.indexOf('.') + 3;
            dispatch_price = a.substr(0, x);
          }

          that.setData({
            dispatch_price: dispatch_price
          })
          that.data.createInfo = res.data.result.createInfo;
          tp = totalPrice.total_fee
          if (that.data.logid) {} else {
            that.getCoupons();
          }

          points_rate = res.data.result.points;

          that.setData({
            address: address,
            cartList: cartList,
            userInfo: userInfo,
            totalPrice: totalPrice
          });

          res.data.result.merch ? that.setData({
            merch: res.data.result.merch
          }) : '';
          res.data.result.carrier_list ? that.setData({
            carrier: res.data.result.carrier_list
          }) : '';
          cartList['0'] && cartList['0'].merchid ? merchid = cartList['0'].merchid : '';


          // if (!address) {
          //     wx.getStorageSync('addrdata') ? that.to_get_addr() : that.to_add_addr(address);
          // } else {
          //     wx.getStorageSync('addrdata') ? that.to_get_addr() : '';
          // }

          that.data.totalPrice.realprice ? couponprice = that.data.totalPrice.realprice : '';
          let selfTotalPrice = that.data.totalPrice.total_fee;
          let realPay;
          if (that.data.totalPrice.enoughdeduct && that.data.totalPrice.enoughmoney) {
            selfTotalPrice = selfTotalPrice - that.data.totalPrice.enoughdeduct
          }
          if (that.data.totalPrice.discountprice != 0 && that.data.totalPrice.discountprice != '' && that.data.totalPrice.discountprice != null) {
            selfTotalPrice = selfTotalPrice - that.data.totalPrice.discountprice;
          }
          if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) {
            selfTotalPrice = selfTotalPrice * (0.1 * that.data.totalPrice.discountvipcard);
          }
          if (that.data.totalPrice.dispatch_price != 0) {
            selfTotalPrice = selfTotalPrice + that.data.totalPrice.dispatch_price; //加上邮费
          }

          that.setData({
            selfTotalPrice: selfTotalPrice
          })
          //计算实付金额
          if (credit3) {
            if (credit3 >= selfTotalPrice) {
              realPay = 0;
            } else {
              realPay = selfTotalPrice - credit3
            }
            that.setData({
              realPay: realPay.toFixed(2)
            })
          } else {
            realPay: selfTotalPrice.toFixed(2)
          }
          if (that.data.sub_couponprice) {

            let realPay = that.data.realPay - that.data.sub_couponprice;
            that.setData({
              realPay: realPay.toFixed(2)
            })

          }
          if (credit3) {
            credit3 >= couponprice ? that.setData({
              couponprice: couponprice
            }) : couponprice = couponprice - credit3, that.setData({
              couponprice: couponprice
            });
          } else {
            that.setData({
              couponprice: couponprice
            });
          }
          yuanjia = that.data.couponprice;
          let couponList = res.data.result.couponList
          let ms = that.data.coupon
          for (let i in couponList) {
            ms.push(couponList[i].name);
          }
          that.setData({
            coupon: ms,
            couponList: couponList,
            result: res.data.result,
            loading: false
          });
        }
      })
    } else if (that.data.id) {
      if (id != '' || optionid != '' && total != '') {} else {
        id = 0;
        optionid = 0;
        total = 0;

      }
      var logid = that.data.logid;
      server.sendRequest({
        url: '?r=wxapp.order.create',
        showToast: false,
        data: {
          utoken,
          id,
          optionid,
          total,
          logid
        },
        method: 'GET',
        success: function(res) {
          that.setData({
            loading: false
          })
          if (res.data.status != 1) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function() {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
            return false;
          }

          let user_data = server.globalData.userInfo;
          server.globalData.userInfo = user_data;
          let address = res.data.result.addressList //收货地址
          let cartList = res.data.result.cartList //购物车列表
          let userInfo = res.data.result.userInfo //用户详情
          let totalPrice = res.data.result.totalPrice //总计
          let isGrogShop = res.data.result.fivgType == 29 ? true : false;
          // 花店判断
          if (res.data.result.createOrder) {
            that.setData({
              createOrder: res.data.result.createOrder
            })
          }

          if (userInfo.credit3) {
            var credit3 = userInfo.credit3;
          } else {
            var credit3 = 0;
          }

          that.setData({
            credit3: credit3,
            discountprice: res.data.result.totalPrice.discountprice,
            createInfo: res.data.result.createInfo,
            isGrogShop
          });


          let dispatch_price = totalPrice.dispatch_price;
          let a = dispatch_price.toString();

          if (a.indexOf('.') > 0) {
            let x = a.indexOf('.') + 3,
              dispatch_price = a.substr(0, x)
          }


          that.setData({
            dispatch_price: dispatch_price
          })
          that.data.createInfo = res.data.result.createInfo;
          tp = totalPrice.total_fee
          if (that.data.logid) {} else {
            that.getCoupons();
          }
          points_rate = res.data.result.points;
          that.setData({
            address: address,
            cartList: cartList,
            userInfo: userInfo,
            totalPrice: totalPrice
          });
          res.data.result.merch ? that.setData({
            merch: res.data.result.merch
          }) : '';

          res.data.result.carrier_user ? that.setData({
            carrier_user: res.data.result.carrier_user
          }) : '';

          res.data.result.carrier_list ? that.setData({
            carrier: res.data.result.carrier_list
          }) : '';
          cartList['0'] && cartList['0'].merchid ? merchid = cartList['0'].merchid : '';
          // 总金额
          couponprice = that.data.totalPrice.realprice;
          // let selfTotalPrice = that.data.totalPrice.total_fee;
          let selfTotalPrice = that.data.totalPrice.realprice;

          let realPay;
          // if (that.data.totalPrice.enoughdeduct && that.data.totalPrice.enoughmoney) {
          //     selfTotalPrice = selfTotalPrice - that.data.totalPrice.enoughdeduct
          // }
          // if (that.data.totalPrice.discountprice != 0) {
          //     selfTotalPrice = selfTotalPrice - that.data.totalPrice.discountprice;
          // }
          // if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) {
          //     selfTotalPrice = selfTotalPrice * (0.1 * that.data.totalPrice.discountvipcard);
          // }
          // if (that.data.totalPrice.dispatch_price != 0) {
          //     selfTotalPrice = selfTotalPrice + that.data.totalPrice.dispatch_price;
          // }

          that.setData({
            selfTotalPrice: selfTotalPrice //总费用
          })
          //计算实付金额
          if (credit3) {
            if (credit3 >= selfTotalPrice) {
              realPay = 0;
            } else {
              realPay = selfTotalPrice - credit3
            }
            that.setData({
              realPay: realPay.toFixed(2)
            })
          } else {
            realPay: selfTotalPrice.toFixed(2)
          }
          if (that.data.sub_couponprice) {

            let realPay = that.data.realPay - that.data.sub_couponprice;
            that.setData({
              realPay: realPay.toFixed(2)
            })

          }
          if (credit3) {
            if (credit3 >= couponprice) {
              that.setData({
                couponprice: couponprice
              })
            } else {
              couponprice = (couponprice - credit3).toFixed(2);
              that.setData({
                couponprice: couponprice
              })
            }
          } else {
            that.setData({
              couponprice: couponprice
            })
          }
          yuanjia = that.data.couponprice;
          var couponList = res.data.result.couponList
          var ms = that.data.coupon
          for (var i in couponList) {
            ms.push(couponList[i].name);
          }
          that.setData({
            coupon: ms,
            couponList: couponList,
            result: res.data.result,
            loading: false
          });
        }
      })
    } else if (that.data.store_id) {
      if (wx.getStorageSync("addrdata")) {
        var addressid = wx.getStorageSync("addrdata").id
      } else {
        var addressid = ''
      }
      server.sendRequest({
        url: '?r=wxapp.store.create',
        data: {
          utoken: utoken,
          storeid: that.data.store_id,
          addressid: addressid,
          dispatch_type: that.data.dispatch_type
        },
        method: "GET",
        success: function(res) {
          that.setData({
            loading: false,
          })
          if (res.data.status != 1) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function() {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
            return false;
          }
          let user_data = server.globalData.userInfo;
          server.globalData.userInfo = user_data;
          let address = res.data.result.addressList //收货地址
          let cartList = res.data.result.cartList //购物车列表
          let userInfo = res.data.result.userInfo //用户详情
          let totalPrice = res.data.result.totalPrice //总计

          if (userInfo.credit3) {
            var credit3 = userInfo.credit3;
          } else {
            var credit3 = 0;
          }

          that.setData({
            credit3: credit3,
            discountprice: res.data.result.totalPrice.discountprice,
            createInfo: res.data.result.createInfo,
            dispatch_status: res.data.result.dispatch_state
          });
          let dispatch_price = totalPrice.dispatch_price;
          let a = dispatch_price.toString();
          if (a.indexOf('.') > 0) {
            let x = a.indexOf('.') + 3,
              dispatch_price = a.substr(0, x)
          }
          that.setData({
            dispatch_price: dispatch_price
          })
          that.data.createInfo = res.data.result.createInfo;
          tp = totalPrice.total_fee
          if (that.data.logid) {} else {
            that.getCoupons();
          }
          points_rate = res.data.result.points;
          that.setData({
            address: address,
            cartList: cartList,
            userInfo: userInfo,
            totalPrice: totalPrice
          });
          res.data.result.merch ? that.setData({
            merch: res.data.result.merch
          }) : '';
          res.data.result.storeInfo ? that.setData({
            carrier: res.data.result.storeInfo,
            carrierData: res.data.result.storeInfo
          }) : '';
          cartList['0'] && cartList['0'].merchid ? merchid = cartList['0'].merchid : '';
          // 总金额
          couponprice = that.data.totalPrice.realprice;
          let selfTotalPrice = that.data.totalPrice.total_fee;
          let realPay;
          if (that.data.totalPrice.enoughdeduct && that.data.totalPrice.enoughmoney) {
            selfTotalPrice = selfTotalPrice - that.data.totalPrice.enoughdeduct
          }
          if (that.data.totalPrice.discountprice != 0) {
            selfTotalPrice = selfTotalPrice - that.data.totalPrice.discountprice;
          }
          if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) {
            selfTotalPrice = selfTotalPrice * (0.1 * that.data.totalPrice.discountvipcard);
          }
          if (that.data.totalPrice.dispatch_price != 0) {
            selfTotalPrice = selfTotalPrice + that.data.totalPrice.dispatch_price;
          }

          that.setData({
            selfTotalPrice: selfTotalPrice //总费用
          })
          //计算实付金额
          if (credit3) {
            if (credit3 >= selfTotalPrice) {
              realPay = 0;
            } else {
              realPay = selfTotalPrice - credit3
            }
            that.setData({
              realPay: realPay.toFixed(2)
            })
          } else {
            realPay: selfTotalPrice.toFixed(2)
          }
          if (that.data.sub_couponprice) {

            let realPay = that.data.realPay - that.data.sub_couponprice;
            that.setData({
              realPay: realPay.toFixed(2)
            })

          }
          if (credit3) {
            if (credit3 >= couponprice) {
              that.setData({
                couponprice: couponprice
              })
            } else {
              couponprice = (couponprice - credit3).toFixed(2);
              that.setData({
                couponprice: couponprice
              })
            }
          } else {
            that.setData({
              couponprice: couponprice
            })
          }
          yuanjia = that.data.couponprice;


          var couponList = res.data.result.couponList
          var ms = that.data.coupon
          for (var i in couponList) {
            ms.push(couponList[i].name);
          }
          that.setData({
            coupon: ms,
            couponList: couponList,
            result: res.data.result,
            loading: false
          });
        }
      })
    } else {
      if (id != '' || optionid != '' && total != '') {} else {
        id = 0;
        optionid = 0;
        total = 0;
      }
      var logid = that.data.logid;
      server.sendRequest({
        url: '?r=wxapp.order.create',
        showToast: false,
        data: {
          utoken,
          id,
          optionid,
          total,
          logid

        },
        method: 'GET',
        success: function(res) {
          that.setData({
            loading: false
          })
          if (res.data.status == '-1') {} else {

            var user_data = server.globalData.userInfo;
            server.globalData.userInfo = user_data;

            var address = res.data.result.addressList //收货地址
            var cartList = res.data.result.cartList //购物车列表
            var userInfo = res.data.result.userInfo //用户详情
            var totalPrice = res.data.result.totalPrice //总计
            // 普通购买流程的门店信息 active1 
            res.data.result.merch ? that.setData({
              merch: res.data.result.merch
            }) : '';

            // 花店判断
            if (res.data.result.createOrder) {
              that.setData({
                createOrder: res.data.result.createOrder
              })
            }
            // active2 门店数据
            res.data.result.carrier_list ? that.setData({
              carrier: res.data.result.carrier_list
            }) : '';
            cartList['0'] && cartList['0'].merchid ? merchid = cartList['0'].merchid : '';

            for (var x in cartList) {
              if (merchid != cartList[x].merchid) {
                shangmen = 2
              }
            }
            if (userInfo.credit3) {
              var credit3 = userInfo.credit3;
            } else {
              var credit3 = 0;
            }
            that.setData({
              credit3: credit3,
              discountprice: res.data.result.totalPrice.discountprice,
              createInfo: res.data.result.createInfo
            });
            var dispatch_price = totalPrice.dispatch_price;
            var a = dispatch_price.toString();
            if (a.indexOf('.') > 0) {
              var x = a.indexOf('.') + 3;
              dispatch_price = a.substr(0, x);
            }
            that.setData({
              dispatch_price: dispatch_price
            })
            that.data.createInfo = res.data.result.createInfo;
            tp = totalPrice.total_fee
            if (that.data.logid) {} else {
              that.getCoupons();
            }
            points_rate = res.data.result.points;
            that.setData({
              address: address,
              cartList: cartList,
              userInfo: userInfo,
              totalPrice: totalPrice
            });
            if (res.data.result.carrier_list) {
              that.setData({
                carrier: res.data.result.carrier_list
              })
            }
            // 核销判断
            if (res.data.result.cartList[0] && res.data.result.cartList[0].isverify == '2' && that.data.carrier != '') {
              that.setData({
                active: 1,
              })
            }
            // let selfTotalPrice = that.data.totalPrice.total_fee;
            let selfTotalPrice = that.data.totalPrice.realprice;
            let realPay;
            // if (that.data.totalPrice.enoughdeduct && that.data.totalPrice.enoughmoney) {
            //   selfTotalPrice = selfTotalPrice - that.data.totalPrice.enoughdeduct
            // }
            // if (that.data.totalPrice.discountprice != 0) {
            //   selfTotalPrice = selfTotalPrice - that.data.totalPrice.discountprice;
            // }
            // if (that.data.totalPrice.discountvipcard != '' && that.data.totalPrice.discountvipcard != null) {
            //   selfTotalPrice = selfTotalPrice * (0.1 * that.data.totalPrice.discountvipcard);
            // }
            // if (that.data.totalPrice.dispatch_price != 0) {
            //   selfTotalPrice = selfTotalPrice + that.data.totalPrice.dispatch_price;
            // }

            that.setData({
              selfTotalPrice: selfTotalPrice.toFixed(2)
            })
            //计算实付金额
            if (credit3) {
              if (credit3 >= selfTotalPrice) {
                realPay = 0;
              } else {
                realPay = selfTotalPrice - credit3
              }
              that.setData({
                realPay: realPay.toFixed(2)
              })
            } else {
              realPay: selfTotalPrice.toFixed(2)
            }
            if (that.data.sub_couponprice) {

              let realPay = that.data.realPay - that.data.sub_couponprice;
              that.setData({
                realPay: realPay.toFixed(2)
              })

            }
            // 总金额
            couponprice = that.data.totalPrice.realprice;
            if (credit3) {
              if (credit3 >= couponprice) {
                that.setData({
                  couponprice: couponprice
                })
              } else {
                couponprice = (couponprice - credit3).toFixed(2);
                that.setData({
                  couponprice: couponprice
                })
              }
            } else {
              that.setData({
                couponprice: couponprice
              })
            }
            var couponList = res.data.result.couponList
            var ms = that.data.coupon
            for (var i in couponList) {
              ms.push(couponList[i].name);
            }
            that.setData({
              coupon: ms,
              couponList: couponList,
              result: res.data.result
            });
            yuanjia = that.data.couponprice;
          }
          that.setData({
            loading: false
          });
        }
      })
    }
  },
  to_add_addr: function(address) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: address,
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../address/select/index?addr=addr'
          });

        }
      }
    })
  },
  tocheckCoupon() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.navigateTo({
      url: '/packMember/pages/member/coupon/checkCoupon/index?tp=' + tp,
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
  },
  to_get_addr: function() {
    let that = this;
    let addrID = wx.getStorageSync('addrdata');
    server.sendRequest({
      url: '?r=wxapp.member.address.getaddress',
      method: "GET",
      data: {
        id: addrID.id,
        utoken: utoken
      },
      success: function(res) {
        let address = res.data.result;
        let createInfo = that.data.createInfo;
        createInfo.addressid = address.id;
        if (that.data.createInfo.isverify) {
          server.sendRequest({
            url: '?r=wxapp.order.create.getChangeMerch',
            method: "GET",
            data: {
              addressid: address.id,
              utoken: utoken
            },
            success: function(res) {
              res.data.result.merch ? that.setData({
                merch: res.data.result.merch
              }) : '';
            }
          })
        }

        if (that.data.Data.time) {
          var str = `${address.province} ${address.area} ${address.city}`;
          that.setData({
            address: {
              realname: address.realname,
              address: str,

            },
            addressid: address.id
          })
        } else {
          that.setData({
            address: res.data.result,
            createInfo,
            dispatch_type: 0
          })
        }

        if (wx.getStorageSync('addrdata')) {
          wx.removeStorageSync('addrdata');
        }
        if (!address.province || !address.city || !address.area) {
          wx.getStorageSync('addrdata') ? that.to_get_addr() : that.to_add_addr('省市区请填写完整');
        }
      }
    })
  },
  check1: function() {
    this.setData({
      check: ['true', '']
    });
  },
  check2: function() {
    this.setData({
      check: ['', 'true']
    });
  },
  // givemodeZore: function(e) {
  //     var that = this
  //     if (e.currentTarget.dataset.dispatch_status == 1 && that.data.dispatch_status == 1) {
  //         that.setData({
  //             dispatch_status: 0,
  //             dispatch_type: 1
  //         })
  //         this.getCarts(that.data.cartIds)
  //     }
  //     // that.setData({
  //     //   dispatch_status: 0
  //     // })
  // },
  givemodeOne: function(e) {
    var that = this
    // if (e.currentTarget.dataset.dispatch_status == 0) {
    that.setData({
      dispatch_status: e.currentTarget.dataset.dispatch_status,
    })
    // } else {
    //     that.setData({
    //         dispatch_status: 1
    //     })
    // }
    if (that.data.dispatch_type == 1) {

      that.setData({
        dispatch_status: 1,
        dispatch_type: 0
      })
      this.getCarts(that.data.cartIds)
    }
  }
})