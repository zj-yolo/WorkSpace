var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
var content;
var utoken = wx.getStorageSync("utoken");
var i = 1,
  level = 'all',
  page = 1,
  arr = [];
var storeid;
let img_arr = [],
  num, name_arr = [],
  tsx = [],
  txarr = [];
var app = getApp();
var pageData = {
  data: {
    id: "",
    tab:1,
    sum: 1,
    width: Math.ceil(wx.getSystemInfoSync().windowHeight),
    title: "",
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    select: 'all',
    refresh: false,
    curDateIndex: 0,
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    buy: '',
    showIndex: false,
  },

  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    that.data.id = options.objectId;
    this.loadPageData();
    this.getEvaluation();
    this.getEvaluationData(level);
    name_arr = [];
    wx.showShareMenu({
    });
    var pages = getCurrentPages()
    if (pages.length == 1) {
      this.setData({
        showIndex: true
      })
    }
  },
  onShow: function() {},
  // 获取预约商品的数据
  loadPageData: function() {
    let that = this,
      img_arr = [],
      tsx = [];

    server.sendRequest({
      url: '?r=wxapp.services.detail&id=' + that.data.id,
      method: 'GET',
      success: function(res) {
        let goodsInfo = res.data.result;
        that.setData({
          data: res.data.result,
          title: res.data.result.goods.goods_name,
          price: res.data.result.goods.price,
          img: res.data.result.gallery['0'].image_url,
          price_list: res.data.result.price_list,
          hasoption: res.data.result.goods.hasoption
        });
        if (res.data.result.store && res.data.result.store[0]) {
          that.setData({
            store: res.data.result.store[0]
          })
          app.globalData.store = res.data.result.store[0]
        } else {
          app.globalData.store = '';
        }

        content = res.data.result.goods.goodsdetail;
        WxParse.wxParse('article', 'html', content, that, 5);


        let tmp = new Array(),
          ss_t = new Array();

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
                  // 规格图片
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
                cost_price: goodsInfo.spec_goods_price[x].price,
                store_count: goodsInfo.spec_goods_price[x].store_count
              })

            }
          }
        };




      }
    })
  },
  // 这是评价的接口
  getEvaluation: function() {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.services.detail.get_comments&id=" + that.data.id,
      method: "GET",
      success: function(res) {
        that.setData({
          Evaluation: res.data.result
        })
      }
    })
  },
  tabslide(e){
    // console.log(e.currentTarget.dataset.index);
    this.setData({tab:e.currentTarget.dataset.index})
  },
  backToIndex: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
  // 获取评价数据接口
  getEvaluationData(level) {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.services.detail.get_comment_list",
      data: {
        id: that.data.id,
        page: 1,
        level: level,
        showImage: false,
      },
      method: "GET",
      success: function(res) {
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
  // 选择评价
  select: function(res) {
    var that = this;;
    level = res.currentTarget.dataset.index;
    that.setData({
      refresh: false
    });
    page = 1;
    that.getEvaluationData(res.currentTarget.dataset.index)
    that.setData({
      select: res.currentTarget.dataset.index
    })
  },
  // 显示图片
  joinImage: function(res) {
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
  // 隐藏图片
  showImages: function() {
    var that = this;
    that.setData({
      showImage: false
    })
  },
  // 拨打电话
  call: function(e) {
    let id = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ["拨打电话", "取消"],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: id
          })
        }
      },
      fail: function(res) {
      }
    })
  },
  // 评论分页
  bottom: function() {
    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true
    });
    page = page + 1;
    server.sendRequest({
      url: "?r=wxapp.services.detail.get_comment_list",
      data: {
        id: that.data.goodsId,
        page: 1,
        level: level,
        showImage: false,
        page: page
      },
      method: "GET",
      success: function(res) {
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
  // 打开地图显示店铺位置
  addr: function(res) {
    wx.openLocation({
      latitude: parseFloat(res.currentTarget.dataset.lat),
      longitude: parseFloat(res.currentTarget.dataset.lng),
      name: res.currentTarget.dataset.name,
      scale: 28
    })
  },
  // 跳转到其他预约商品
  order_goods: function(e) {
    wx.navigateTo({
      url: "/pages/services/detail/index?objectId=" + e.currentTarget.dataset.objectId
    })
  },
  //预约时间，显示
  reservas: function() {
    var that = this;
    wx.navigateTo({
      url: '../calendarService/index?cartIds=' + that.data.id + '&amount=' + that.data.sum + '&title=' + that.data.title + '&price=' + that.data.price + '&img=' + that.data.img + '&store=1&optionid=&name_arr=',
    })
  },
  // 页面跳转
  getToPage: function(event) {
    server.getToPage(event);
  },
  // 添加数量
  add: function() {
    i = i + 1;
    this.setData({
      sum: i
    })
  },
  // 减少数量
  sub: function() {
    if (i == 0 || i == 1) {
      i = 1
    } else {
      i = i - 1;
    }
    this.setData({
      sum: i
    })
  },
  // 提交预约表单
  yuyue: function() {
    var that = this;
    var Data = {
      id: that.data.id,
      goodsSum: that.data.sum,
      time: that.data.cur_year + '-' + that.data.cur_month + '-' + that.data.indexs + ' ' + that.data.time,
      utoken: utoken
    }
    wx.navigateTo({
      url: '../../order/ordersubmit/index?cartIds=' + that.data.id + '&amount=' + that.data.sum + '&title=' + that.data.title + '&price=' + that.data.price + '&img=' + that.data.img + '&time=' + (that.data.cur_year + '-' + that.data.cur_month + '-' + that.data.indexs) + '&store=1&optionid=&name_arr=',
    })
  },
  //进入日期页面
  goToSelectDate: function() {
    var that = this;
    that.reservas();
  },
  //进入订单页
  goToOrder: function(e) {
    var that = this;
    let index = e.currentTarget.dataset.index
    that.setData({
      curDateIndex: e.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '../../order/ordersubmit/index?cartIds=' + that.data.id + '&amount=' + that.data.sum + '&title=' + that.data.title + '&price=' + that.data.price_list[index].oprice + '&img=' + that.data.img + '&time=' + that.data.price_list[index].thisdate + '&store=1&optionid=&name_arr=',
    })
  },
  // 显示隐藏商品属性
  move: function() {
    let that = this,
      goods = that.data.data;

    if (this.data.buy == '1') {

      if (goods.goods.goods_spec_list != null) {
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
        for (let x in that.data.data.goods.goods_spec_list) {
          if (!that.data.name_arr[x]) {
            wx.showModal({
              showCancel: false,
              content: '请选择规格',
              success: function(res) {
                if (res.confirm) {
                }
              }
            })
            return
          }
        }
      }

      this.none();
      // 需要传递的数据
      wx.navigateTo({
        url: '../calendarService/index?cartIds=' + that.data.id + '&amount=' + that.data.sum + '&title=' + that.data.title + '&price=' + that.data.price + '&img=' + that.data.img + '&store=1&optionid=' + that.data.optionid + '&name_arr=' + that.data.name_arr,
      })

    } else {
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
        anima2: anima2.export()
      })
      this.setData({
        pf: true
      })

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
    this.setData({
      buy: '',
    })
  },
  //选择商品属性
  propClick: function(e) {
    let that = this,
      pos = e.currentTarget.dataset.pos,
      index = e.currentTarget.dataset.index,
      goods = that.data.data,
      item_id,
      ss_t = new Array(),
      str = [];
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

    if (goods.spec_goods_price && goods.spec_goods_price[pos].price != "null") {
      this.setData({
        cost_price: goods.spec_goods_price[pos].price,
        store_count: goods.spec_goods_price[pos].store_count
      })
    } else {
      this.setData({
        cost_price: goods.goods.cost_price,
        store_count: goods.goods.store_count
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

    for (var j = 0; j < goods.goods.goods_spec_list.length; j++) {
      for (var m = 0; m < goods.goods.goods_spec_list[j].length; m++) {
        if (goods.goods.goods_spec_list[j][m]['isClick'] == 1) {
          var s_s = 0;
          s_s = goods.goods.goods_spec_list[j].length + '_' + goods.goods.goods_spec_list[j][m]['item_id']
          ss_t.push(s_s);
          item_id = goods.goods.goods_spec_list[j][m]['item_id'];
        }
      }
    }

    for (var ssss in that.data.data.goods.goods_spec_list) {
      var ts = [];
      ts.push(that.data.data.goods.goods_spec_list[ssss].length)
      ts.push(ssss);
      if (tsx.length < that.data.data.goods.goods_spec_list.length) {
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
      data: goods
    });
    for (var x in that.data.data.spec_goods_price) {
      if (that.data.data.spec_goods_price[x].key == str) {

        that.setData({
          optionid: that.data.data.spec_goods_price[x].id,
          cost_price: that.data.data.spec_goods_price[x].price,
          store_count: that.data.data.spec_goods_price[x].store_count
        })
      }
    }

    if (ss_t.length != goods.goods.goods_spec_list.length) {
      let cost_price, store_count, market_price;
      for (let x in that.data.data.spec_goods_price) {
        cost_price = that.data.data.spec_goods_price[x].price,
          store_count = that.data.data.spec_goods_price[x].store_count
        if ((that.data.data.spec_goods_price[x].key).indexOf(item_id) > -1) {
          break;
        }
      }
      that.setData({
        cost_price,
        store_count,
      })
    } else {}
  },
  // 轮播图图片预览
  previewImageSwiper: function(e) {
    var that = this
    var img_view = []
    for (var i in that.data.data.gallery) {
      img_view.push(that.data.data.gallery[i].image_url)
    }
    wx.previewImage({
      current: that.data.data.gallery[e.currentTarget.dataset.current].image_url,
      urls: img_view
    })
  },
  onShareAppMessage: function() {
    var that = this;
    var str = '/packageA/pages/services/detail/index?objectId=' + that.data.data.goods.goods_id;
    return {
      title: that.data.data.goods.goods_name,
      path: str,
      imageUrl: that.data.data.goods.gallery[0].image_url,
    }
  },
};

Page(pageData)