var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
var utoken = wx.getStorageSync("utoken");
var id;
var spec = []
var arr_img = []
var name_arr = []
var num = 1
var arr = [],
  tsx = [],
  txarr = [];
var ggId = []
var priceId;
var t, time_arr = [];
Page({
  data: {
    loading: true,
    groupPrice: '',
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    isclick: '',
    galleryHeight: getApp().screenWidth,
    data: {},
    priceId: '',
    singCost: '',
    isOrNoSing: '',
    isverify: '',
    storeids: '',
    shareIcon: false,
    bannerIndex: 0,
    groupData: {}
  },
  onLoad: function (res) {
    if (res.share) {
      this.setData({
        shareIcon: true
      })
    }
    var that = this;
    id = res.id
    utoken = wx.getStorageSync("utoken");
  },
  onShow: function () {
    var that = this;
    tsx = []
    txarr = [];
    that.setData({
      name_arr: []
    })
    this.loadPageData(),
      this.loadgroupNum();
  },
  onHide() {
    clearInterval(t)
  },
  onUnload() {
    clearInterval(t)
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  handleBannerChange(e) {
    this.setData({
      bannerIndex: e.detail.current
    })
  },
  loadPageData: function () {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups.goods.testGoods',
      showToast: false,
      data: {
        utoken: utoken,
        id: id
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status == '-1001') {
          wx.showModal({
            showCancel: false,
            content: res.data.msg,
          })
        }
        if (res.data.result) {
          that.setData({
            data: res.data.result,
            loading: false,
            isOrNoSing: res.data.result.goods.single,
            isverify: res.data.result.goods.isverify,
            storeids: res.data.result.goods.storeids
          })
        }
        if (res.data.result.goods.content != '') {
          var content = res.data.result.goods.content;
          WxParse.wxParse('contain', 'html', content, that, 5);
        }
        if (arr_img.length == 0) {
          arr_img = res.data.result.goods.thumb
          that.setData({
            arr_img: arr_img
          })
        }
        that.setData({
          groupPrice: res.data.result.goods.groupsprice,
          store_count: res.data.result.goods.goodsnum,
          singCost: res.data.result.goods.singleprice
        })
      }
    })
  },
  toback: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  // 单购
  tocorder: function (res) {
    if (this.data.data.goods_spec_list != null) {
      if (this.data.name_arr == undefined || this.data.name_arr.length == 0) {
        my.showToast({
          content: '请选择规格',
          success: function (res) {
            if (res.confirm) { }
          }
        })
        return
      }
      for (let x in this.data.data.goods_spec_list) {
        if (!this.data.name_arr[x]) {
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
    wx.reLaunch({
      url: '../confirmOrder/index?id=' + res.currentTarget.dataset.id + "&type=single" + '&nameArr=' + this.data.name_arr + '&priceId=' + this.data.priceId + '&groupPrice=' + this.data.singCost
    })
  },
  // 团购
  tooperation: function (res) {
    if (this.data.data.goods_spec_list != null) {
      if (this.data.name_arr == undefined || this.data.name_arr.length == 0) {
        my.showToast({
          content: '请选择规格',
          success: function (res) {
            if (res.confirm) { }
          }
        })
        return
      }
      for (let x in this.data.data.goods_spec_list) {
        if (!this.data.name_arr[x]) {
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
    wx.navigateTo({
      url: '../openGroups/index?id=' + res.currentTarget.dataset.id + "&type=groups" + '&name_arr=' + this.data.name_arr + '&priceId=' + this.data.priceId + '&groupPrice=' + this.data.groupPrice + '&isverify=' + this.data.isverify + '&storeids=' + this.data.storeids
    })
  },
  //获取参团人数
  loadgroupNum() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups.goods.fightGroups',
      data: {
        utoken: utoken,
        id: id
      },
      method: 'GET',
      success: function (res) {
        for (let x = 0; x < res.data.result.teams.length; x++) {
          time_arr.push(res.data.result.teams[x].residualtime);
          if (res.data.result.teams[x].nickname.length > 10) {
            res.data.result.teams[x].nickname = (res.data.result.teams[x].nickname).slice(0, 8)
          }
        }
        t = setInterval(function () {
          var subarr = [];
          for (let x = 0; x < time_arr.length; x++) {
            if (time_arr[x] > 0) {
              time_arr[x] = time_arr[x] - 1;
              subarr[x] = that.time(time_arr[x]);
            } else {
              subarr[x] = '';
            }
          }
          that.setData({
            arr: subarr
          })
        }, 1000);
        that.setData({
          groupData: res.data.result,
        });
      }
    })
  },
  // 一键参团
  handletocorder: function (res) {
    var that = this;
    wx.reLaunch({
      url: "../confirmOrder/index?teamid=" + res.currentTarget.dataset.id + "&type=groups&id=" + id
    })
  },

  // 一键开团
  toopen: function (res) {
    var that = this;
    if (this.data.data.goods_spec_list != null) {
      if (this.data.name_arr == undefined || this.data.name_arr.length == 0) {
        my.showToast({
          content: '请选择规格',
          success: function (res) {
            if (res.confirm) { }
          }
        })
        return
      }
      for (let x in this.data.data.goods_spec_list) {
        if (!this.data.name_arr[x]) {
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
 
    wx.navigateTo({
      url: '../confirmOrder/index?id=' + res.currentTarget.dataset.id + "&type=groups" + "&heads=1" + '&nameArr=' + this.data.name_arr + "&priceId=" + that.data.priceId + '&groupPrice=' + that.data.groupPrice + '&isverify=' + that.data.isverify + '&storeids=' + that.data.storeids
    })
  },
  onShareAppMessage: function () {
    var that = this;
    var str = '/packageA/pages/groupbuy/detail/index?id=' + id + '&share=' + 'share'
    return {
      title: that.data.data.title,
      path: str
    }
  },
  // 显示隐藏商品属性
  move: function () {
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
      pf: true,
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
      name_arr: name_arr,
    })
    var goods = this.data.data;
    if (goods.spec_goods_price && goods.spec_goods_price[pos].price != "null") {
      this.setData({
        groupPrice: goods.spec_goods_price[pos].price,
        store_count: goods.spec_goods_price[pos].store_count,
        singCost: goods.spec_goods_price[pos].cost,
      })
    } else {
      this.setData({
        groupPrice: goods.goods.groupsprice,
        store_count: goods.goods.goodsnum,
        singCost: goods.goods.singleprice,
      })
    }
    for (var i = 0; i < goods.goods_spec_list[index].length; i++) {
      if (i == pos) {
        goods.goods_spec_list[index][pos].isClick = 1;
        arr[index] = e.currentTarget.id;
        if (goods.goods_spec_list[index][pos].src) {
          arr_img = goods.goods_spec_list[index][pos].src
          that.setData({
            arr_img: arr_img
          })
        } else {
          that.setData({
            arr_img: arr_img
          })
        }
      } else {
        goods.goods_spec_list[index][i].isClick = 0;
        arr[index] = goods.goods_spec_list[index][0].item_id;
      }
    }
    let item_id

    var ss_t = new Array();
    for (var j = 0; j < goods.goods_spec_list.length; j++) {
      for (var m = 0; m < goods.goods_spec_list[j].length; m++) {
        if (goods.goods_spec_list[j][m]['isClick'] == 1) {
          var s_s = 0;
          s_s = goods.goods_spec_list[j].length + '_' + goods.goods_spec_list[j][m]['item_id']
          ss_t.push(s_s);
          item_id = goods.goods_spec_list[j][m]['item_id'];
        }
      }
    }
    var str = [];
    for (var ssss in that.data.data.goods_spec_list) {
      var ts = [];
      ts.push(that.data.data.goods_spec_list[ssss].length)
      ts.push(ssss);
      if (tsx.length < that.data.data.goods_spec_list.length) {
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
    console.log('1', txarr)
    str = txarr.join('_');
    this.setData({
      data: goods
    });
    this.checkPrice();
    for (var x in that.data.data.spec_goods_price) {
      if (that.data.data.spec_goods_price[x].key == str) {
        that.setData({
          groupPrice: that.data.data.spec_goods_price[x].price,
          store_count: that.data.data.spec_goods_price[x].store_count,
          singCost: that.data.data.spec_goods_price[x].cost,
          priceId: that.data.data.spec_goods_price[x].id
        })
      }
    }
    if (ss_t.length != goods.goods_spec_list.length) {
      let groupPrice, store_count, singCost;
      for (let x in that.data.data.spec_goods_price) {
        groupPrice = that.data.data.spec_goods_price[x].price,
          store_count = that.data.data.spec_goods_price[x].store_count,
          priceId = that.data.data.spec_goods_price[x].id,
          singCost = that.data.data.spec_goods_price[x].cost
        if ((that.data.data.spec_goods_price[x].key).indexOf(item_id) > -1) {
          break;
        }
      }
      that.setData({
        groupPrice,
        store_count,
        priceId,
        singCost
      })
    } else { }


  },
  checkPrice: function () {
    var that = this
    var goods = this.data.data;
    var spec = "";
    if (!goods.goods || !goods.goods_spec_list) {
      return
    }
    if (goods.goods.shop_price) {
      this.setData({
        price: goods.goods.shop_price
      });
    }

    for (var i = 0; i < goods.goods_spec_list.length; i++) {
      for (var j = 0; j < goods.goods_spec_list[i].length; j++) {
        if (goods.goods_spec_list[i][j].isClick == 1) {
          if (spec == "") {
            spec = goods.goods_spec_list[i][j].item_id
          } else {
            spec = spec + "_" + goods.goods_spec_list[i][j].item_id
          }
        }
      }
    }
    if (spec.split('_').length == goods.goods_spec_list.length) {
      var specs = spec.split('_').sort().join('_');
      var options = goods['spec_goods_price'];
      var price = 0;
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
        price: price
      });
    }

  },
  time: function (time) {
    var h = parseInt(time / 60 / 60);
    var m = parseInt(time / 60 % 60);
    var s = parseInt(time % 60)
    var t = `${h}:${m}:${s}`;
    return t;
  },
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
      // name_arr: []
    })
  },
  previewImageSwiper: function (e) {
    var that = this
    var img_view = []
    for (var i in that.data.data.goods.thumb_url) {
      img_view.push(that.data.data.goods.thumb_url[i])
    }
    wx.previewImage({
      current: that.data.data.goods.thumb_url[e.currentTarget.dataset.current],
      urls: img_view
    })
  }
})