var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
var utoken = wx.getStorageSync("utoken");
var t1, t2, t, ss;
var arr = [],
  arrImg = [],
  timer,
  name_arr = [],
  img_arr = [],
  num, page = 1,
  imageUrl = [],
  // level = 'all',
  goodsId,
  tsx = [],
  txarr = [];
Page({

  data: {
    indicatorDots: false,
    animationData: {},
    goods_attr: false,
    textStates: ["", "view-btns-text-select"],
  },

  onLoad: function(res) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    that.setData({
      mid: res.mid,
      id: res.id
    })
    var that = this;
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.activity.bargin.optionDetail',
      data: {
        utoken: utoken,
        mid: that.data.mid,
        id: that.data.id
      },
      success: function(res) {
        if (res.data.result.res.content != '') {
          var content = res.data.result.res.content;
          WxParse.wxParse('contain', 'html', content, that, 5);
        }
        if (res.data.result.res.goods_spec_list) {
          that.setData({
            goods_spec_list: res.data.result.res.goods_spec_list,
            spec_goods_price: res.data.result.res.spec_goods_price,
            cost_price: res.data.result.res.spec_goods_price[0].price,
            store_count: res.data.result.res.spec_goods_price[0].store_count,
            goods_attr: true
          })
        }
        let t1 = new Date(res.data.result.res.start_time);
        t2 = new Date(res.data.result.res.end_time.replace(/-/g, "/"));
        that.setData({
          data: res.data.result
        })
      }
    })
  },
  checkTime: function(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  onShow: function(e) {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.activity.bargin.optionDetail', //原来的接口?r=wxapp.activity.bargin.detail
      data: {
        utoken: utoken,
        mid: that.data.mid,
        id: that.data.id
      },
      success: function(res) {
        t2 = new Date(res.data.result.res.end_time.replace(/-/g, "/"));
        that.setData({
          data: res.data.result
        })
        t = setInterval(function() {
          if (ss < '0') {
            that.setData({
              time: "活动已结束"
            })
            clearInterval(t);
          } else {
            var ts = (t2) - (new Date());
            var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);
            var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);
            var mm = parseInt(ts / 1000 / 60 % 60, 10);
            ss = parseInt(ts / 1000 % 60, 10);
            var test = ('剩余:' + dd.toString() + "天" + hh.toString() + "时" + mm.toString() + "分" + ss.toString() + "秒")
            that.setData({
              time: test
            })
          }
        }, 1000);
      }
    })
  },
  onUnload: function(options) {
    clearInterval(t);
  },
  tosubmitorder: function(res) {
    var that = this;
    if (that.data.goods_spec_list) {
      if (that.data.name_arr == undefined || that.data.name_arr.length != that.data.goods_spec_list.length) {
        wx.showModal({
          showCancel: false,
          content: '请选择规格',
          success: function(res) {
            if (res.confirm) {}
          }
        })
        return
      }
    }
    if (that.data.goods_attr) {
      wx.navigateTo({
        url: "/pages/order/ordersubmit/index?id=" + res.currentTarget.dataset.id + "&bargainOptionid=" + that.data.optionid + "&mid=" + that.data.mid
      })
    } else {
      wx.navigateTo({
        url: "/pages/order/ordersubmit/index?id=" + res.currentTarget.dataset.id + "&mid=" + that.data.mid
      })
    }
  },
  onUnload: function() {
    var that = this;
    that.cancelModel();
  },
  tobargain: function(res) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    if (that.data.goods_spec_list) {
      if (that.data.name_arr == undefined || that.data.name_arr.length != that.data.goods_spec_list.length) {
        wx.showModal({
          showCancel: false,
          content: '请选择规格',
          success: function(res) {
            if (res.confirm) {}
          }
        })
        return
      }
    }
    server.getNewToken(() => {
      if (that.data.data.act_swi && that.data.data.act_swi.id) {
        wx.showModal({
          title: '砍价提示',
          content: '您已经发起过一次本商品的砍价活动,是否立即查看？',
          success: function(res) {
            if (res.confirm) {
              if (that.data.goods_attr) {
                wx.navigateTo({
                  url: "../bargain/index?id=" + that.data.data.act_swi.id + "&mid=" + that.data.mid + "&optionid=" + that.data.optionid
                })
              } else {
                wx.navigateTo({
                  url: "../bargain/index?id=" + that.data.data.act_swi.id + "&mid=" + that.data.mid
                })
              }
            }
          }
        })

      } else {
        server.sendRequest({
          method: 'GET',
          url: '?r=wxapp.activity.bargin.optionJoin', //原来的接口?r= wxapp.activity.bargin.join
          data: {
            utoken: utoken,
            mid: that.data.mid,
            goods: that.data.id,
            optionid: that.data.goods_attr ? that.data.optionid : ''
          },
          success: function(res) {
            if (res.data.status > 0) {
              if (that.data.goods_attr) {
                wx.navigateTo({
                  url: "../bargain/index?id=" + res.data.result.id + "&mid=" + that.data.mid + '&optionid=' + that.data.optionid
                })
              } else {
                wx.navigateTo({
                  url: "../bargain/index?id=" + res.data.result.id + "&mid=" + that.data.mid
                })
              }
            } else if (res.data.status < 0) {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          }
        })
      }
    })

  },
  tolist: function() {
    var that = this;
    wx.reLaunch({
      url: "/pages/member/index/index"
    })
  },
  toback: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //选择商品属性
  propClick: function(e) {
    var that = this;
    var pos = e.currentTarget.dataset.child;
    var index = e.currentTarget.dataset.parents;
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
    var goods = this.data.data
    if (that.data.goods_spec_list && that.data.spec_goods_price[pos].price != "null") {
      this.setData({
        cost_price: that.data.spec_goods_price[pos].price,
        store_count: that.data.spec_goods_price[pos].store_count
      })
    } else {
      this.setData({
        cost_price: that.data.data.cost_price,
        store_count: that.data.data.store_count
      })
    }
    for (var i = 0; i < that.data.goods_spec_list[index].length; i++) {
      if (i == pos) {
        that.data.goods_spec_list[index][pos].isClick = 1;
        arr[index] = e.currentTarget.id;
      } else
        that.data.goods_spec_list[index][i].isClick = 0;
      arr[index] = that.data.goods_spec_list[index][0].item_id;

    }
    let item_id

    var ss_t = new Array();
    for (var j = 0; j < that.data.goods_spec_list.length; j++) {
      for (var m = 0; m < that.data.goods_spec_list[j].length; m++) {
        if (that.data.goods_spec_list[j][m]['isClick'] == 1) {
          var s_s = 0;
          s_s = that.data.goods_spec_list[j].length + '_' + that.data.goods_spec_list[j][m]['item_id']
          ss_t.push(s_s);
          item_id = that.data.goods_spec_list[j][m]['item_id'];
        }
      }
    }

    var str = [];
    for (var ssss in that.data.goods_spec_list) {
      var ts = [];
      ts.push(that.data.goods_spec_list[ssss].length)
      ts.push(ssss);
      if (tsx.length < that.data.goods_spec_list.length) {
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
      goods_spec_list: that.data.goods_spec_list
    });
    this.checkPrice();
    for (var x in that.data.spec_goods_price) {
      if (that.data.spec_goods_price[x].key == str) {
        that.setData({
          cost_price: that.data.spec_goods_price[x].price,
          store_count: that.data.spec_goods_price[x].store_count,
        })
      }
    }

    if (ss_t.length != that.data.goods_spec_list.length) {
      let cost_price, store_count;
      for (let x in that.data.spec_goods_price) {
        cost_price = that.data.spec_goods_price[x].price,
          store_count = that.data.spec_goods_price[x].store_count;
        if ((that.data.spec_goods_price[x].key).indexOf(item_id) > -1) {
          break;
        }
      }
      that.setData({
        cost_price,
        store_count
      })
    } else {}


  },
  checkPrice: function() {
    var that = this
    var goods = this.data.data;
    var spec = "";
    if (!that.data.goods_spec_list) {
      return
    }


    for (var i = 0; i < that.data.goods_spec_list.length; i++) {
      for (var j = 0; j < that.data.goods_spec_list[i].length; j++) {
        if (that.data.goods_spec_list[i][j].isClick == 1) {
          if (spec == "") {
            spec = that.data.goods_spec_list[i][j].item_id
          } else {
            spec = spec + "_" + that.data.goods_spec_list[i][j].item_id
          }
        }
      }
    }
    if (spec.split('_').length == that.data.goods_spec_list.length) {
      var specs = spec.split('_').sort().join('_');
      var options = goods.res['spec_goods_price'];
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
  //展示商品属性
  showModel: function() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(-600).step();
    this.setData({
      animationData: animation.export()
    })
  },
  //隐藏属性
  cancelModel: function() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(600).step();
    this.setData({
      animationData: animation.export()
    })
  }
})