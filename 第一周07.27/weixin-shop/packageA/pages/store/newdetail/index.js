var server = require('../../../../utils/server.js');
var utoken = wx.getStorageSync("utoken");

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
let arr = [],
  arrIndex = [],
  storeid, coupon_list = [],
  arr_img = [],
  specData = [],
  name_arr = [],
  tsx = [],
  txarr = [],
  num,
  page = 1,
  arrB = [],
  mode;
Page({
  data: {
    loading: true,
    left: 0,
    right: 0,
    tab: 1,
    cart: 2,
    cart_detail: 1,
    goods: 1,
    allprice: 0.00,
    tableid: "",
    showLoading: false,
    storeid: '',
    category: [],
    goods: '',
    goodThumbSpec: '',
    usermaxbuy: 0,
    goods_num: 1,
    maxbuy: 0,
    minbuy: 0,
    order_goodscount: 0,
    usermaxbuy: 0,
    cartNum: 0,
    addSpecId: '',
    addSpecTitle: '',
    addSpecGuiGe: '',
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    goodsDetail: 1,
    optionid: 0,
    x: 0,
    y: 0,
    //预约商品
    serveCate: [],
    serveGoods: [],
    page: 1,
    serveCateId: '',
    moreserve: false,
  },
  onLoad: function(e) {
    var that = this;
    name_arr = [];
    let storeid = e.id || e.storeid;
    that.setData({
      storeid,
      name_arr: name_arr,
    })
    utoken = wx.getStorageSync("utoken");
    that.getAllData();
    that.getSeverCate();
  },
  //获取预约服务分类
  getSeverCate() {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.shop.takingOrder.serviceCatergory',
      data: {
        utoken: utoken,
        storeid: that.data.storeid
      },
      method: 'GET',
      success: function(res) {
        if (res.data.status == 1) {
          let cateID;
          if (res.data.result.data.parent[0]) {
            cateID = res.data.result.data.parent[0].id
          }
          that.setData({
            serveCate: res.data.result.data.parent,
            serveCateId: cateID
          })
          that.getserveGoods();
        } else {
          console.log(res.msg)
        }
      }
    })
  },
  // 获取预约服务商品
  getserveGoods() {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.shop.takingOrder.getServiceGoodsList',
      data: {
        category_id: that.data.serveCateId,
        page: that.data.page,
        utoken: wx.getStorageSync('utoken'),
        storeid: that.data.storeid
      },
      method: 'GET',
      success: function(res) {
        if (res.data.status == 1) {
          let serveGoods = this.data.page == 1 ? [] : that.data.serveGoods;
          let moreserve = res.data.result.goods.list.length == 0 ? false : true;
          serveGoods.push(...res.data.result.goods.list);
          that.setData({
            serveGoods,
            moreserve
          })
        }
      }
    })
  },
  //切换预约服务分类
  handlSeveCate(e) {
    this.setData({
      serveCateId: e.currentTarget.dataset.id,
      page: 1
    })
    this.getserveGoods();
  },
  //加载更多预约商品
  getmoreServe() {
    console.log(222)
    if (this.data.moreserve) {
      this.setData({
        page: ++this.data.page
      })
      this.getserveGoods();
    }
  },
  toseverdetail(e) {
    wx.navigateTo({
      url: '/packageA/pages/services/detail/index?objectId=' + e.currentTarget.dataset.id
    })
  },
  //获取商品
  getAllData: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    page = 1
    arrB = []
    server.sendRequest({
      url: '?r=wxapp.store.list.getGoods',
      showToast: false,
      data: {
        utoken,
        storeid: that.data.storeid,
        page: 1,
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          category: res.data.result.category.parent,
          goods: res.data.result.goods,
          loading: false,
          showLoading: false,
          storeData: res.data.result.store,
          covers: [{
            latitude: res.data.result.store.lat,
            longitude: res.data.result.store.lng,
            iconPath: '../../../images/location.png'
          }]
        })
        for (let x in res.data.result.goods) {
          arrB.push(res.data.result.goods[x]);
        }
      }
    });
  },

  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  select_left: function(e) {
    var that = this;
    page = 1
    arrB = []
    that.setData({
      left: e.currentTarget.dataset.index,
      right: e.currentTarget.dataset.id
    })

    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.store.list.getGoods',
      showToast: false,
      data: {
        utoken,
        storeid: that.data.storeid,
        page: 1,
        cid: that.data.right
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          category: res.data.result.category.parent,
          goods: res.data.result.goods,
          loading: false,
          showLoading: false
        })
        for (let x in res.data.result.goods) {
          arrB.push(res.data.result.goods[x]);
        }
      }
    });
  },
  shuaxinHou: function() {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    // page = 1
    // arrB = []
    server.sendRequest({
      url: '?r=wxapp.store.list.getGoods',
      showToast: false,
      data: {
        utoken,
        storeid: that.data.storeid,
        page: 1,
        cid: that.data.right
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          category: res.data.result.category.parent,
          goods: res.data.result.goods,
          loading: false,
          showLoading: false
        })
      }
    });
  },
  tab: function(e) {
    var that = this;
    that.setData({
      tab: e.currentTarget.dataset.index
    });
    if (that.data.tab == 2) {
      that.setData({
        cart_detail: 1
      });
    }
  },
  // 将商品数据加入购物车
  add: function(e) {
    var that = this;
    var no = 1;

    if (that.data.storeData.isopen) {
      // 显示购物车
      if (that.data.cart == '1') {
        that.setData({
          cart: 2
        })
      }
      if (that.data.goodsDetail == '2') {
        that.setData({
          goodsDetail: 1
        })
      }
      server.sendRequest({
        url: '?r=wxapp.store.cart.add',
        data: {
          utoken: utoken,
          id: e.currentTarget.dataset.id,
          optionid: e.currentTarget.dataset.optionid,
          total: that.data.goods_num,
          diyformdata: false,
          storeid: that.data.storeid
        },
        method: 'GET',
        success: function(res) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          that.getBuyCartData()
          that.none()
        }
      })
    }

  },
  //带规格的添加到购物车
  addSpec: function(e) {
    name_arr = [];
    txarr = []
    tsx = []
    var that = this
    that.setData({
      addSpecTitle: e.currentTarget.dataset.title
    })
    for (var i in that.data.goods) {
      if (e.currentTarget.dataset.id == that.data.goods[i].goods.id) {
        that.setData({
          specData: that.data.goods[i].goods_spec_list,
          goodThumbSpec: that.data.goods[i].goods.thumb,
          groupPrice: that.data.goods[i].goods.marketprice,
          store_count: that.data.goods[i].goods.total,
          addSpecId: e.currentTarget.dataset.id,
        })
        if (arr_img.length == 0) {
          arr_img = that.data.goodThumbSpec
          that.setData({
            arr_img: arr_img
          })
        }
      }
    }
    that.move()
  },
  // 带规格的完成
  added: function(e) {
    var that = this;
    var no = 1;
    // 显示购物车
    if (that.data.cart == '1') {
      that.setData({
        cart: 2
      })
    }
    if (that.data.goodsDetail == '2') {
      that.setData({
        goodsDetail: 1
      })
    }
    if (utoken != '') {
      var goodsB = that.data.goods
      for (var t in goodsB) {
        if (that.data.addSpecId == goodsB[t].goods.id) {
          if (goodsB[t].goods_spec_list != null) {
            if (that.data.name_arr == undefined) {
              wx.showModal({
                showCancel: false,
                content: '请选择规格',
                success: function(res) {
                  if (res.confirm) {}
                }
              })
              return
            }
            for (let x in goodsB[t].goods_spec_list) {
              if (!that.data.name_arr[x]) {
                wx.showModal({
                  showCancel: false,
                  content: '请选择规格',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
                return
              }
            }
          }
        }
      }
    }
    server.sendRequest({
      url: '?r=wxapp.store.cart.add',
      data: {
        utoken: utoken,
        id: e.currentTarget.dataset.id,
        optionid: e.currentTarget.dataset.optionid,
        total: that.data.goods_num,
        diyformdata: false,
        storeid: that.data.storeid
      },
      method: 'GET',
      success: function(res) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        that.getBuyCartData()
        // that.getBuyCartList()
        that.none()
      }
    })
  },
  // 显示隐藏商品属性
  move: function() {
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
    txarr = []
    tsx = []
    this.setData({
      pf: true
    })
  },
  //选择商品属性
  propClick: function(e) {
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
    var goodsB = this.data.goods
    for (var t in goodsB) {
      if (that.data.addSpecId == goodsB[t].goods.id) {
        if (goodsB[t].spec_goods_price && goodsB[t].spec_goods_price[pos].price != "null") {
          this.setData({
            groupPrice: goodsB[t].spec_goods_price[pos].price,
            store_count: goodsB[t].spec_goods_price[pos].store_count,
          })
        } else {
          this.setData({
            groupPrice: goodsB[t].goods.marketprice,
            store_count: goodsB[t].goods.total,
          })
        }
        for (var i = 0; i < goodsB[t].goods_spec_list[index].length; i++) {
          if (i == pos) {
            goodsB[t].goods_spec_list[index][pos].isClick = 1;
            arrIndex[index] = e.currentTarget.id;
            if (goodsB[t].goods_spec_list[index][pos].src) {
              arr_img = goodsB[t].goods_spec_list[index][pos].src
              that.setData({
                arr_img: arr_img
              })
            } else {
              that.setData({
                arr_img: arr_img
              })
            }
          } else {
            goodsB[t].goods_spec_list[index][i].isClick = 0;
            arrIndex[index] = goodsB[t].goods_spec_list[index][0].item_id;
          }

        }
        let item_id

        var ss_t = new Array();
        for (var j = 0; j < goodsB[t].goods_spec_list.length; j++) {
          for (var m = 0; m < goodsB[t].goods_spec_list[j].length; m++) {
            if (goodsB[t].goods_spec_list[j][m]['isClick'] == 1) {
              var s_s = 0;
              s_s = goodsB[t].goods_spec_list[j].length + '_' + goodsB[t].goods_spec_list[j][m]['item_id']
              ss_t.push(s_s);
              item_id = goodsB[t].goods_spec_list[j][m]['item_id'];
            }
          }
        }
        var str = [];
        for (var ssss in that.data.goods[t].goods_spec_list) {
          var ts = [];
          ts.push(that.data.goods[t].goods_spec_list[ssss].length)
          ts.push(ssss);
          if (tsx.length < that.data.goods[t].goods_spec_list.length) {
            tsx.push(ts)
          }
        }
        tsx.sort(function(a, b) {
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
          goods: goodsB,
          specData: goodsB[t].goods_spec_list
        });
        this.checkPrice();
        for (var x in that.data.goods[t].spec_goods_price) {
          if (that.data.goods[t].spec_goods_price[x].key == str) {
            that.setData({
              groupPrice: that.data.goods[t].spec_goods_price[x].price,
              store_count: that.data.goods[t].spec_goods_price[x].store_count,
            })
          }
        }
        if (ss_t.length != goodsB[t].goods_spec_list.length) {
          let groupPrice, store_count;
          for (let x in that.data.goods[t].spec_goods_price) {
            groupPrice = that.data.goods[t].spec_goods_price[x].price,
              store_count = that.data.goods[t].spec_goods_price[x].store_count
            if ((that.data.goods[t].spec_goods_price[x].key).indexOf(item_id) > -1) {
              break;
            }
          }
          that.setData({
            groupPrice,
            store_count,
            // priceId
          })
        } else {}
      }
    }
  },
  checkPrice: function() {
    var that = this
    var goodsB = this.data.goods;
    for (var t in goodsB) {
      if (that.data.addSpecId == goodsB[t].goods.id) {
        var spec = "";
        if (!goodsB[t].goods || !goodsB[t].goods_spec_list) {
          return
        }
        if (goodsB[t].goods.shop_price) {
          this.setData({
            price: goodsB[t].goods.shop_price
          });
        }
        for (var i = 0; i < goodsB[t].goods_spec_list.length; i++) {
          for (var j = 0; j < goodsB[t].goods_spec_list[i].length; j++) {
            if (goodsB[t].goods_spec_list[i][j].isClick == 1) {
              if (spec == "") {
                spec = goodsB[t].goods_spec_list[i][j].item_id
              } else {
                spec = spec + "_" + goodsB[t].goods_spec_list[i][j].item_id
              }
            }
          }
        }
        if (spec.split('_').length == goodsB[t].goods_spec_list.length) {
          var specs = spec.split('_').sort().join('_');
          var options = goodsB[t]['spec_goods_price'];
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
      }
    }
  },
  none: function() {
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
    name_arr = [];
    arr_img = []
    txarr = []
    tsx = []
    this.setData({
      buy: '',
      name_arr: name_arr,
      arr_img: arr_img,
      goods_num: 1
    })
    // this.getAllData()
    this.shuaxinHou()
  },
  bindMinus: function(e) {
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
      goods_num: num
    });
  },
  bindManual: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
    this.setData({
      goods_num: num
    });
  },
  bindPlus: function(e) {
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

    this.setData({
      goods_num: num
    });
  },
  // 减
  reduce: function(e) {
    var that = this;
    if (arr != '') {
      var index = e.currentTarget.dataset.index;
      var total = parseInt(e.currentTarget.dataset.total) - 1
      server.sendRequest({
        url: '?r=wxapp.store.cart.update',
        data: {
          utoken: utoken,
          id: e.currentTarget.dataset.carid,
          optionid: e.currentTarget.dataset.optionid,
          total: total,
          storeid: that.data.storeid
        },
        method: 'GET',
        success: function(res) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 500
          })
          that.getBuyCartData()
          that.getBuyCartList()
        }
      })
    }
  },
  // 加
  add_n: function(e) {
    var that = this;
    parseInt(num)
    if (arr != '') {

      var index = e.currentTarget.dataset.index;

      var total = parseInt(e.currentTarget.dataset.total) + 1
      server.sendRequest({
        url: '?r=wxapp.store.cart.update',
        data: {
          utoken: utoken,
          id: e.currentTarget.dataset.carid,
          optionid: e.currentTarget.dataset.optionid,
          total: total,
          storeid: that.data.storeid
        },
        method: 'GET',
        success: function(res) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 500
          })
          that.getBuyCartData()
          that.getBuyCartList()
        }
      })
    }
  },
  // 清空购物车
  o_clear: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.store.cart.remove_all',
      data: {
        utoken,
        storeid: that.data.storeid,
      },
      method: 'get',
      success: function(res) {}
    });
    arr = [];
    num = 0;
    that.getBuyCartList()
    that.getBuyCartData()
  },
  // 商品详情
  detail: function(e) {
    var that = this;
    wx.navigateTo({
      // url: '../../../packageA/pages/community/storeGoodDetail/storeGoodDetail?id=' + e.currentTarget.dataset.id + '&store=' + 'I am store'
      // url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id + '&store=' + 'I am store' + '&storeid=' + that.data.storeid
      url: '/packageA/pages/services/detail/index?objectId=' + e.currentTarget.dataset.id

    })
    var detail = e.currentTarget.dataset
    that.setData({
      detail: detail
    });
    that.setData({
      goodsDetail: 2
    });
  },
  // 退出商品详情
  cancer: function() {
    var that = this;
    that.setData({
      goods: 1
    });
  },
  // 购物车列表
  cart_detail: function(e) {
    var that = this;
    if (that.data.cart_detail == '1') {
      that.setData({
        cart_detail: 2
      })
    } else {
      that.setData({
        cart_detail: 1
      })
    }
    that.getBuyCartList()
  },
  to_buy: function() {
    var that = this;

    if (that.data.storeData.isopen) {
      wx.navigateTo({
        url: '/pages/order/ordersubmit/index?storeid=' + that.data.storeid
      })
    }


  },
  getUrlParam: function(str, name) {
    var str = "?" + str;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = str.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  },
  //获取购物车数量
  getBuyCartData: function() {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.store.cart.getCartNumNew",
      showToast: false,
      data: {
        utoken: utoken,
        storeid: that.data.storeid
      },
      method: "GET",
      success: function(res) {
        num = res.data.result.cartcount
        if (res.data.result.totalprice) {
          that.setData({
            allprice: res.data.result.totalprice.toFixed(2)
          })
        }
        that.setData({
          num: num,
          // allprice:that.data.allprice,
          buyCartnull: res.data.result.cartcount
        })
      }
    })
  },
  // 获取购物车列表
  getBuyCartList: function() {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.store.cart.getNewCart",
      showToast: false,
      data: {
        utoken: utoken,
        storeid: that.data.storeid
      },
      method: "GET",
      success: function(res) {
        console.log(res, 9999)
        if (res.data.result == '') {
          that.setData({
            arr: '',
            allprice: 0.00,
            num: 0,
            haha: res.data.result
          });
        }
        let storeIds = that.data.storeid.trim();
        arr = res.data.result[storeIds]
        if (arr != undefined) {
          that.setData({
            arr: arr,
          })
        }
      }
    })
  },
  intoFace: function() {
    wx.navigateTo({
      url: '../../store/facetoface/index?storeid=' + this.data.storeid + '&address=' + this.data.storeData.address
    })
  },
  button: function() {
    var that = this
    page = page + 1;
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.store.list.getGoods',
      data: {
        utoken,
        storeid: that.data.storeid,
        page: page,
        cid: that.data.right
      },
      success: function(res) {
        if (res.data.status == 1) {
          if (res.data.result == '') {
            page = page - 1
          } else {
            for (let x in res.data.result.goods) {
              arrB.push(res.data.result.goods[x])
            }
          }
          that.setData({
            goods: arrB,
          })
        }
      }
    })
  },
})