function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
var server = require('../../../utils/server');
var WxParse = require('../../../wxParse/wxParse.js');
var report = require('./burying_point');


var app = getApp(),
  utoken = wx.getStorageSync("utoken"),
  arr = [],
  arrImg = [],
  timer,
  name_arr = [],
  img_arr = [],
  num, page = 1,
  imageUrl = [],
  level = 'all',
  goodsId,
  tsx = [],
  txarr = [];

Page({
  data: {
    loading: true,
    goods: {},
    current: 0,
    tabStates: [true, false, false],
    tabClasss: ["text-select", "text-normal", "text-normal"],
    galleryHeight: getApp().screenWidth,
    tab: 0,
    goods_num: 1,
    optionid: 0,
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    favorite: '',
    cost_price: "",
    store_count: '',
    select: 'all',
    currIndex: 1,
    isclick: '',
    cashD: '',
    qualityD: '',
    sevenD: '',
    invoiceD: '',
    repairD: '',
    cash: '货到付款',
    quality: '正品保证',
    seven: '七天无理由退货',
    invoice: '发票',
    repair: '保修',
    buy: '',
    index: 0,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    refresh: false,
    total: '',
    customerserver: '',
    price: '',
    order_goodscount: 0,
    maxbuy: 0,
    minbuy: 0,
    usermaxbuy: 0,
    cartNum: 0,
    seckillMmaxbuy: 0,
    showContact: true,
    shareIcon: false,
    bannerIndex: 0,
    start_time: 0,
    isVr: false,
    isGrogShop: false,
    redpackage: false, //显示红包
    redpackageID: '',
    setRed: 1, //打开红包,
    redPackageData: {},
    uid: '',
    is_mianyi: 0,
    enoughList: [],
  },
  handleBannerChange(e) {
    this.setData({
      bannerIndex: e.detail.current
    })
  },
  skipShopIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  //关闭红包
  closeRedpackage() {
    this.setData({
      redpackage: false,
    })
  },

  //获取红包ID
  getRedPackageId() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=lottery.lottery_id&type=4&utoken=" + utoken,
      method: "GET",
      success: function (res) {
        if (res.data.result.id) {
          let myId = res.data.result.id;
          if (myId) {
            that.setData({
              redpackageID: myId,
              redpackage: true
            })
          } else {
            that.setData({
              redpackage: false
            })
          }
        }
      }
    })
  },
  //领取红包
  receiveRedPackage() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    wx.showLoading({
      title: '开启红包中...',
    })
    server.sendRequest({
      url: "?r=lottery.reward",
      data: {
        utoken: utoken,
        id: that.data.redpackageID
      },
      method: "POST",
      success: function (res) {
        console.log(res, 33)
        if (res.data.status == 1) {

          let coupon = res.data.result.reward.coupon;
          let couponId;
          for (let x in coupon) {
            if (typeof coupon[x] == 'object') {
              couponId = x
            }
          }
          that.getCouponDetail(couponId);

        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
      }
    });
  },

  //获取优惠券详情
  getCouponDetail(couponId) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=lottery.getCoupondetail",
      method: "GET",
      data: {
        utoken: utoken,
        id: couponId
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          setRed: 2,
        })
        if (res.data.status == 1) {
          let redPackageData = res.data.result;
          let money = parseInt(res.data.result.deduct);
          redPackageData.deduct = money;
          that.setData({
            redPackageData: redPackageData
          })
        }
      }
    })
  },

  intoMianyi() {
    wx.switchTab({
      url: '../../card/index/index',
    })
  },

  onLoad: function (options) {

    if (options.uid) {
      this.setData({
        uid: options.uid,
      })
    }
    //判断是否为vr商品
    if (options.typefrom == 'vr') {
      this.setData({
        isVr: true
      })
      this.getRedPackageId();
    }
    if (options.share) {
      this.setData({
        shareIcon: true
      })
    }
    var that = this;
    utoken = wx.getStorageSync("utoken");
    if (wx.getStorageSync('customerserver')) {
      that.setData({
        customerserver: wx.getStorageSync('customerserver')
      })
    }
    goodsId = options.objectId;
    if (options.myshop) {
      that.setData({
        myshop: options.myshop
      })
    }
    if (typeof options.scene !== 'undefined') {
      let scene = decodeURIComponent(options.scene);
      let params = {};
      let temp1 = scene.split('&');
      for (let i = 0; i < temp1.length; i++) {
        let temp2 = temp1[i].split('=');
        params[temp2[0]] = temp2[1];
      }
      goodsId = params.goodsid;
      if (typeof params.mid !== 'undefined') {
        that.setData({
          mid: params.mid,
          goodsId: goodsId
        });
        var midX = wx.setStorageSync("mid", params.mid);
        var midZ = wx.getStorageSync("mid");
      }
    }
    if (options.id && options.store) {
      goodsId = options.id
      that.setData({
        storeHh: options.store
      })
    }
    that.setData({
      goodsId: goodsId,
      is_mianyi: wx.getStorageSync('is_mianyi'),
      storeid: options.storeid
    })
    img_arr = [], tsx = [];
    arr = [],
      arrImg = [],
      timer,
      name_arr = [],
      num, page = 1,
      imageUrl = [],
      level = 'all',
      goodsId,
      txarr = [];
    // that.getGoodsById(goodsId);
    that.getEvaluation(goodsId);
    this.getCouponList();

  },
  //页面加载获取购物车数量
  onShow: function () {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    that.getGoodsById(goodsId);
    that.getTotal(goodsId);
  },
  onReachBottom: function () {
    if (this.data.tab == 2) {
      this.bottom();
    }
  },
  //获取购物车数量
  getTotal: function (goodsId) {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=wxapp.member.cart.getCartNumNew&goodsid= " + goodsId,
      showToast: false,
      data: {
        utoken: utoken
      },
      method: "GET",
      success: function (res) {
        if (res.data.result) {
          that.setData({
            total: res.data.result.cartcount
          })
          that.setData({
            cartNum: res.data.result.total ? parseInt(res.data.result.total) : 0
          })
        }
      }
    })
  },
  bottom: function () {
    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true
    });
    page = page + 1;
    server.sendRequest({
      url: "?r=wxapp.goods.detail.get_comment_list",
      showToast: false,
      data: {
        id: that.data.goodsId,
        page: 1,
        level: level,
        showImage: false,
        page: page
      },
      method: "GET",
      success: function (res) {
        var arr = [];
        for (var x in that.data.list) {
          arr.push(that.data.list[x]);
        }
        if (res.data.result.list != '') {
          for (let x in res.data.result.list) {
            arr.push(res.data.result.list[x])
          }
          that.setData({
            refresh: false
          });
        } else {
          page = page - 1;
        }
        for (let i = 0; i < arr.length; i++) {
          WxParse.wxParse('reply' + i, 'html', arr[i].content, that);
          if (i === arr.length - 1) {
            WxParse.wxParseTemArray("replyTemArray", 'reply', arr.length, that)
          }
        }
        that.setData({
          list: arr
        })
      }
    })
  },
  // 秒杀列表
  joinskillList: function () {
    wx.redirectTo({
      url: '../priceKill/priceKill',
    })
  },
  // 跳转购物车
  nav1: function () {
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    var tabBarPage = extConfig.tabBarPage;
    if (extConfig.tabBarPage) {
      if (tabBarPage.indexOf('/pages/cart/cart') != -1) {
        wx.reLaunch({
          url: '../../cart/cart'
        })
      } else {
        wx.navigateTo({
          url: '../../cart/cart'
        })
      }
    } else {
      wx.navigateTo({
        url: '../../cart/cart'
      })
    }

  },
  // 选择评价
  select: function (res) {
    var that = this;;
    level = res.currentTarget.dataset.index;
    that.setData({
      refresh: false
    });
    page = 1;
    that.getEvaluationData(that.data.goodsId, res.currentTarget.dataset.index)
    that.setData({
      select: res.currentTarget.dataset.index
    })
  },
  //选择商品属性
  propClick: function (e) {
    var that = this;
    var pos = e.currentTarget.dataset.pos;
    var index = e.currentTarget.dataset.index;
    if (num == index) {
      that.setData({
        index: pos
      })
    }
    if (name_arr[index]) {
      name_arr[index] = e.currentTarget.dataset.name;
    } else {
      name_arr[index] = e.currentTarget.dataset.name;
    }
    that.setData({
      name_arr: name_arr
    })
    var goods = this.data.goods
    if (goods.spec_goods_price && goods.spec_goods_price[pos].price != "null") {
      this.setData({
        cost_price: goods.spec_goods_price[pos].price,
        store_count: parseInt(goods.spec_goods_price[pos].store_count)
      })
    } else {
      this.setData({
        cost_price: goods.goods.cost_price,
        store_count: parseInt(goods.goods.store_count)
      })
    }
    for (var i = 0; i < goods.goods.goods_spec_list[index].length; i++) {
      if (i == pos) {
        goods.goods.goods_spec_list[index][pos].isClick = 1;
        arr[index] = e.currentTarget.id;
      } else
        goods.goods.goods_spec_list[index][i].isClick = 0;
      arr[index] = goods.goods.goods_spec_list[index][0].item_id;

    }
    let item_id
    var ss_t = new Array();
    for (var j = 0; j < goods.goods.goods_spec_list.length; j++) {
      for (var m = 0; m < goods.goods.goods_spec_list[j].length; m++) {
        if (goods.goods.goods_spec_list[j][m]['isClick'] == 1) {
          console.log('11111', j, m, goods.goods.goods_spec_list[j][m]['isClick'])

          var s_s = 0;
          s_s = goods.goods.goods_spec_list[j].length + '_' + goods.goods.goods_spec_list[j][m]['item_id']
          console.log('s_s', s_s)
          ss_t.push(s_s);
          console.log('ss_s', ss_t)
          item_id = goods.goods.goods_spec_list[j][m]['item_id'];
        }
      }
    }


    var str = [];
    for (var ssss in that.data.goods.goods.goods_spec_list) {
      var ts = [];
      ts.push(that.data.goods.goods.goods_spec_list[ssss].length)
      ts.push(ssss);
      if (tsx.length < that.data.goods.goods.goods_spec_list.length) {
        tsx.push(ts)
      }
    }
    tsx.sort(function (a, b) {
      return a[0] - b[0]
    });
    for (var sb in tsx) {
      if (index == tsx[sb][1]) {
        tsx[sb][2] = e.currentTarget.id;
      }
    }

    for (let sb in tsx) {
      txarr[sb] = tsx[sb][2];
    }
    str = txarr.join('_');
    this.setData({
      goods: goods
    });
    this.checkPrice();
    for (var x in that.data.goods.spec_goods_price) {
      if (that.data.goods.spec_goods_price[x].key == str) {
        that.setData({
          cost_price: that.data.goods.spec_goods_price[x].price,
          store_count: parseInt(that.data.goods.spec_goods_price[x].store_count),
          market_price: that.data.goods.spec_goods_price[x].productprice
        })
      }
    }

    if (ss_t.length != goods.goods.goods_spec_list.length) {
      let cost_price, store_count, market_price;
      for (let x in that.data.goods.spec_goods_price) {
        cost_price = that.data.goods.spec_goods_price[x].price,
          store_count = that.data.goods.spec_goods_price[x].store_count,
          market_price = that.data.goods.spec_goods_price[x].productprice
        if ((that.data.goods.spec_goods_price[x].key).indexOf(item_id) > -1) {
          break;
        }
      }
      that.setData({
        cost_price,
        store_count,
        market_price
      })
    } else { }


  },
  // joinshop
  joinshop: function () {
    var that = this;
    if (that.data.isclick) {
      wx.navigateTo({
        url: '../shop/shop?id=' + that.data.shopId,
      })
    } else { }
  },
  //收藏商品
  addCollect: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    var that = this;
    if (that.data.favorite == 1) {
      that.data.favorite = 0;
    } else {
      that.data.favorite = 1;
    }
    server.sendRequest({
      url: '?r=wxapp.member.favorite.toggle',
      data: {
        utoken: utoken,
        id: goods_id,
        isfavorite: that.data.favorite
      },
      method: 'GET',
      success: function (res) {
        report.collect_goods(goods_id, that.data.goods.goods.goods_name, that.data.favorite)
        that.setData({
          favorite: res.data.result.isfavorite
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  bindMinus: function (e) {
    var num = this.data.goods_num;

    if (this.data.minbuy > 0) {
      if (num > this.data.minbuy) {
        num--;
      } else {
        wx.showToast({
          title: '单次最少购买' + this.data.minbuy + this.data.goods.goods.unit,
          image: '../../../images/goodsNote.png',
          duration: 2000
        })
      }

    } else {
      if (num > 1) {
        num--;
      }
    }
    this.setData({
      goods_num: parseInt(num)
    });
  },
  bindManual: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
    this.setData({
      goods_num: parseInt(num)
    });
  },
  bindPlus: function (e) {
    var num = this.data.goods_num;
    var limiNum;
    num++;

    if (this.data.usermaxbuy > 0 && this.data.maxbuy >= this.data.usermaxbuy || this.data.maxbuy == 0 && this.data.usermaxbuy) {
      limiNum = parseInt(this.data.usermaxbuy - this.data.order_goodscount - this.data.cartNum);
      if (num >= limiNum) {
        num = limiNum;
        wx.showToast({
          title: '限购' + this.data.usermaxbuy + this.data.goods.goods.unit,
          image: '../../../images/goodsNote.png',
          duration: 2000
        })
      }
    } else if (this.data.maxbuy < this.data.usermaxbuy && this.data.maxbuy > 0) {
      limiNum = parseInt(this.data.maxbuy);
      if (num >= limiNum) {
        num = limiNum;
        wx.showToast({
          title: '单次最多购买' + this.data.maxbuy + this.data.goods.goods.unit,
          image: '../../../images/goodsNote.png',
          duration: 2000
        })
      }
    }
    if (this.data.isSkill) {
      if (parseInt(this.data.skillGoods.seckill_maxbuy) < this.data.skillGoods.seckill_order.selfcount + this.data.cartNum + num) {
        wx.showModal({
          title: '提示',
          content: '该秒杀商品限购' + this.data.skillGoods.seckill_maxbuy + this.data.goods.goods.unit,
          showCancel: false,
          success: function () {
            return false;
          }
        });
        return false;
      }
    }
    this.setData({
      goods_num: parseInt(num)
    });
  },
  getEvaluationData(res, level) {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.goods.detail.get_comment_list",
      showToast: false,
      data: {
        id: res,
        page: 1,
        level: level,
        showImage: false,
      },
      method: "GET",
      success: function (res) {
        that.setData({
          list: res.data.result.list
        })
        for (var x in that.data.list) {

          arr.push(that.data.list[x].content);
        }
        for (let i = 0; i < arr.length; i++) {
          WxParse.wxParse('reply' + i, 'html', arr[i], that);
          if (i === arr.length - 1) {
            WxParse.wxParseTemArray("replyTemArray", 'reply', arr.length, that)
          }
        }
      }
    })
  },
  // 这是评价的接口
  getEvaluation: function (res) {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.goods.detail.get_comments&id=" + res,
      showToast: false,
      method: "GET",
      success: function (res) {

        that.setData({
          Evaluation: res.data.result
        })
        var count = res.data.result.count;
        if (count.all != '0' || count.bad != '0' || count.good != '0' || count.normal != '0' || count.pic != '0') {
          that.getEvaluationData(goodsId, 'all');
        }

      }
    })
  },
  register: function (midZ) {
    server.sendRequest({
      method: 'POST',
      url: '?r=wxapp.commission.register&utoken=' + utoken + '&mid=' + midZ,
      data: {},
      success: function (res) { }
    })
  },
  // tab切换
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({
      tabClasss: classs,
      tab: index
    })
  },
  count_down: function (that) {
    that.setData({
      clock: that.date_format(that.data.total_micro_second)
    });
    if (that.data.total_micro_second <= 0) {
      that.data.clock.clock_hasTime = '';
      that.data.clock = that.data.clock.clock_hasTime
      that.setData({
        clock: that.data.clock,
        isSkill: false,
      });
      return;
    }
    timer = setTimeout(function () {
      that.data.total_micro_second -= 1000;
      that.count_down(that);
    }, 1000)
  },
  date_format: function (micro_second) {
    var second = Math.floor(micro_second / 1000);
    var hr = fill_zero_prefix(Math.floor(second / 3600));
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
    var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
    var dataTime = {
      'clock_hour': hr,
      'clock_min': min,
      'clock_sec': sec,
      'micro_sec': micro_sec,
      'clock_all': hr + ":" + min + ":" + sec,
      'clock_end': '已结束',
      'clock_hasTime': true,
    }
    return dataTime;
  },
  getGoodsById: function (goodsId) {
    var content;
    var goodsInfo;
    var that = this
    var utoken = wx.getStorageSync("utoken");
    var url
    if (that.data.storeid) {
      url = '?r=wxapp.goods.detail&id=' + goodsId + '&utoken=' + utoken + '&storeid=' + that.data.storeid
    } else {
      url = '?r=wxapp.goods.detail&id=' + goodsId + '&utoken=' + utoken
    }

    server.sendRequest({
      url: url,
      showToast: false,
      method: 'GET',
      success: function (res) {
        if (res.data.status != 1) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          return false;
        }
        let isGrogShop = res.data.result.fivgType == 29 ? true : false;
        let enoughList = res.data.result.saleset.enoughs || [];
        if (enoughList.length > 2) {
          enoughList = enoughList.slice(0, 2);
        }
        that.setData({
          start_time: server.getsec(),
          loading: false,
          goods_attr_list: res.data.result.goods_attr_list,
          name_shop: res.data.result.shop.merchname,
          description_shop: res.data.result.shop.desc,
          skillGoods: res.data.result.goods,
          showtotal: res.data.result.goods.showtotal,
          isGrogShop,
          enoughList,
          allEnoughList: res.data.result.saleset.enoughs || [],
        })
        if (res.data.result.shop.logo) {
          that.setData({
            logo_shop: res.data.result.shop.logo,
          })
        }
        if (res.data.result.spec_goods_price != null && that.data.skillGoods.seckill) {
          that.data.skillGoods.cost_price = res.data.result.spec_goods_price[0].price;
          that.setData({
            skillGoods: that.data.skillGoods
          })
        } else {
          that.setData({
            skillGoods: that.data.skillGoods
          })

        }
        if (that.data.skillGoods.seckill == 1) {
          var seckill_endtime = (that.data.skillGoods.seckill_endtime) * 1000;
          var seckill_nowtime = (that.data.skillGoods.seckill_nowtime) * 1000;
          var seckill_starttime = (that.data.skillGoods.seckill_starttime) * 1000;
          var total_micro_second = seckill_endtime - seckill_nowtime;
          if (seckill_starttime <= seckill_nowtime && seckill_endtime >= seckill_nowtime) {
            that.setData({
              isSkill: true,
              total_micro_second: total_micro_second
            })
            that.count_down(that);
          } else if (seckill_endtime < seckill_nowtime) {
            that.setData({
              isSkill: false,
            })
          } else if (seckill_starttime > seckill_nowtime) {
            that.setData({
              isSkill: false,
            })
          }
        } else {
          that.setData({
            isSkill: false
          })
        }
        if (res.data.result.shop.id) {
          that.setData({
            isclick: true,
            shopId: res.data.result.shop.id
          })
        } else {
          that.setData({
            isclick: false,
          })
        }
        if (res.data.result.goods.cash == 1) {
          that.setData({
            cashD: that.data.cash
          })
        }
        if (res.data.result.goods.quality == 1) {
          that.setData({
            qualityD: that.data.quality
          })
        }
        if (res.data.result.goods.seven == 1) {
          that.setData({
            sevenD: that.data.seven
          })
        }
        if (res.data.result.goods.invoice == 1) {
          that.setData({
            invoiceD: that.data.invoice
          })
        }
        if (res.data.result.goods.repair == 1) {

          that.setData({
            repairD: that.data.repair
          })
        }
        if (res.data.result.goods.keywords1) {
          that.setData({
            keywords: res.data.result.goods.keywords1
          })
        }
        if (res.data.result.goods.goods_content != '') {
          content = res.data.result.goods.goods_content;
          WxParse.wxParse('contain', 'html', content, that, 5);
        }
        goodsInfo = res.data.result;
        if (goodsInfo.goods.cost_price) {
          that.setData({
            cost_price: goodsInfo.goods.cost_price
          })
        } else {
          var s_price = goodsInfo.spec_goods_price[0].price
          that.setData({
            cost_price: s_price,
            // 修改原价
            market_price: goodsInfo.spec_goods_price[0].productprice
          })
        }
        var tmp = new Array();
        var ss_t = new Array();
        if (goodsInfo.goods.goods_spec_list && goodsInfo.goods.goods_spec_list.length) {
          for (let j = 0; j < goodsInfo.goods.goods_spec_list.length; j++) {
            for (let m = 0; m < goodsInfo.goods.goods_spec_list[j].length; m++) {
              if (goodsInfo.goods.goods_spec_list[j][m]['isClick'] == 1) {
                var str = {};
                var s_s = 0;
                s_s = goodsInfo.goods.goods_spec_list[j].length + '_' + goodsInfo.goods.goods_spec_list[j][m]['item_id']
                ss_t.push(s_s);
              }
            }
            if (goodsInfo.goods.goods_spec_list[j][0]) {
              if (goodsInfo.goods.goods_spec_list[j][0].src) {
                num = j;
                for (let x in goodsInfo.goods.goods_spec_list[j]) {
                  img_arr.push(goodsInfo.goods.goods_spec_list[j][x].src)
                }
              }
            }
          }
          that.setData({
            img_arr: img_arr
          })
          var t = [];
          for (var x in ss_t) {
            var x = ss_t[x].split("_")
            t.push(x)
          }
          t.sort();
          var str = [];
          for (var x in t) {
            str.push(t[x][1])
          }
          str = str.join("_");
        }
        if (goodsInfo.spec_goods_price) {
          for (var x in goodsInfo.spec_goods_price) {
            if (goodsInfo.spec_goods_price[x].key == str) {
              that.setData({
                store_count: parseInt(goodsInfo.spec_goods_price[x].store_count)
              })

            }
          }
        };
        if (res.data.result.isfavorite == '0') {
          var favorite = 0;
        } else {
          var favorite = 1;
        }
        that.setData({
          order_goodscount: parseInt(goodsInfo.goods.order_goodscount) ? parseInt(goodsInfo.goods.order_goodscount) : 0,
          maxbuy: parseInt(goodsInfo.goods.maxbuy),
          minbuy: parseInt(goodsInfo.goods.minbuy),
          usermaxbuy: parseInt(goodsInfo.goods.usermaxbuy),
          seckillMmaxbuy: parseInt(that.data.skillGoods.seckill_maxbuy),
          goods: goodsInfo,
          favorite,
          store_count: parseInt(goodsInfo.goods.store_count)
        });
        if (that.data.minbuy > 0) {
          that.setData({
            goods_num: that.data.minbuy
          })
        }
        that.checkPrice();
      }
    })
  },
  checkPrice: function () {
    var that = this
    var goods = this.data.goods;
    var spec = "";
    if (!goods.goods || !goods.goods.goods_spec_list) {
      return
    }
    if (goods.goods.shop_price) {
      this.setData({
        price: goods.goods.shop_price
      });
    }
    for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
      for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
        if (goods.goods.goods_spec_list[i][j].isClick == 1) {
          if (spec == "") {
            spec = goods.goods.goods_spec_list[i][j].item_id
          } else {
            spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }
    }
    if (spec.split('_').length == goods.goods.goods_spec_list.length) {
      var specs = spec.split('_').sort().join('_');
      var options = goods['spec_goods_price'];
      var price = 0;
      if (!(options instanceof Array)) {
        this.setData({
          price
        });
        return false;
      }
      for (var i = 0; i < options.length; i++) {
        var option_specs = options[i].key.split('_').sort().join('_');
        if (specs.indexOf(option_specs) >= '0') {
          that.setData({
            optionid: options[i].id
          })
          price = options[i].price;
          break;
        }
      }
      this.setData({
        price: price,
      });
    }

  },
  //立即购买
  bug: function () {
    //这里判断库存数量做出相应提示
    var storeCount = this.data.store_count;
    var goodsNum = this.data.goods_num;
    if (parseInt(storeCount) <= 0 || parseInt(goodsNum) > parseInt(storeCount)) {
      wx.showModal({
        title: '提示',
        content: '该商品库存不足，无法完成下单！',
        showCancel: false,
        success: function () {
          return false;
        }
      });
      return false;
    }
    if (this.data.usermaxbuy > 0 && this.data.usermaxbuy <= parseInt(this.data.cartNum + this.data.order_goodscount)) {
      wx.showToast({
        title: '数量已达上限',
        image: '../../../images/goodsNote.png',
        duration: 2000
      })
      return;
    }
    if (this.data.isSkill) {
      if (parseInt(this.data.skillGoods.seckill_maxbuy) <= parseInt(this.data.skillGoods.seckill_order.selfcount) + parseInt(this.data.cartNum)) {
        wx.showModal({
          title: '提示',
          content: '该商品在购物车中数量或已购买的数量已达上限噢~~',
          showCancel: false,
          success: function () {
            return false;
          }
        });
        return false;
      }
    }
    var that = this;
    var goods = that.data.goods;
    utoken = wx.getStorageSync("utoken");
    var optionid = that.data.optionid;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_num = that.data.goods_num;
    if (utoken != '') {
      if (goods.goods.goods_spec_list != null) {
        if (that.data.name_arr == undefined) {
          wx.showModal({
            showCancel: false,
            content: '请选择规格',
            success: function (res) {
              if (res.confirm) { }
            }
          })
          return
        }
        for (let x in that.data.goods.goods.goods_spec_list) {
          if (!that.data.name_arr[x]) {
            wx.showModal({
              showCancel: false,
              content: '请选择规格',
              success: function (res) {
                if (res.confirm) { }
              }
            })
            return
          }
        }
      }
      if (that.data.mid) {
        wx.navigateTo({
          url: '../../order/checkout/checkout?cartIds=' + that.data.goodsId + "&mid=" + that.data.mid
        })
      } else {
        wx.navigateTo({
          url: '../../order/ordersubmit/index?id=' + goods_id + '&optionid=' + optionid + "&total=" + goods_num + '&uid=' + this.data.uid,
        });
      }
      return;
    } else {
      // 重新拉取授权
      server.getUserInfo(function () {
        //  这里写获取授权成功后的回调
      });
    }
  },
  //加入购物车
  addCart: function (e) {
    var that = this;
    var formId = e.detail.formId;
    var goods = that.data.goods;
    if (goods.goods.goods_spec_list != null) {
      if (that.data.name_arr == undefined) {
        wx.showModal({
          showCancel: false,
          content: '请选择规格',
          success: function (res) {
            if (res.confirm) { }
          }
        })
        return
      }
      var storeCount = that.data.store_count;
      var goodsNum = that.data.goods_num;
      if (parseInt(storeCount) <= 0 || parseInt(goodsNum) > parseInt(storeCount)) {
        wx.showModal({
          title: '提示',
          content: '该商品库存不足，无法完成下单！',
          showCancel: false,
          success: function () {
            return false;
          }
        });
        return false;
      }
      for (let x in that.data.goods.goods.goods_spec_list) {
        if (!that.data.name_arr[x]) {
          wx.showModal({
            showCancel: false,
            content: '请选择规格',
            success: function (res) {
              if (res.confirm) { }
            }
          })
          return
        }
      }
    }
    if (that.data.usermaxbuy > 0 && that.data.usermaxbuy <= parseInt(that.data.cartNum + that.data.order_goodscount)) {
      wx.showToast({
        title: '数量已达上限',
        image: '../../../images/goodsNote.png',
        duration: 2000
      })
      return;
    }
    if (that.data.isSkill) {
      if (parseInt(that.data.skillGoods.seckill_maxbuy) <= parseInt(that.data.skillGoods.seckill_order.selfcount) + parseInt(that.data.cartNum)) {
        wx.showModal({
          title: '提示',
          content: '该商品在购物车中数量或已购买的数量已达上限噢~~',
          showCancel: false,
          success: function () {
            return false;
          }
        });
        return false;
      }
    }
    server.sendRequest({
      url: "?r=wxapp.formid.getFormidList",
      data: {
        utoken: utoken,
        formId: formId
      },
      method: "GET",
      success: function (res) { }
    })
    this.addbuyCart({
      success: function (res) {
        if (res.data.status == 1) {
          that.none();
          that.getTotal(goodsId);
          wx.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          });
        }
      }
    });
  },
  // 门店商品进行添加 购物车
  storeAddcart() {
    var that = this;
    var pages = getCurrentPages(); 
    var prevPage = pages[pages.length - 2];   //上一页
    prevPage.setData({
      storeGoodsId: that.data.goodsId
    })
    wx.navigateBack({})
  },
  //加入购物车1
  addCart1: function (e) {
    var that = this;
    if (e.detail.formId) {
      var formId = e.detail.formId;
      server.sendRequest({
        url: "?r=wxapp.formid.getFormidList",
        data: {
          utoken: utoken,
          formId: formId
        },
        method: "GET",
        success: function (res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '已加入购物车',
              icon: 'success',
              duration: 2000
            });
            that.none();
            that.getTotal(goodsId);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'error',
              duration: 1000
            });
          }
        }
      })
    }
    this.addbuyCart({
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 1000
          });
          that.none();
          that.getTotal(goodsId);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          });
        }
      }
    });
  },
  addbuyCart: function (param) {
    var that = this
    var goods = that.data.goods;
    var optionid = that.data.optionid;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_num = that.data.goods_num;
    if (goods.goods.goods_spec_list != null) {
      if (optionid == 0) {
        that.move();
        return;
      }
    }
    server.sendRequest({
      url: '?r=wxapp.member.cart.add',
      data: {
        utoken: utoken,
        id: goods_id,
        optionid: optionid,
        total: goods_num,
        diyformdata: false
      },
      method: 'GET',
      success: function (res) {
        report.add_carts(that.data.goodsId, that.data.goods.goods.goods_name);
        typeof param.success == 'function' && param.success(res);
      }
    })

  },
  showCartToast: function () {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    });
    wx.reLaunch({
      url: '../../cart/cart'
    })
  },
  onShareAppMessage: function () {
    var that = this;
    if (that.data.mid) {
      var str = '/pages/goods/detail/detail?objectId=' + that.data.goodsId + "&mid=" + that.data.mid + '&share=' + 'share'
    } else {
      var str = '/pages/goods/detail/detail?objectId=' + that.data.goodsId + '&share=' + 'share'
    }
    report.share_goods(that.data.goodsId, that.data.goods.goods.goods_name);
    return {
      title: that.data.goods.goods.goods_name,
      path: str,
      imageUrl: that.data.goods.gallery[0].image_url,
    }
  },
  onShareTimeline(){
    var that = this;
    if (that.data.mid) {
      var str = '/pages/goods/detail/detail?objectId=' + that.data.goodsId + "&mid=" + that.data.mid + '&share=' + 'share'
    } else {
      var str = '/pages/goods/detail/detail?objectId=' + that.data.goodsId + '&share=' + 'share'
    }
    report.share_goods(that.data.goodsId, that.data.goods.goods.goods_name);
    return {
      title: that.data.goods.goods.goods_name,
      query: str,
      imageUrl: that.data.goods.gallery[0].image_url,
    }
  },
  currChange: function (e) {
    var that = this;
    that.setData({
      currImage: e.detail.current,
      currIndex: e.detail.current + 1
    })
  },
  getImgIndex: function (e) {
    var that = this;
    var curindex = e.currentTarget.dataset.index;
    that.setData({
      imgUrlIndex: curindex,
      currIndex: curindex + 1
    })
  },
  joinImage: function (res) {
    var that = this;
    that.setData({
      imgUrls: res.currentTarget.dataset.img,
      imgLength: res.currentTarget.dataset.img.length
    })
    if (!that.data.showImage) {
      that.setData({
        showImage: true
      })
    }
  },
  // 显示隐藏商品属性
  move: function () {
    if (this.data.usermaxbuy > 0 && this.data.maxbuy >= this.data.usermaxbuy || this.data.maxbuy == 0 && this.data.usermaxbuy) {
      if ((this.data.order_goodscount + this.data.cartNum) >= this.data.usermaxbuy) {
        wx.showModal({
          title: '',
          content: '该商品在购物车中数量或已购买的数量已达上限',
          showCancel: false,
          success: function (res) {
            if (res.confirm) { } else if (res.cancel) { }
          }
        })
        return;
      }
    } else if (this.data.maxbuy < this.data.usermaxbuy && this.data.maxbuy > 0) {
      if (this.data.maxbuy > 0) {
        if (this.data.cartNum >= this.data.maxbuy) {
          wx.showModal({
            title: '',
            content: '该商品在购物车中数量已达上限',
            showCancel: false,
            success: function (res) {
              if (res.confirm) { }
            }
          })
          return;
        }
      }
    }
    this.setData({
      buy: 1,
    })
    var anima1 = wx.createAnimation({
      timingFunction: 'ease-in',
    }).translate(0, -600).step({
      duration: 500
    });
    var anima2 = wx.createAnimation({
      duration: 500
    }).opacity(1).step();
    this.setData({
      animationData: anima1.export(),
      anima2: anima2.export(),

    })
    this.setData({
      pf: true
    })
  },
  //门店里立即购买
  handlenowBuy(){},
  none: function () {
    var anima1 = wx.createAnimation({
      timingFunction: 'ease-in',
    }).translate(0, 600).step({
      duration: 300
    });
    var anima2 = wx.createAnimation({
      duration: 100
    }).opacity(0).step();
    this.setData({
      animationData: anima1.export(),
      anima2: anima2.export(),
      pf: false
    })
    this.setData({
      buy: '',
    })
  },
  showImages: function () {
    var that = this;
    that.setData({
      showImage: false
    })
  },
  onUnload: function () {
    let that = this;
    clearTimeout(timer);
    if (that.data.isVr == true) {
      report.see_vrshow_goods(that.data.goodsId, that.data.goods.goods.goods_name, that.data.start_time, server.getsec())
    } else {
      report.see_store_goods(that.data.goodsId, that.data.goods.goods.goods_name, that.data.start_time, server.getsec())
    }

  },
  onHide: function () {
    clearTimeout(timer);
    let that = this;
    if (that.data.isVr == true) {
      report.see_vrshow_goods(that.data.goodsId, that.data.goods.goods.goods_name, that.data.start_time, server.getsec())
    } else {
      report.see_store_goods(that.data.goodsId, that.data.goods.goods.goods_name, that.data.start_time, server.getsec())
    }
  },

  openShare: function (e) {
    var that = this;
    that.setData({
      isShare: true,
      isbottom: true,
      showPoster: false,
    })


  },
  closeShare: function () {
    var that = this;
    that.setData({
      isShare: false,
      showPoster: false,
    })
  },
  closeTop: function () {
    var that = this;
    that.setData({
      isShare: false
    })
  },
  poster: function () {
    var posterData = {},
      that = this;
    that.setData({
      isbottom: false,
      showPoster: true
    })
    if (that.data.myshop) {
      posterData = {
        utoken: utoken,
        goodsid: that.data.goodsId,
        comefrom: 'commission'
      }
    } else {
      posterData = {
        utoken: utoken,
        goodsid: that.data.goodsId,
      }
    }
    server.sendRequest({
      url: "?r=poster",
      data: posterData,
      method: "GET",
      success: function (res) {
        if (res.data.result) {
          that.setData({
            posterImg: res.data.result.url
          })
          setTimeout(function () {
            that.setData({
              showPosterImg: true
            })
          }, 1000)
        }
      }
    })
  },
  wiatSecond: function () {
    var that = this;
  },
  // 保存图片
  saveImg: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.posterImg,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            that.setData({
              showPosterImg: true
            })
            wx.showModal({
              title: '提示',
              content: '图片保存成功',
              confirmColor: '#FF6A6A',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    isShare: false
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  // 预览图片
  previewImage: function () {
    var that = this;
    wx.previewImage({
      urls: [that.data.posterImg]
    })
  },
  // 轮播图图片预览
  previewImageSwiper: function (e) {
    var that = this;
    var img_view = []
    for (var i in that.data.goods.gallery) {
      img_view.push(that.data.goods.gallery[i].image_url)
    }
    wx.previewImage({
      current: that.data.goods.gallery[e.currentTarget.dataset.current].image_url,
      urls: img_view
    })
  },
  noMove: function () {
    return false;
  },
  closeShare: function (e) {
    var that = this;
    that.setData({
      isShare: false
    })
  },
  // 前往自制客服
  toChat() {
    console.log(1111)
    console.log(this.data.myshop)
    if (this.data.myshop) {
      if (!wx.getStorageSync('userInfo')) {
        wx.navigateTo({
          url: '/pages/getAuth/index'
        })
      } else {
        // myshop     店铺id
        // logo_shop  店铺logo
        wx.navigateTo({
          url: '/pages/chat/index?storeid=' + this.data.myshop + '&logo=' + this.data.logo_shop + '&name=' + this.data.name_shop
        })
      }

    } else {
      wx.navigateTo({
        url: '/pages/chat/index?storeid=' + this.data.myshop + '&logo=' + this.data.logo_shop + '&name=' + this.data.name_shop
      })
    }
  },
  /* 显示/隐藏弹框 */
  handleModal(e) {
    let type = e.currentTarget.dataset.type;
    let space = e.currentTarget.dataset.space;
    let animate = wx.createAnimation({
      timingFunction: 'ease',
    }).top(space).step({
      duration: 100,
    })

    this.setData({
      [type]: animate.export(),
    })
  },
  stopMove() {
    return false;
  },
  /* 优惠券列表 */
  getCouponList() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.getlist',
      method: 'get',
      data: {
        utoken,
        comefrom: 'goodsdetail'
      },
      success: res => {
        if (res.data.status == 1) {
          let couponList = res.data.result.list || [];
          if (couponList.length > 3) {
            couponList = couponList.slice(0, 3);
          }

          this.setData({
            couponList,
            allCouponList: res.data.result.list || []
          })
        }
      }
    })
  },
  /* 领取 */
  handleGetCoupon(e) {
    let id = e.currentTarget.dataset.id;
    let utoken = wx.getStorageSync('utoken');
    server.getUserInfo(() => {
      server.sendRequest({
        url: '?r=wxapp.sale.coupon.detail.pay',
        data: {
          utoken,
          id,
          jie: 1
        },
        method: 'GET',
        success: res => {
          if (res.data.status == 1) {
            server.sendRequest({
              url: '?r=wxapp.sale.coupon.detail.payresult',
              data: {
                utoken: utoken,
                logid: res.data.result.logid
              },
              method: 'GET',
              success: function (res) {
                wx.showToast({
                  title: '领取成功',
                  icon: 'none',
                })
              },
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        }
      })
    })
  }

});