
  function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
  }
  var server = require('../../../../utils/server');
  var WxParse = require('../../../../wxParse/wxParse.js');
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
      cartNum:0,
      shareIcon: false

    },
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh()
    },
    onLoad: function (options) {
      var that = this;
      if (res.share) {
        this.setData({
          shareIcon: true
        })
      }
      utoken = wx.getStorageSync("utoken");
      if (wx.getStorageSync('customerserver')) {
        that.setData({
          customerserver: wx.getStorageSync('customerserver')
        })
      }
      goodsId = options.id;
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
      that.setData({
        goodsId: goodsId
      })
      that.getGoodsById(goodsId);
      that.getEvaluation(goodsId);
      name_arr = [];
    },
    //页面加载获取购物车数量
    onShow: function () {
      var that = this;
      utoken = wx.getStorageSync("utoken");
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
      // that.getTotal(goodsId);
    },
    onReachBottom: function () {
      if (this.data.tab == 2) {
        this.bottom();
      }
    },
    bottom: function () {
      var that = this;
      if (that.data.refresh) return;
      that.setData({
        refresh: true
      });
      page = page + 1;
      console.log(that.data.goodsId)
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
          console.log(that.data.list);
        }
      })
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
          // console.log(count)

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
      server.sendRequest({
        url: '?r=wxapp.goods.detail&id=' + goodsId + '&utoken=' + utoken,
        showToast: false,
        method: 'GET',
        success: function (res) {
          that.setData({
            loading: false,
            goods_attr_list: res.data.result.goods_attr_list,
            name_shop: res.data.result.shop.merchname,
            description_shop: res.data.result.shop.desc,
            skillGoods: res.data.result.goods,
            showtotal: res.data.result.goods.showtotal
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
            // console.log('详情', content)
            WxParse.wxParse('contain', 'html', content, that, 5);
          }
          goodsInfo = res.data.result;
          if (goodsInfo.goods.cost_price) {
            that.setData({
              cost_price: goodsInfo.goods.cost_price
            })
          } else
          //(goodsInfo.spec_goods_price && goodsInfo.spec_goods_price[0] && goodsInfo.spec_goods_price[0].price != 'null')
          {
            var s_price = goodsInfo.spec_goods_price[0].price
            that.setData({
              cost_price: s_price,
              // 修改原价
              market_price: goodsInfo.spec_goods_price[0].productprice
            })
            console.log(that.data.market_price)
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
                  // cost_price: goodsInfo.spec_goods_price[x].price,
                  store_count: goodsInfo.spec_goods_price[x].store_count
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
            order_goodscount: parseInt(goodsInfo.goods.order_goodscount) ? parseInt(goodsInfo.goods.order_goodscount):0,
            maxbuy: parseInt(goodsInfo.goods.maxbuy),
            minbuy: parseInt(goodsInfo.goods.minbuy),
            usermaxbuy: parseInt(goodsInfo.goods.usermaxbuy),
            goods: goodsInfo,
            favorite,
            store_count: goodsInfo.goods.store_count
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
    //立即购买
    bug: function () {
      //这里判断库存数量做出相应提示
      var storeCount = this.data.store_count;
      var goodsNum = this.data.goods_num;
      if (storeCount <= 0 || goodsNum > storeCount) {
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
      if(this.data.usermaxbuy > 0 && this.data.usermaxbuy <= parseInt(this.data.cartNum+this.data.order_goodscount)){
        wx.showToast({
          title: '数量已达上限',
          image: '../../../images/goodsNote.png',
          duration: 2000
        })
        return;
  }


      if (this.data.isSkill){
        if (parseInt(this.data.skillGoods.seckill_maxbuy) <= parseInt(this.data.skillGoods.seckill_order.selfcount) + parseInt(this.data.cartNum)) {
          // console.log(this.data.skillGoods.seckill_maxbuy)
          // console.log(this.data.skillGoods.seckill_order.count)
          // console.log(this.data.cartNum)
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
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
              return
            }
          }
          // if (!that.data.name_arr || that.data.goods.goods.goods_spec_list.length != that.data.name_arr.length) {
          // wx.showModal({
          // showCancel: false,
          // content: '请选择规格',
          // success: function(res) {
          // if (res.confirm) {
          // console.log('用户点击确定')
          // }
          // }
          // })
          // return
          // }
        }

        if (that.data.mid) {
          wx.navigateTo({
            url: '../../order/checkout/checkout?cartIds=' + that.data.goodsId + "&mid=" + that.data.mid
          })

        } else {
          wx.navigateTo({
            url: '../../order/ordersubmit/index?id=' + goods_id + '&optionid=' + optionid + "&total=" + goods_num
          });
        }
        // } else {
        // WxParse.wxParse('article', 'html', res.data.msg, that, 5);
        // wx.showToast({
        // title: res.data.msg,
        // icon: 'error',
        // duration: 2000
        // });
        // }
        // }

        // });
        return;

      } else {
        // 重新拉取授权
        wx.openSetting({
          success: (res) => {
            console.log(res);
            if (res.authSetting['scope.userInfo']) {
              wx.login({
                success: function (res) {
                  let code = res.code;
                  console.log(code);
                  wx.getUserInfo({
                    success: function (res1) {
                      server.sendRequest({
                        url: '?r=wxapp.logs.slogin',
                        data: {
                          code: code,
                          encryptedData: res1.encryptedData,
                          iv: res1.iv
                        },
                        method: 'POST',
                        success: function (res) {
                          var midXzx = wx.getStorageSync("mid");
                          if (!res.data) { return }
                          if (res.data.status == 1) {
                            utoken = res.data.result.utoken;
                            wx.setStorageSync("utoken", utoken); //写入数据
                            server.globalData.login = true;
                            server.globalData.userInfo = res1.userInfo;
                            res1.userInfo.avatar = res1.userInfo.avatarUrl
                            res1.userInfo.nickname = res1.userInfo.nickName
                            if (midXzx) {
                              that.sendRequest({
                                method: 'POST',
                                url: '?r=wxapp.commission.register&utoken=' + utoken + '&mid=' + midXzx,
                                data: {},
                                success: function (res) { }
                              })
                            }
                            typeof cb == "function" && cb(utoken)
                            return;
                          } else if (res.data.status == -1) {

                            return;
                          } else if (res.data.status == -10) {

                            return;
                          } else {

                            return;
                          }

                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }



    },
    //加入购物车
    addCart: function (e) {
  //  console.log('加入购物车111111111-----------')
      var that = this;
      var formId = e.detail.formId;
      var goods = that.data.goods;
 //     console.log(goods.goods.goods_spec_list)
      if (goods.goods.goods_spec_list != null) {
        if (that.data.name_arr == undefined){
          wx.showModal({
            showCancel: false,
            content: '请选择规格',
            success: function (res) {
              if (res.confirm) {}
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
                if (res.confirm) {
                }
              }
            })
            return
          }
        }

        // if (!that.data.name_arr || that.data.goods.goods.goods_spec_list.length != that.data.name_arr.length) {
        // wx.showModal({
        // showCancel: false,
        // content: '请选择规格',
        // success: function(res) {
        // if (res.confirm) {
        // console.log('用户点击确定')
        // }
        // }
        // })
        // return
        // }
      }


      if(that.data.usermaxbuy > 0 && that.data.usermaxbuy <= parseInt(that.data.cartNum+that.data.order_goodscount)){
            // console.log('超过最大了------------------')
            wx.showToast({
              title: '数量已达上限',
              image: '../../../images/goodsNote.png',
              duration: 2000
            })
            return;
      }

      if (that.data.isSkill){
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
      // this.addbuyCart({
      //   success: function (res) {
      //     if (res.data.status == 1) {

      //       that.none();
      //       // that.getTotal(goodsId);
      //       wx.showToast({
      //         title: '已加入购物车',
      //         icon: 'success',
      //         duration: 2000
      //       });
      //     } else {
      //       wx.showToast({
      //         title: res.data.msg,
      //         icon: 'error',
      //         duration: 1000
      //       });
      //     }
      //   }

      // });
    },
    //加入购物车1
    // addCart1: function (e) {
    //   var that = this;

    //   if (e.detail.formId) {
    //     var formId = e.detail.formId;
    //     server.sendRequest({
    //       url: "?r=wxapp.formid.getFormidList",
    //       data: {
    //         utoken: utoken,
    //         formId: formId
    //       },
    //       method: "GET",
    //       success: function (res) {
    //         if (res.data.status == 1) {
    //           wx.showToast({
    //             title: '已加入购物车',
    //             icon: 'success',
    //             duration: 2000
    //           });
    //           that.none();
    //           that.getTotal(goodsId);
    //         } else {
    //           wx.showToast({
    //             title: res.data.msg,
    //             icon: 'error',
    //             duration: 1000
    //           });
    //         }
    //       }
    //     })

    //   }
    //   this.addbuyCart({
    //     success: function (res) {
    //       if (res.data.status == 1) {
    //         wx.showToast({
    //           title: '已加入购物车',
    //           icon: 'success',
    //           duration: 1000
    //         });
    //         that.none();
    //         that.getTotal(goodsId);
    //       } else {
    //         wx.showToast({
    //           title: res.data.msg,
    //           icon: 'error',
    //           duration: 1000
    //         });
    //       }
    //     }

    //   });
    // },
    // addbuyCart: function (param) {
    //   var that = this
    //   var goods = that.data.goods;

    //   var optionid = that.data.optionid;
    //   var goods_id = that.data.goods.goods.goods_id;
    //   var goods_num = that.data.goods_num;
    //   if (goods.goods.goods_spec_list != null) {
    //     if (optionid == 0) {
    //       that.move();
    //       // server.showModal({
    //       // content: '请选择规格!'
    //       // }); //测试其他错误
    //       return;
    //     }
    //     // that.move(); return;
    //   }
    //   server.sendRequest({
    //     url: '?r=wxapp.member.cart.add',
    //     data: {
    //       utoken: utoken,
    //       id: goods_id,
    //       optionid: optionid,
    //       total: goods_num,
    //       diyformdata: false
    //     },
    //     method: 'GET',
    //     success: function (res) {
    //       typeof param.success == 'function' && param.success(res);
    //     }
    //   })

    // },
    // showCartToast: function () {
    //   wx.showToast({
    //     title: '已加入购物车',
    //     icon: 'success',
    //     duration: 1000
    //   });
    //   wx.reLaunch({
    //     url: '../../cart/cart'
    //   })
    // },
    previewImage: function (e) {
      wx.previewImage({
        current: this.data.goods.get('images')[parseInt(e.currentTarget.dataset.current)],
        urls: this.data.goods.get('images')
      })
    },
    onShareAppMessage: function () {
      var that = this;
      if (that.data.mid) {
        var str = '/pages/goods/detail/detail?objectId=' + that.data.goodsId + "&mid=" + that.data.mid + '&share=' + 'share'
      } else {
        var str = '/pages/goods/detail/detail?objectId=' + that.data.goodsId
      }
      return {
        title: that.data.goods.goods.goods_name,
        path: str,
        imageUrl: that.data.goods.gallery[0].image_url
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
  //   move: function () {
  // //if (this.data.usermaxbuy > 0 && this.data.maxbuy >= this.data.usermaxbuy || this.data.maxbuy == 0 && this.data.usermaxbuy) {
  //     if (this.data.usermaxbuy > 0 && this.data.maxbuy >= this.data.usermaxbuy || this.data.maxbuy == 0 && this.data.usermaxbuy) {
  //     if ((this.data.order_goodscount + this.data.cartNum) >= this.data.usermaxbuy) {
  //       wx.showModal({
  //         title: '',
  //         content: '该商品在购物车中数量或已购买的数量已达上限',
  //         showCancel:false,
  //         success: function (res) {
  //           if (res.confirm) {
  //             console.log('用户点击确定')
  //           } else if (res.cancel) {
  //             console.log('用户点击取消')
  //           }
  //         }
  //       })
  //       return;
  //     }
  //     } else if (this.data.maxbuy < this.data.usermaxbuy && this.data.maxbuy > 0) {
  //     if (this.data.maxbuy > 0) {
  //       if (this.data.cartNum >= this.data.maxbuy) {
  //         wx.showModal({
  //           title: '',
  //           content: '该商品在购物车中数量已达上限',
  //           showCancel: false,
  //           success: function (res) {
  //             if (res.confirm) {
  //             }
  //           }
  //         })
  //         return;
  //       }
  //     }
  //     }

  //     this.setData({
  //       buy: 1,
  //     })
  //     var anima1 = wx.createAnimation({
  //       timingFunction: 'ease-in',
  //     }).translate(0, -600).step({
  //       duration: 500
  //     });
  //     var anima2 = wx.createAnimation({
  //       duration: 500
  //     }).opacity(1).step();
  //     this.setData({
  //       animationData: anima1.export(),
  //       anima2: anima2.export(),

  //     })
  //     this.setData({
  //       pf: true
  //     })
  //   },

    // none: function () {
    //   var anima1 = wx.createAnimation({
    //     timingFunction: 'ease-in',
    //   }).translate(0, 600).step({
    //     duration: 300
    //   });
    //   var anima2 = wx.createAnimation({
    //     duration: 100
    //   }).opacity(0).step();
    //   this.setData({
    //     animationData: anima1.export(),
    //     anima2: anima2.export(),
    //     pf: false
    //   })
    //   this.setData({
    //     buy: '',
    //   })
    // },
    showImages: function () {
      var that = this;
      that.setData({
        showImage: false
      })
    },
    onUnload: function () {
      clearTimeout(timer);
    },
    // onUnload: function () {
    //   clearTimeout(timer);
    // },
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
      // typeof that.data.myshop !== 'undefined' ||
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
          console.log(res)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res)
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
    noMove: function () {
      return false;
    },
    closeShare: function (e) {
      var that = this;
      that.setData({
        isShare: false
      })
    }

  });















