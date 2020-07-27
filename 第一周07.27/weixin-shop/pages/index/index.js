var server = require('../../utils/server');//
var cpage = 1,
  ipage = 1,
  obj = {},
  goodsarr = [];

let WxParse = require("../../wxParse/wxParse.js"),
  addr = require("../../utils/add.js"),
  extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {},
  news = extConfig.new,
  page = 1,
  totalArr = [],
  timer = "",
  num = 0,
  Allprice = 0,
  Allnum = 0,
  selectGoods = [],
  redTimer,
  skillStatus = true,
  seckillgroupHas = false,
  articleIndex = [];

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num;
}

var app = getApp();

Page({
  data: {
    goods: [1, 2, 3, 4],
    goods_three: [1, 2, 3],
    loading: true,
    login: false,
    style: false,
    xjstore: true,
    couponList: [], //优惠劵列表
    storeList: [],
    richtextList: [],
    start_time: 0,
    skillPriceList: {},
    refresh: false,
    twoindex: 0,
    isClick: '',
    redResult: {},
    redPrize: {
      topOPen: 0
    },
    markers: [],
    myName: '',
    myAddr: '',
    seckillgroupList: '',
    groupRecgoods: '',
    artData: [],
    artDataB: [],
    artDataA: '',
    abbarObj: {},
    abbarhas: false,
    GoodListData: [],
    tabbarPage: 1,
    tabbarCate: '',
    activecolor: '',
    isstore: 0,
    tabbarTop: '',
    tabbarfixed: false,
    hasposition: false,
    hasLink: false,
    shareIcon: false,
    is_mianyi: 0,
    page: 1,
    pagesize: 10,
    moreArticle: true,
    allArticle: [],
    // 所有商品分类
    cateList: [],
    allgoodsList: [],
    tabindex: 0,
    goodspage: 1,
    goodspagesize: 10,
    moreGoods: true,
    storeID: ''
  },
  onLoad(res) {
    var that = this;
    var local_utoken = wx.getStorageSync("utoken");
    let sdata = {
      wxid: wx.getStorageSync('obj').wxid,
      unionid: wx.getStorageSync('obj').unionid,
      utoken: local_utoken
    }
    server.sendRequest({
      url: '?r=wxapp.getShopDiyBase',
      data: sdata,
      method: 'POST',
      success: res => {
        if (res.data.status == 1) {
          wx.setStorageSync('templeid', res.data.result.templeid);
          wx.setStorageSync('is_mianyi', res.data.result.shopinfo.base.is_mianyi);
          if (res.data.result && res.data.result.shopinfo && res.data.result.shopinfo.base) {
            let baseInfo = res.data.result.shopinfo.base;
            app.globalData.isDiyDecorate = baseInfo.isdiypage;
          }
          this.setData({
            isCustomDecorate: app.globalData.isDiyDecorate,
            is_mianyi: wx.getStorageSync('is_mianyi'),
          })
          if (app.globalData.isDiyDecorate == 0) {
            cpage = 1;
            if (res.scene) {
              res = server.sceneToParams(res.scene);
              this.getInfo(res.cardid);
            }
            if (res.storeid && res.unionid) {
              that.setData({
                wxid: res.storeid,
                storeid: res.storeid,
                unionid: res.unionid
              })
              obj = {
                wxid: res.storeid,
                unionid: res.unionid
              }
              wx.setStorageSync('obj', obj);
            } else {
              if (wx.getStorageSync('userInfo')) {
                that.setData({
                  wxid: wx.getStorageSync('obj').wxid
                })
                obj = {
                  wxid: wx.getStorageSync('obj').wxid,
                  unionid: wx.getStorageSync('userInfo').unionid
                }
              } else if (wx.getStorageSync('obj')) {
                that.setData({
                  wxid: wx.getStorageSync('obj').wxid
                })
                obj = {
                  wxid: wx.getStorageSync('obj').wxid,
                  // unionid: wx.getStorageSync('userInfo').unionid
                }
              } else {
                that.setData({
                  wxid: 16331
                })
                obj = {
                  wxid: 16331,
                  unionid: 'eeb6b5820995e051a1a500eeb6d4cf93'
                }
                wx.setStorageSync('obj', obj);
              }
            }

            this.getHomeData();

            // this.getcouponList();
            wx.getSystemInfo({
              success(res) {
                that.setData({
                  heighth: res.windowHeight
                })
              }
            })
          } else {
            page = 1;
            var news = extConfig.new;
            if (res.share) {
              this.setData({
                shareIcon: true
              })
            }
            that.mapCtx = wx.createMapContext("map");
            if (res.mid) {
              that.setData({
                mid: res.mid
              });
              // 成为分销商
              var midX = wx.setStorageSync("mid", res.mid);
              var midZ = wx.getStorageSync("mid");
            }
            that.setData({
              options: res
            });
            this.getInviteCode(res);
            this.loadPageData(res);
            wx.getSystemInfo({
              success: function(res) {
                that.setData({
                  windowWidth: res.windowWidth,
                  windowHeight: res.windowHeight
                });
              }
            });
            var redTime = setInterval(function() {
              let utoken = wx.getStorageSync("utoken");
              if (utoken) {
                that.isHasRed(utoken);
                clearInterval(redTime);
              }
            }, 500);
          }
        }
      }
    })
  },
 
  
  onShow: function() {
    console.log(app.globalData.isDiyDecorate)
    if (app.globalData.isDiyDecorate == 0) {
      this.getHomeData();
    } else {
      var that = this;
      page = 1;
      that.getGroupList();
      if (wx.getStorageSync("position")) {
        let position = wx.getStorageSync("position");
        that.setData({
          position: position,
          City: position.city
        })

      }
      wx.getStorageSync("position") ? wx.removeStorageSync("position") : '';
    }
  },
  skipLiveStreaming() {
    wx.navigateTo({
      url: '/packageA/pages/live/index',
    })
  },
  getallgoodsCate() {
    var that = this;
    server.sendRequest({
      url: '/api/shop/getCategory',
      data: {
        wxid: that.data.pageData.uniacid
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 200) {
          let cateItem = {
            id: 0,
            name: '全部商品'
          }
          let cateList = res.data.result.data.parent;
          cateList.unshift(cateItem);
          that.setData({
            cateList: cateList
          })
          this.getallgoods();
        } else {
          console.log(res.data.msg)
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  getallgoods() {
    var that = this;
    server.sendRequest({
      url: '/api/shop/getXdGoodsList',
      data: {
        wxid: that.data.pageData.uniacid,
        category_id: that.data.tabindex,
        page: that.data.goodspage,
        pagesize: that.data.goodspagesize
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 200) {
          let allgoodsList = that.data.goodspage == 1 ? [] : that.data.allgoodsList;
          allgoodsList.push(...res.data.result.goods.list)
          let moreGoods = res.data.result.goods.list.length <= 0 ? false : true;
          that.setData({
            allgoodsList,
            moreGoods
          })
        } else {
          console.log(res.data.msg)
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  getmore() {
    var that = this;
    if (that.data.moreGoods) {
      that.data.goodspage++;
    } else {
      that.data.goodspage = that.data.goodspage;
    }
    that.getallgoods();
  },
  handleTab(e) {
    this.setData({
      tabindex: e.currentTarget.dataset.cateid,
      page: 1,
      goodspage:1
    })
    this.getallgoods();
  },



  getInfo(cardid) {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/home/getCardInfo',
      method: 'get',
      data: {
        utoken,
        card_id: cardid
      },
      success: res => {}
    }, 'https://report.cnweisou.net')
  },
  onLogin(res) {
    if (res.detail.status == 1) {
      let userInfo = wx.getStorageSync('userInfo');

      if (wx.getStorageSync('userInfo')) {
        obj = {
          wxid: obj.wxid,
          unionid: wx.getStorageSync('userInfo').unionid
        }
        this.getHomeData();
        // this.getcouponList();

      } else {}

      this.setData({
        userInfo
      })
      this.getHomeData()

    }
  },
  onCancel(res) {
    this.setData({
      login: false
    })
  },
  getcouponList() {
    let that = this;
    server.sendRequest({
      url: '/api/coupon/getList',
      data: {
        shopid: obj.wxid,
        unionid: obj.unionid,
        utoken: wx.getStorageSync('userInfo').utoken
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            couponList: res.data.result.list
          })
        }
      }

    })
  },
  linquClick() {
    // this.getcouponList();
  },
  onPullDownRefresh(e) {
    if (app.globalData.isDiyDecorate == 1) {
      var that = this;
      that.getInviteCode(that.data.options);
      that.loadPageData(that.data.options);
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 2000
      })
      wx.stopPullDownRefresh();
    } else {
      cpage = 1
      this.getHomeData()
      wx.stopPullDownRefresh()
    }
  },
  getHomeData: function() {
    var that = this
    let data = {};
    data.wxid = obj.wxid;
    if (obj.unionid) {
      data.unionid = obj.unionid;
    }
    data.page = that.data.page;
    data.pagesize = that.data.pagesize;
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').utoken) {
      data.utoken = wx.getStorageSync('userInfo').utoken
    }
    server.sendRequest({
      url: '?r=wxapp.getShopDiyBase',
      data: data,
      method: 'POST',
      success: function(res) {
        if (res.data.result.status == -1) {
          that.setData({
            xjstore: false,
            pageData: res.data.result
          })
        } else {
          that.start_time = server.getsec();
          wx.setStorageSync('templeid', res.data.result.templeid);

          let allArticle = that.data.page == 1 ? [] : that.data.allArticle;
          allArticle.push(...res.data.result.shopinfo.articles)
          let moreArticle = res.data.result.shopinfo.articles.length <= 0 ? false : true;
          that.setData({
            pageData: res.data.result,
            allArticle: allArticle,
            storeID: res.data.result.shopinfo.base.uniacid,
            moreArticle: moreArticle,
            storeList: res.data.result.merchant,
            richtextList: res.data.result.set.content
          })
          wx.setNavigationBarTitle({
            title: that.data.pageData.shopinfo.base.shopname
          })
          if(res.data.result.templeid == 10){
            that.getallgoodsCate();
          }
         
        }
        that.setData({
          loading: false
        })
        //数据埋点

      }
    })
  },
  onHide() {
    let that = this;
    server.reportedData('see_store', {
      'start_time': that.start_time,
      'end_time': server.getsec()
    });
  },
  sreachinput: function(e) {
    let that = this;
    if (that.data.pageData.templeid == '12') {
      wx.navigateTo({
        url: '/packageA/pages/services/search/search?keywords=' + e.detail.value,
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/list/list?keywords=' + e.detail.value,
      })
    }
    that.setData({
      keyword: ''
    })
  },

  toSeemore: function() {
    wx.navigateTo({
      url: '../order/mendian/index',
    })
  },
  tostoreDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let storeId = e.currentTarget.dataset.id;

    if (index) {
      wx.navigateTo({
        url: '/packageA/pages/store/newdetail/index?id=' + storeId,
      })
    } else {
      wx.navigateTo({
        url: '/packageA/pages/store/detail/index?id=' + storeId,
      })
    }

  },
  navigateToUrl: function(e) {
    const url = e.currentTarget.dataset.link;
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  intogoodsdetail: function(e) {
    let that = this;
    if (that.data.pageData.templeid == '12') {
      wx.navigateTo({
        url: '/packageA/pages/services/detail/index?objectId=' + e.currentTarget.dataset.goodsid,
      })
    } else {
      wx.navigateTo({
        url: '../goods/detail/detail?objectId=' + e.currentTarget.dataset.goodsid,
      })
    }
  },
  isLogin() {
    let that = this
    if (!wx.getStorageSync('userInfo')) {
      that.setData({
        login: true
      })
    }
  },
  guanzhu: function() {
    let that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    let uniacid = extConfig.uniacid;
    if (!wx.getStorageSync('userInfo')) {
      that.setData({
        login: true
      })
      server.getUserInfo(function() {});
    } else {
      server.sendRequest({
        url: '/api/collects/favor',
        data: {
          unionid: obj.unionid,
          status: 1,
          utoken: wx.getStorageSync('userInfo').token,
          wxid: uniacid
        },
        method: 'POST',
        success: function(res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2500
            })
            that.getHomeData()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2500
            })
          }

        }
      })
    }

  },
  quxiaob: function() {
    let that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    let uniacid = extConfig.uniacid;
    if (!wx.getStorageSync('userInfo')) {
      that.setData({
        login: true
      })
    } else {
      server.sendRequest({
        url: '/api/collects/favor',
        data: {
          unionid: obj.unionid,
          status: 0,
          utoken: wx.getStorageSync('userInfo').token,
          wxid: uniacid
        },
        method: 'POST',
        success: function(res) {

          if (res.data.status == 1) {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 2500
            })
            that.getHomeData()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2500
            })
          }
        }
      })
    }
  },
  onShareAppMessage: function() {
    let obj = wx.getStorageSync('obj');
    let that = this
    return {
      title: that.data.pageData.shopInfo.shopname,
      path: '/pages/index/index?storeid=' + obj.wxid + '&unionid=' + obj.unionid,
      imageUrl: that.data.pageData.shopInfo.logo
    }
  },
  onShareTimeline(){
    return {
    }
  },
  onPageScroll(e) {
    if (app.globalData.isDiyDecorate == 1) {
      if (e.scrollTop >= this.data.tabbarTop && e.scrollTop > 50) {
        this.setData({
          tabbarfixed: true
        })
      } else if (e.scrollTop < this.data.tabbarTop || e.scrollTop < 50) {
        this.setData({
          tabbarfixed: false
        })
      }
    }
  },
  joinSearch() {
    wx.navigateTo({
      url: "/packageA/pages/search/find/find?hasTabs=true"
    });
  },

  onReachBottom: function() {
    var that = this;
    if(app.globalData.isDiyDecorate == 0) {
      if (that.data.pageData.templeid == 12 || that.data.pageData.templeid == 10) {
        console.log(2222)
        that.getmore();
      }
      if (that.data.pageData.templeid == 13) {
        that.selectComponent("#gateWay").getmore();
        if (that.data.moreArticle) {
          that.data.page++;
        } else {
          that.data.page = that.data.page;
        }
        that.getHomeData();
      }
    }
    if (app.globalData.isDiyDecorate == 1) {
      if (that.data.abbarhas) {
        if (!that.data.hasLink) {
          return
        };
        if (that.data.refresh) return;
        that.setData({
          refresh: true,
          noMoreData: false
        });
        that.data.tabbarPage = that.data.tabbarPage + 1;
        if (typeof this.data.local == 'undefined') {
          that.getGoodList(that.data.tabbarPage, that.data.tabbarCate, -1);
        } else {
          that.getGoodList(that.data.tabbarPage, that.data.tabbarCate, that.data.isstore, that.data.local.lat, that.data.local.lng);
        }
        wx.showToast({
          title: "加载中",
          icon: "loading"
        });
      }
    }
  },
  getGoodList(page, cate, isstore, lat, lng) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    if (isstore == 0) {
      var mydata = {
        utoken: utoken,
        page: page,
        sort: "",
        sort_asc: "",
        cate: cate,
        isstore: isstore,
        lat: lat,
        lng: lng
      }
    } else {
      var mydata = {
        utoken: utoken,
        page: page,
        sort: "",
        sort_asc: "",
        cate: cate
      }
    }
    server.sendRequest({
      url: "?r=wxapp.goods",
      showToast: false,
      data: mydata,
      method: "GET",
      success: function(res) {
        var newgoods = res.data.result.goods_list;
        if (res.data.result.goods_list) {
          that.setData({
            refresh: false
          });
        } else {
          that.setData({
            noMoreData: true
          });
        }
        if (that.data.tabbarPage == 1) {
          var ms = [];
        } else {
          var ms = that.data.GoodListData;
        }
        for (var i in newgoods) {
          if (newgoods[i].title.length > 26) {
            newgoods[i].title = newgoods[i].title.substring(0, 27) + "...";
          }
          if (ms[i] != newgoods[i]) {
            ms.push(newgoods[i]);
          }
        }
        if (ms.length == 0) {} else {
          wx.stopPullDownRefresh();
          that.setData({
            GoodListData: ms
          });
        }
      }
    });
  },
  controltap(e) {
    var that = this;
    if (e.controlId == 1) {
      this.mapCtx.moveToLocation();
    }

    if (e.controlId == 0) {
      wx.openLocation({
        latitude: parseFloat(e.currentTarget.dataset.latitude),
        longitude: parseFloat(e.currentTarget.dataset.longitude),
        scale: 28,
        name: that.data.myName,
        address: that.data.myAddr
      });
    }
  },
  receivePackage: function() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=lottery.reward",
      showToast: false,
      data: {
        utoken: utoken,
        id: that.data.myId
      },
      method: "POST",
      success: function(res) {
        if (res.data.result.icon) {
          that.setData({
            redPrize: res.data.result,
            "redPrize.topOPen": 2,
            redWait: false
          });
        } else {
          that.setData({
            "redPrize.info": "支付配置有误，请联系商家完善",
            "redPrize.icon": "https://tws.cnweisou.com/images/gameError.jpg",
            "redPrize.topOPen": 2
          });
        }
      }
    });
  },
  receivePackageClose: function() {
    var that = this;
    clearInterval(redTimer);
    that.setData({
      "redResult.redPackage": false
    });
  },
  addcard: function() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: "?r=wxapp.member.vipcard.addWxMemberCard",
      data: {
        utoken: utoken
      },
      method: "GET",
      success: function(res) {
        wx.addCard({
          cardList: [{
            cardId: res.data.result.card_id,
            cardExt: '{"nonce_str": "' +
              res.data.result.card_ext.nonce_str +
              '", "timestamp": "' +
              res.data.result.card_ext.timestamp +
              '", "signature":"' +
              res.data.result.card_ext.signature +
              '"}'
          }],
          success: function(res) {
            server.sendRequest({
              url: "?r=wxapp.member.vipcard.decs",

              data: {
                utoken: utoken,
                cardid: res.cardList[0].cardId,
                encrypt_code: res.cardList[0].code
              },
              method: "GET",
              success: function(res1) {
                wx.openCard({
                  cardList: [{
                    cardId: res.cardList[0].cardId,
                    code: res1.data.result.code
                  }],
                  success: function(res) {}
                });
              }
            });
          }
        });
      }
    });
  },
  clickCont: function() {
    var that = this;
    that.setData({
      isClick: true
    });
  },
  clickContAgain: function() {
    var that = this;
    that.setData({
      isClick: false
    });
  },
  onUnload: function() {
    if (timer) {
      clearTimeout(timer);
    }
  },
  isHasRed: function(utoken) {
    var that = this;
    server.sendRequest({
      url: "?r=lottery.has_get_red&utoken=" + utoken,
      method: "GET",
      showToast: false,
      success: function(res) {
        if (res.data.result) {
          if (res.data.result.status == 1) {
            that.setData({
              statusRed: res.data.result.status
            });
          }
        }
        if (res.data.result.status == 1) {
          server.sendRequest({
            url: "?r=lottery.lottery_id&type=4&utoken=" + utoken,
            method: "GET",
            showToast: false,
            that: that,
            success: function(res) {
              if (res.data.result.id) {
                that.setData({
                  myId: res.data.result.id
                });

                server.sendRequest({
                  url: "?r=lottery.lists&utoken=" + utoken,
                  showToast: false,
                  that: that,
                  data: {
                    id: that.data.myId
                  },
                  method: "POST",
                  success: function(res) {
                    if (res.data.result) {
                      that.setData({
                        redResult: res.data.result,
                        "redResult.redPackage": true,
                        "redPrize.topOPen": 0
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  },
  count_down: function(that) {
    var that = this;
    (that.data.skillPriceList.clock = that.date_format(
      that.data.total_micro_second
    )),
    that.setData({
      clock: that.date_format(that.data.total_micro_second),
      skillPriceList: that.data.skillPriceList
    });
    if (that.data.total_micro_second <= 0) {
      that.data.clock.clock_hasTime = "";
      that.data.clock = that.data.clock.clock_hasTime;
      that.setData({
        clock: that.data.clock,
        isSkill: false
      });
      that.getstartList();
      return;
    }
    timer = setTimeout(function() {
      that.data.total_micro_second -= 1000;
      that.count_down(that);
    }, 1000);
  },
  date_format: function(micro_second) {
    var second = Math.floor(micro_second / 1000);
    var hr = fill_zero_prefix(Math.floor(second / 3600));
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    var sec = fill_zero_prefix(second - hr * 3600 - min * 60);
    var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
    var dataTime = {
      clock_hour: hr,
      clock_min: min,
      clock_sec: sec,
      micro_sec: micro_sec,
      clock_all: hr + ":" + min + ":" + sec,
      clock_hasTime: true
    };
    return dataTime;
  },
  getstartList: function() {
    var that = this;
    server.sendRequest({
      url: "?r=seckill",
      data: {},
      showToast: false,
      that: that,
      method: "GET",
      success: function(res) {
        if (res.data.result && res.data.result.length != 0) {
          if (res.data.result.times) {
            var currTime;
            for (var i = 0; i < res.data.result.times.length; i++) {
              if (res.data.result.times[i].status == 0) {
                currTime = i;
                break;
              }
            }
            if (currTime || currTime == 0) {
              that.data.skillPriceList.show = true;
              that.setData({
                time: res.data.result.time,
                times: res.data.result.times,
                goods: res.data.result.goods,
                skillPriceList: that.data.skillPriceList
              });
              var starttime = that.data.times[currTime].starttime * 1000;
              var nowtime = that.data.time.nowtime * 1000;
              var endtime = that.data.times[currTime].endtime * 1000;
              var total_micro_second = endtime - nowtime;
              that.data.skillPriceList.nowClock =
                that.data.times[currTime].time;
              that.data.skillPriceList.goods = that.data.goods;
              that.setData({
                isSkill: true,
                total_micro_second: total_micro_second,
                skillPriceList: that.data.skillPriceList
              });
              that.count_down(that);
            } else {
              that.data.skillPriceList.show = "";
              that.setData({
                skillPriceList: that.data.skillPriceList
              });
            }
          }
        } else {
          that.data.skillPriceList.show = false;
          that.setData({
            skillPriceList: that.data.skillPriceList
          });
        }
      }
    });
  },
  // 团购组
  getGroupList: function() {
    var that = this;
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: "?r=wxapp.groups",
      showToast: false,
      data: {
        utoken: utoken,
        page: page
      },
      method: "GET",
      success: function(res) {
        if (res.data.result) {
          that.setData({
            groupRecgoods: res.data.result.recgoods
          });
        }
      }
    });
  },
  //进入团购页面
  intoGroupList: function() {
    wx.navigateTo({
      url: "../bottom/groupbuy/index"
    });
  },
  // 热卖团购详情页面
  toGroupDetail: function(res) {
    wx.navigateTo({
      url: "/packageA/pages/groupbuy/detail/index?id=" + res.currentTarget.id
    });
  },
  joinskillPrice: function() {
    wx.navigateTo({
      url: "../goods/priceKill/priceKill"
    });
  },
  clickSkill: function(e) {
    wx.navigateTo({
      url: "../goods/priceKill/priceKill"
    });
  },
  inputchange: function(e) {
    var that = this;
    that.setData({
      keywords: e.detail.value
    });
  },
  formSubmit: function(res) {
    var that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    if (extConfig.tabBarPage) {
      var tabBarPage = extConfig.tabBarPage;
      for (var i in tabBarPage) {
        if (tabBarPage[i] == "/pages/goods/list/list") {
          wx.reLaunch({
            url: "/pages/goods/list/list?keywords=" + that.data.keywords
          });
          return;
        }
      }
    }
    wx.navigateTo({
      url: "../goods/list/list?keywords=" + that.data.keywords
    });
  },
  search: function() {
    var that = this;
    wx.navigateTo({
      url: "../goods/list/list?keywords=" + that.data.keywords
    });
  },
  //显示购物车数据
  getCarts: function() {
    var that = this;
    if (wx.getStorageSync("selectGoods")) {
      that.setData({
        selectGoods: wx.getStorageSync("selectGoods"),
        Allprice: wx.getStorageSync("Allprice"),
        Allnum: wx.getStorageSync("Allnum")
      });
    }
    if (that.data.Allnum) {
      this.setData({
        showView: true
      });
    } else {
      wx.showToast({
        title: "请勾选商品",
        icon: "success",
        duration: 1000
      });
      return;
    }
  },
  // 页面加载时触发
  loadPageData: function(options) {
    var that = this;
    if (news == 4) {
      that.setData({
        loading: false,
        news: news
      });
      server.sendRequest({
        url: "?r=wxapp.shop.takingOrder&news=" + news,
        method: "GET",
        showToast: false,
        that: that,
        success: function(res) {
          wx.stopPullDownRefresh();
          var arr = [];
          var topHeight, swiperHeight;
          wx.getSystemInfo({
            success: function(res) {
              topHeight = res.windowHeight * 0.1;
              swiperHeight = res.windowHeight * 0.9;
            }
          });
          for (let x in res.data.result.category) {
            arr[x] = [];
            for (let y in res.data.result.category[x].goods) {
              arr[x].push(res.data.result.category[x].goods[y]);
            }
          }
          totalArr = res.data.result.category;
          that.setData({
            dataonload: {
              test: res.data.result,
              topHeight: topHeight,
              swiperHeight: swiperHeight,
              arr: arr
            },
            data: {
              test: res.data.result,
              topHeight: topHeight,
              swiperHeight: swiperHeight,
              arr: arr
            },
            selectedTitle: that.data.selectedTitle
          });
          if (wx.getStorageSync("selectGoods")) {
            that.setData({
              selectGoods: wx.getStorageSync("selectGoods"),
              Allprice: wx.getStorageSync("Allprice"),
              Allnum: wx.getStorageSync("Allnum")
            });
          }
        }
      });
    }
    if (news == 1 || news == 3) {
      server.sendRequest({
        url: "?r=wxapp.getaliData&news=" + news,
        method: "GET",
        showToast: false,
        that: that,
        success: function(res) {
          that.setData({
            data: res.data
          });
          if (that.data.data.data.page.diymenu == "-2") {
            wx.setStorageSync("diymenu", that.data.data.data.page.diymenu);
            server.sendRequest({
              url: "?r=wxapp.member.aboutus",
              method: "GET",
              showToast: false,
              success: function(res) {
                let tel = res.data.result.tel.split(",");
                wx.setStorageSync("tel", tel[0]);
              }
            });
          }
          var is_pinpoint;

          if (res.data.data && res.data.data.page) {
            wx.setNavigationBarTitle({
              title: res.data.data.page.title
            })
            let colorObj = {
              white: '#ffffff',
              black: '#000000'
            }
            wx.setNavigationBarColor({
              frontColor: colorObj[res.data.data.page.titlecolor],
              backgroundColor: res.data.data.page.backgroundcolor,
            })
            if (res.data.data.page.is_pinpoint) {
              is_pinpoint = res.data.data.page.is_pinpoint;
            }
            if (
              res.data.data &&
              res.data.data.page &&
              res.data.data.page.customerserver == 1
            ) {
              var icon = res.data.data.page.icon ?
                "http://boweisou.oss-cn-shenzhen.aliyuncs.com/" +
                res.data.data.page.icon :
                "https://tws.cnweisou.com/images/kefu.png";
              wx.setStorageSync("customerserver", icon);
            }
          }
          try {
            if (res.data.data.items) {
              var Data = res.data.data.items;
            }
          } catch (err) {}
          try {
            for (var x in res.data.data.items) {
              switch (res.data.data.items[x].id) {
                case "merchgroup":
                  if (res.data.data.items[x].params.openlocation == "1") {
                    if (options.lng) {
                      that.setData({
                        listLat: options.lat,
                        listLng: options.lng
                      });
                      server.sendRequest({
                        url: "?r=wxapp.shop.list&lat=" +
                          options.lat +
                          "&lng=" +
                          options.lng +
                          "&site=1",
                        showToast: false,
                        that: that,
                        data: {
                          is_pinpoint: is_pinpoint
                        },
                        method: "GET",
                        success: function(res) {
                          if (res.data.result) {
                            that.setData({
                              store: res.data.result,
                              store_num: res.data.result.list.length
                            });
                          }

                          if (Data) {
                            for (var x in Data) {
                              if (Data[x].id == "search") {
                                var search = Data[x];
                                search.item = {
                                  address: options.city,
                                  lat: options.lat,
                                  lng: options.lng
                                };
                                that.setData({
                                  search: search
                                });
                              }
                            }
                          }
                        }
                      });
                    } else {
                      wx.getLocation({
                        type: "wgs84",
                        success: function(res) {
                          var lat = res.latitude;
                          var lng = res.longitude;
                          that.setData({
                            listLat: lat,
                            listLng: lng
                          });
                          server.sendRequest({
                            url: "?r=wxapp.shop.list&lat=" +
                              res.latitude +
                              "&lng=" +
                              res.longitude +
                              "&site=1",
                            showToast: false,
                            that: that,
                            data: {
                              is_pinpoint: is_pinpoint
                            },
                            method: "GET",
                            success: function(res) {
                              if (res.data.result) {
                                that.setData({
                                  store: res.data.result,
                                  store_num: res.data.result.list.length,
                                  address: res.data.result.city
                                });
                              }
                              if (Data) {
                                for (var x in Data) {
                                  if (Data[x].id == "search") {
                                    var search = Data[x];
                                    search.item = {
                                      address: that.data.address,
                                      lat: lat,
                                      lng: lng
                                    };
                                    that.setData({
                                      search: search
                                    });
                                    var address = that.data.search.item.address;
                                    var arr = address.split("");
                                    if (arr.length >= 6) {
                                      var add = [];
                                      for (let x in arr) {
                                        if (x < 6) {
                                          add.push(arr[x]);
                                        }
                                      }
                                      add = add.join("");
                                      that.setData({
                                        address: add
                                      });
                                    } else {
                                      that.setData({
                                        address: that.data.address
                                      });
                                    }
                                  }
                                }
                              }
                            }
                          });
                        }
                      });
                    }
                  }
                  break;
                case "search":
                  that.setData({
                    paddingleft: res.data.data.items[x].style.paddingleft
                  });
                  if (res.data.data.items[x].style.fixed == 1) {
                    that.setData({
                      searchHeight: 75 + res.data.data.items[x].style.paddingtop * 2
                    });
                  }
                  wx.getSystemInfo({
                    success: function(res) {
                      that.setData({
                        windowWidthS: res.windowWidth * 2 - that.data.paddingleft * 10
                      });
                    }
                  });
                  break;
                case "map":
                  var latitude = res.data.data.items[x].style.latitude;
                  var longitude = res.data.data.items[x].style.longitude;
                  if (typeof res.data.data.items[x].style.addr != "undefined") {
                    that.setData({
                      myAddr: res.data.data.items[x].style.addr,
                      myName: "位置"
                    });
                  }
                  var markers = [{
                    iconPath: "../../images/hotelPosition.png",
                    id: 0,
                    latitude: latitude,
                    longitude: longitude,
                    width: 30,
                    height: 30,
                    callout: {
                      content: "我在这里喔",
                      color: "#fff",
                      display: "BYCLICK",
                      bgColor: "#93C750",
                      padding: 20,
                      borderRadius: 5
                    }
                  }];
                  that.setData({
                    markers: markers,
                    latitude: parseFloat(res.data.data.items[x].style.latitude),
                    longitude: parseFloat(
                      res.data.data.items[x].style.longitude
                    )
                  });
                  break;
                case "seckillgroup":
                  seckillgroupHas = true;
                  that.setData({
                    seckillgroupList: res.data.data.items[x]
                  });
                  if (skillStatus) {
                    that.getstartList();
                    skillStatus = false;
                  }
                  break;
                case 'position':
                  that.setData({
                    hasposition: true
                  })
                  if (typeof res.data.data.items[x].params.hideborder != 'undefined') {
                    that.setData({
                      isstore: parseInt(res.data.data.items[x].params.hideborder)
                    })
                  }
                  if (options.lng) {
                    that.setData({
                      listLat: options.lat,
                      listLng: options.lng
                    });
                    server.sendRequest({
                      url: '?r=wxapp.shop.localtion&lat=' + options.lat + '&lng=' + options.lng,
                      showToast: false,
                      that: that,

                      method: 'GET',
                      success: function(res) {

                        let position = {
                          address: res.data.result.result.address_reference.business_area.title,
                          lat: options.lat,
                          lng: options.lng
                        };

                        that.setData({
                          position: position,
                          City: res.data.result.result.address_component.city,
                          local: position
                        });
                      }
                    })
                  } else {
                    wx.getLocation({
                      type: 'wgs84',
                      success: function(res) {
                        var lat = res.latitude;
                        var lng = res.longitude;
                        server.sendRequest({
                          url: '?r=wxapp.shop.localtion&lat=' + lat + '&lng=' + lng,
                          showToast: false,
                          that: that,

                          method: 'GET',
                          success: function(res) {

                            let position = {
                              address: res.data.result.result.address_reference.business_area.title,
                              lat: lat,
                              lng: lng
                            };
                            wx.setStorageSync("CITY", position);
                            that.setData({
                              position: position,
                              City: res.data.result.result.address_component.city,
                              local: position
                            });
                          }
                        })
                      }
                    })
                  }
                  break;
                case "tabbar":
                  var query = wx.createSelectorQuery()
                  query.select('#tabbar').boundingClientRect()
                  query.selectViewport().scrollOffset()
                  query.exec(function(res) {
                    that.setData({
                      tabbarTop: res[0].top
                    })
                  })
                  var newObj = {
                    background: res.data.data.items[x].style.background,
                    activebackground: res.data.data.items[x].style.activebackground,
                    color: res.data.data.items[x].style.color,
                    activecolor: res.data.data.items[x].style.activecolor
                  };
                  var a = 0;
                  for (let i in res.data.data.items[x].data) {
                    a++;
                    if (a == 1) {
                      newObj.curtabbar = i;
                      newObj.linkurl = res.data.data.items[x].data[i].linkurl;
                    }
                  }
                  that.setData({
                    abbarObj: newObj,
                    abbarhas: true,
                    tabbarPage: 1,
                    activecolor: newObj.activecolor
                  });
                  var numNow = newObj.linkurl.indexOf("=");
                  if (numNow > -1) {
                    var cate = newObj.linkurl.substring(numNow + 1);
                    that.setData({
                      tabbarCate: cate,
                      hasLink: true
                    });
                    if (that.data.hasposition) {
                      wx.getLocation({
                        type: 'wgs84',
                        success: function(res) {
                          var lat = res.latitude;
                          var lng = res.longitude;
                          that.getGoodList(
                            that.data.tabbarPage,
                            that.data.tabbarCate,
                            that.data.isstore,
                            lat,
                            lng
                          );
                        }
                      })

                    } else {
                      that.getGoodList(
                        that.data.tabbarPage,
                        that.data.tabbarCate, -1
                      );
                    }
                  } else {
                    that.setData({
                      hasLink: false,
                      GoodListData: []
                    });
                  }
                  break;
                case "audio":
                  break;
                case "article":
                  let a = 0;
                  for (let y in res.data.data.items[x].data) {
                    if (a == 0) {
                      articleIndex.push(y);
                    }
                    a++;
                  }
                  if (res.data.data.items[x].style.liststyle == "block one") {
                    var artData = [];
                    for (var i in res.data.data.items[x].data) {
                      artData.push(res.data.data.items[x].data[i]);
                    }
                    that.setData({
                      artData: artData
                    });
                  } else if (
                    res.data.data.items[x].style.liststyle == "block two"
                  ) {
                    var artDataB = [];
                    for (var i in res.data.data.items[x].data) {
                      artDataB.push(res.data.data.items[x].data[i]);
                    }
                    that.setData({
                      artDataB: artDataB
                    });
                  } else {
                    that.setData({
                      artDataA: res.data.data.items[x]
                    });
                  }
                  break;

              }
            }
          } catch (err) {}

          if (is_pinpoint > 0) {
            if (options.lng) {
              that.setData({
                listLat: options.lat,
                listLng: options.lng
              });
              server.sendRequest({
                url: "?r=wxapp.shop.list&lat=" +
                  options.lat +
                  "&lng=" +
                  options.lng +
                  "&site=1",
                showToast: false,
                that: that,
                data: {
                  is_pinpoint: is_pinpoint
                },
                method: "GET",
                success: function(res) {
                  if (res.data.result) {
                    that.setData({
                      store: res.data.result,
                      store_num: res.data.result.list.length
                    });
                  }
                  if (Data) {
                    for (var x in Data) {
                      if (Data[x].id == "search") {
                        var search = Data[x];
                        search.item = {
                          address: options.city,
                          lat: options.lat,
                          lng: options.lng
                        };
                        that.setData({
                          search: search
                        });
                      }
                    }
                  }
                }
              });
            } else {
              wx.getLocation({
                type: "wgs84",
                success: function(res) {
                  var lat = res.latitude;
                  var lng = res.longitude;
                  server.sendRequest({
                    url: "?r=wxapp.shop.localtion",
                    showToast: false,
                    that: that,
                    data: {
                      lat: lat,
                      lng: lng
                    },
                    method: "GET",
                    success: function(res) {
                      var search = {};
                      search.item = {
                        address: res.data.result.result.address,
                        lat: res.data.result.result.location.lat,
                        lng: res.data.result.result.location.lng,
                      };
                      that.setData({
                        search: search,
                      });
                    }
                  });
                }
              });
            }
          }
          that.setData({
            loading: false
          });
        }
      });
    }
  },
  address: function(e) {
    wx.navigateTo({
      url: "../area/index/index?addr=" +
        e.currentTarget.dataset.addr +
        "&lat=" +
        e.currentTarget.dataset.lat +
        "&lng=" +
        e.currentTarget.dataset.lng +
        "&addr=" +
        e.currentTarget.dataset.addr
    });
  },
  // 商家店铺跳转
  storebtn: function(e) {
    wx.navigateTo({
      url: "../goods/shop/shop?id=" + e.currentTarget.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
  },
  // 页面跳转的方法
  getToPage: function(e) {
    var that = this;
    var imgUrl = [];
    var urlLink = "";
    urlLink = e.currentTarget.dataset.link;
    if (e.currentTarget.dataset.groupimg) {
      imgUrl.push(e.currentTarget.dataset.groupimg);
    }
    if (e.currentTarget.dataset.preview == 1) {
      wx.previewImage({
        current: '',
        urls: imgUrl
      })
    } else {
      server.getToPage(e);
    }
  },
  // 跳转到店铺街列表
  to_store: function() {
    var that = this;
    wx.navigateTo({
      url: "/pages/bottom/shoppage/index?listLat=" +
        that.data.listLat +
        "&listLng=" +
        that.data.listLng
    });
  },
  // 分享方法
  getInviteCode: function(options) {
    if (options.uid != undefined) {
      wx.showToast({
        title: "来自用户:" + options.uid + "的分享",
        icon: "success",
        duration: 2000
      });
    }
  },
  // 拨打电话
  call: function(e) {
    let id = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ["拨打电话", "取消"],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: id,
            success: function() {},
            fail: function() {}
          });
        }
      }
    });
  },
  //定位
  position: function(e) {
    wx.navigateTo({
      url: '/packageA/pages/position/index?addr=' + e.currentTarget.dataset.addr + "&lat=" + e.currentTarget.dataset.lat + "&lng=" + e.currentTarget.dataset.lng + "&city=" + e.currentTarget.dataset.city
    })
  },
  reduce: function(e) {
    var that = this;
    if (wx.getStorageSync("selectGoods")) {
      that.setData({
        selectGoods: wx.getStorageSync("selectGoods"),
        Allprice: wx.getStorageSync("Allprice"),
        Allnum: wx.getStorageSync("Allnum")
      });
    }
    var currIndex = e.currentTarget.dataset.index;
    var optionId = 0;
    if (that.data.data.arr[that.data.selectedTitle][currIndex].mytotal >= 1) {
      that.data.data.arr[that.data.selectedTitle][currIndex].mytotal--;
      Allprice =
        Allprice -
        that.data.data.arr[that.data.selectedTitle][currIndex].marketprice;
      Allnum--;
      that.setData({
        data: that.data.data,
        Allprice: Allprice,
        Allnum: Allnum
      });
      for (var x = 0; x < that.data.selectGoods.length; x++) {
        if (
          that.data.selectGoods[x].id ==
          that.data.data.arr[that.data.selectedTitle][currIndex].id
        ) {
          selectGoods.splice(
            x,
            1,
            that.data.data.arr[that.data.selectedTitle][currIndex]
          );
          that.setData({
            selectGoods: selectGoods
          });
        }
      }
      wx.setStorageSync("selectGoods", that.data.selectGoods);
      wx.setStorageSync("Allprice", that.data.Allprice);
      wx.setStorageSync("Allnum", that.data.Allnum);
    }
    if (that.data.data.arr[that.data.selectedTitle][currIndex].mytotal <= 0) {
      that.data.data.arr[that.data.selectedTitle][currIndex].mytotal = 0;
      for (var i = 0; i < that.data.selectGoods.length; i++) {
        if (that.data.selectGoods[i].mytotal == 0) {
          selectGoods.splice(i, 1);
          that.setData({
            selectGoods: selectGoods
          });
        }
      }
    }
    wx.setStorageSync("selectGoods", that.data.selectGoods);
    wx.setStorageSync("Allprice", that.data.Allprice);
    wx.setStorageSync("Allnum", that.data.Allnum);
  },
  add: function(e) {
    var that = this;
    var id = parseInt(e.currentTarget.dataset.id);
    var currIndex = e.currentTarget.dataset.index;
    that.setData({
      nowid: id,
      nowcurrIndex: currIndex
    });
    if (wx.getStorageSync("selectGoods")) {
      that.setData({
        selectGoods: wx.getStorageSync("selectGoods"),
        Allprice: wx.getStorageSync("Allprice"),
        Allnum: wx.getStorageSync("Allnum")
      });
    }
    if (that.data.data.arr[that.data.selectedTitle][currIndex].mytotal) {
      if (
        that.data.data.arr[that.data.selectedTitle][currIndex].hasoption == 1
      ) {
        that.setData({
          isSecond: true
        });
      } else {
        that.data.data.arr[that.data.selectedTitle][currIndex].mytotal++;
        Allprice =
          Allprice +
          parseInt(
            that.data.data.arr[that.data.selectedTitle][currIndex].marketprice
          );
        Allnum++;
        that.setData({
          data: that.data.data,
          Allprice: Allprice,
          Allnum: Allnum
        });
        for (var i = 0; i < that.data.selectGoods.length; i++) {
          if (
            that.data.selectGoods[i].id ==
            that.data.data.arr[that.data.selectedTitle][currIndex].id
          ) {
            selectGoods.splice(
              i,
              1,
              that.data.data.arr[that.data.selectedTitle][currIndex]
            );
            that.setData({
              selectGoods: selectGoods
            });
          }
        }
        wx.setStorageSync("selectGoods", that.data.selectGoods);
        wx.setStorageSync("Allprice", that.data.Allprice);
        wx.setStorageSync("Allnum", that.data.Allnum);
      }
    } else {
      if (
        that.data.data.arr[that.data.selectedTitle][currIndex].hasoption == 1
      ) {
        var utoken = wx.getStorageSync("utoken");
        server.sendRequest({
          url: "?r=wxapp.goods.detail&id=" +
            that.data.data.arr[that.data.selectedTitle][currIndex].id +
            "&utoken=" +
            utoken,
          method: "GET",
          that: that,
          success: function(res) {
            that.setData({
              goods_spec_list: res.data.result.goods.goods_spec_list,
              spec_goods_price: res.data.result.spec_goods_price,
              isSecond: true,
              mygoodLen: res.data.result.goods.goods_spec_list.length,
              goods_name: res.data.result.goods.goods_name
            });

            var priceList = [];
            for (var a = 0; a < that.data.goods_spec_list.length; a++) {
              for (var b = 0; b < that.data.goods_spec_list[a].length; b++) {
                if (that.data.goods_spec_list[a][b].isClick == 1) {
                  priceList.push(that.data.goods_spec_list[a][b].item_id);
                }
              }
            }
            if (priceList.length == 1) {
              for (var r = 0; r < that.data.spec_goods_price.length; r++) {
                if (that.data.spec_goods_price[r].key == priceList[0]) {
                  that.setData({
                    nowPrice: that.data.spec_goods_price[r].price
                  });
                }
              }
            } else {
              var strPrice = priceList.reverse().join("_");
              for (var r = 0; r < that.data.spec_goods_price.length; r++) {
                if (that.data.spec_goods_price[r].key == strPrice) {
                  that.setData({
                    nowPrice: that.data.spec_goods_price[r].price
                  });
                }
              }
            }
          }
        });
      } else {
        that.data.data.arr[that.data.selectedTitle][currIndex].mytotal = num;
        that.data.data.arr[that.data.selectedTitle][currIndex].mytotal++;
        Allprice =
          Allprice +
          parseInt(
            that.data.data.arr[that.data.selectedTitle][currIndex].marketprice
          );
        Allnum++;
        selectGoods.push(
          that.data.data.arr[that.data.selectedTitle][currIndex]
        );
        that.setData({
          data: that.data.data,
          Allprice: Allprice,
          Allnum: Allnum,
          selectGoods: selectGoods
        });
      }
      wx.setStorageSync("selectGoods", that.data.selectGoods);
      wx.setStorageSync("Allprice", that.data.Allprice);
      wx.setStorageSync("Allnum", that.data.Allnum);
    }
  },
  //选择规格
  selectSpecif: function(e) {
    var that = this;
    var currIndex = e.currentTarget.dataset.index;
    var spec_name = e.currentTarget.dataset.spec_name;
    for (var y = 0; y < that.data.goods_spec_list.length; y++) {
      for (var x = 0; x < that.data.goods_spec_list[y].length; x++) {
        if (that.data.goods_spec_list[y][x].spec_name == spec_name) {
          if (currIndex == x) {
            that.data.goods_spec_list[y][x].isClick = 1;
          } else {
            that.data.goods_spec_list[y][x].isClick = 0;
          }
        }
      }
    }
    var priceList = [];
    for (var a = 0; a < that.data.goods_spec_list.length; a++) {
      for (var b = 0; b < that.data.goods_spec_list[a].length; b++) {
        if (that.data.goods_spec_list[a][b].isClick == 1) {
          priceList.push(that.data.goods_spec_list[a][b].item_id);
        }
      }
    }
    if (priceList.length == 1) {
      for (var r = 0; r < that.data.spec_goods_price.length; r++) {
        if (that.data.spec_goods_price[r].key == priceList[0]) {
          that.setData({
            nowPrice: that.data.spec_goods_price[r].price
          });
        }
      }
    } else {
      var strPrice = priceList.reverse().join("_");
      for (var r = 0; r < that.data.spec_goods_price.length; r++) {
        if (that.data.spec_goods_price[r].key == strPrice) {
          that.setData({
            nowPrice: that.data.spec_goods_price[r].price
          });
        }
      }
    }
    that.setData({
      goods_spec_list: that.data.goods_spec_list
    });
  },
  // 选好
  selectOk: function(e) {
    var that = this;
    if (
      that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex]
      .mytotal
    ) {
      that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex]
        .mytotal++;
      that.data.data.arr[that.data.selectedTitle][
          that.data.nowcurrIndex
        ].marketprice =
        that.data.nowPrice;
      Allprice =
        Allprice +
        parseInt(
          that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex]
          .marketprice
        );
      Allnum++;
      that.setData({
        data: that.data.data,
        Allprice: Allprice,
        Allnum: Allnum
      });
      for (var i = 0; i < that.data.selectGoods.length; i++) {
        if (
          that.data.selectGoods[i].id ==
          that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex].id
        ) {
          selectGoods.splice(
            i,
            1,
            that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex]
          );
          that.setData({
            selectGoods: selectGoods,
            isSecond: false
          });
        }
      }

      wx.setStorageSync("selectGoods", that.data.selectGoods);
      wx.setStorageSync("Allprice", that.data.Allprice);
      wx.setStorageSync("Allnum", that.data.Allnum);
    } else {
      that.data.data.arr[that.data.selectedTitle][
        that.data.nowcurrIndex
      ].mytotal = num;
      that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex]
        .mytotal++;
      that.data.data.arr[that.data.selectedTitle][
          that.data.nowcurrIndex
        ].marketprice =
        that.data.nowPrice;
      Allprice =
        Allprice +
        parseInt(
          that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex]
          .marketprice
        );
      Allnum++;
      selectGoods.push(
        that.data.data.arr[that.data.selectedTitle][that.data.nowcurrIndex]
      );
      that.setData({
        data: that.data.data,
        Allprice: Allprice,
        Allnum: Allnum,
        selectGoods: selectGoods,
        isSecond: false
      });
    }
    wx.setStorageSync("selectGoods", that.data.selectGoods);
    wx.setStorageSync("Allprice", that.data.Allprice);
    wx.setStorageSync("Allnum", that.data.Allnum);
  },
  // 关闭二级
  closeSecond: function(e) {
    var that = this;
    that.setData({
      isSecond: false
    });
  },
  allAdd: function(e) {
    var that = this;
    if (wx.getStorageSync("selectGoods")) {
      that.setData({
        selectGoods: wx.getStorageSync("selectGoods"),
        Allprice: wx.getStorageSync("Allprice"),
        Allnum: wx.getStorageSync("Allnum")
      });
    }
    var currIndex = e.currentTarget.dataset.index;
    that.data.selectGoods[currIndex].mytotal++;
    Allprice =
      Allprice + parseInt(that.data.selectGoods[currIndex].marketprice);
    that.setData({
      selectGoods: that.data.selectGoods,
      Allprice: Allprice
    });
    that.data.data.arr[0][0] = that.data.selectGoods[currIndex];
    that.setData({
      data: that.data.data
    });
    for (var i = 0; i < that.data.data.length; i++) {
      for (var x in that.data.data.arr[i][x]) {
        if (
          that.data.selectGoods[currIndex].id == that.data.data.arr[i][x].id
        ) {
          that.data.data.arr[i][x] = that.data.selectGoods[currIndex];
          that.setData({
            data: that.data.data
          });
        }
      }
    }
    wx.setStorageSync("selectGoods", that.data.selectGoods);
    wx.setStorageSync("Allprice", that.data.Allprice);
    wx.setStorageSync("Allnum", that.data.Allnum);
  },
  allDelete: function(e) {
    var that = this;
    if (wx.getStorageSync("selectGoods")) {
      that.setData({
        selectGoods: wx.getStorageSync("selectGoods"),
        Allprice: wx.getStorageSync("Allprice"),
        Allnum: wx.getStorageSync("Allnum")
      });
    }
    var currIndex = e.currentTarget.dataset.index;
    that.data.selectGoods[currIndex].mytotal--;
    Allprice =
      Allprice - parseInt(that.data.selectGoods[currIndex].marketprice);
    Allnum--;
    if (that.data.selectGoods[currIndex].mytotal >= 1) {
      that.setData({
        selectGoods: that.data.selectGoods,
        Allprice: Allprice,
        Allnum: Allnum
      });

      for (var y = 0; y < that.data.data.arr.length; y++) {
        for (var a = 0; a < that.data.data.arr[y].length; a++) {
          if (
            that.data.data.arr[y][a].id == that.data.selectGoods[currIndex].id
          ) {
            that.data.data.arr[y][a] = that.data.selectGoods[currIndex];
            that.setData({
              data: that.data.data
            });
          }
        }
      }
      wx.setStorageSync("selectGoods", that.data.selectGoods);
      wx.setStorageSync("Allprice", that.data.Allprice);
      wx.setStorageSync("Allnum", that.data.Allnum);
    } else if (that.data.selectGoods[currIndex].mytotal <= 0) {
      for (var y = 0; y < that.data.data.arr.length; y++) {
        for (var a = 0; a < that.data.data.arr[y].length; a++) {
          if (
            that.data.data.arr[y][a].id == that.data.selectGoods[currIndex].id
          ) {
            that.data.data.arr[y][a].mytotal = 0;
            that.setData({
              data: that.data.data
            });
          }
        }
      }
      that.data.selectGoods.splice(currIndex, 1);
      that.setData({
        selectGoods: that.data.selectGoods,
        Allprice: Allprice,
        Allnum: Allnum
      });

      if (that.data.selectGoods.length == 0) {
        that.setData({
          showView: false
        });

        that.data.data = that.data.dataonload;
        that.setData({
          selectGoods: [],
          showView: false,
          Allnum: 0,
          Allprice: 0,
          data: that.data.data
        });
        Allnum = 0;
        Allprice = 0;
        selectGoods = [];
        wx.removeStorageSync("selectGoods");
        wx.removeStorageSync("Allprice");
        wx.removeStorageSync("Allnum");
      }
      wx.setStorageSync("selectGoods", that.data.selectGoods);
      wx.setStorageSync("Allprice", that.data.Allprice);
      wx.setStorageSync("Allnum", that.data.Allnum);
      wx.setStorageSync("data", that.data.data);
    }
  },
  show: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var id = e.currentTarget.id;
    this.data.data.selectedTitle = id;
    this.setData({
      selectedTitle: id,
      twoindex: id
    });
    that.setData({
      refresh: false
    });
    page = 1;
  },
  // 餐饮打电话
  click_phone: function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.data.test.shopinfo.phone
    });
  },
  // 控制点餐的购物车的显示方法
  topShow: function() {
    var that = this;
    this.setData({
      showView: false
    });
  },
  //购物车结算
  bindCheckout: function() {
    var that = this;
    for (var i = 0; i < that.data.selectGoods.length; i++) {
      for (var x in that.data.selectGoods[i]) {
        if (
          x != "id" &&
          x != "merchid" &&
          x != "mytotal" &&
          x != "marketprice"
        ) {
          delete that.data.selectGoods[i][x];
        }
      }
    }
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: "?r=wxapp.member.cart.updateCart",
      that: that,
      data: {
        utoken: utoken,
        goodslist: that.data.selectGoods
      },
      method: "POST",
      success: function(res) {
        that.data.data = that.data.dataonload;
        that.setData({
          selectGoods: [],
          showView: false,
          Allnum: 0,
          Allprice: 0,
          data: that.data.data
        });
        Allnum = 0;
        Allprice = 0;
        selectGoods = [];
        // 清除缓存
        wx.removeStorageSync("selectGoods");
        wx.removeStorageSync("Allprice");
        wx.removeStorageSync("Allnum");
        wx.navigateTo({
          url: "../../../../order/checkout/checkout"
        });
      }
    });
  },
  //清空购物车的全部商品的方法
  deleteCart: function() {
    var that = this;
    that.data.data = that.data.dataonload;
    that.setData({
      selectGoods: [],
      showView: false,
      Allnum: 0,
      Allprice: 0,
      data: that.data.data
    });
    Allnum = 0;
    Allprice = 0;
    selectGoods = [];

    // 清除缓存
    wx.removeStorageSync("selectGoods");
    wx.removeStorageSync("Allprice");
    wx.removeStorageSync("Allnum");
  },
  // 优惠券方法
  bindcoupon: e => {
    let id = e.currentTarget.dataset.id;
    let that = this;
    let logid;
    if (id) {
      let utoken = wx.getStorageSync('utoken');
      server.sendRequest({
        url: "?r=wxapp.sale.coupon.detail.pay",
        data: {
          utoken: utoken,
          id: id,
          jie: 1
        },
        method: "GET",
        success: function(res) {
          var x = res.data.msg;
          if (res.data.status == 1) {
            logid = res.data.result.logid;
            // 有企业支付直接微信支付
            if (res.data.result.result) {
              if (res.data.result.result && res.data.result.wechat) {
                server.globalData.wxdata = res.data.result.result;
                server.globalData.order = res.data.result.wechat;
                that.setData({
                  paydata: res.data.result.data,
                  order: res.data.result.order
                });
                var wxdata = server.globalData.wxdata;
                var timeStamp = wxdata.timeStamp + "";
                that.pay();
                return;
              } else {
                wx.showModal({
                  title: "提示",
                  showCancel: false,
                  content: "请开通企业支付,领取失败",
                  success: function(res) {}
                });
              }
            } else {
              server.sendRequest({
                url: "?r=wxapp.sale.coupon.detail.payresult",
                data: {
                  utoken: utoken,
                  logid: logid
                },
                method: "GET",
                success: function(res) {
                  setTimeout(function() {
                    wx.showToast({
                      title: "领取成功",
                      icon: "success",
                      duration: 1000
                    });
                  }, 500);
                }
              });
            }
          } else if (res.data.status == -1) {
            setTimeout(function() {
              wx.showToast({
                title: "" + x,
                icon: "success",
                duration: 1000
              });
            }, 500);
          } else {
            wx.showLoading({
              title: "领取成功"
            });
          }
        }
      });
    } else {
      wx.showToast({
        title: "暂无此优惠券",
        icon: "loading",
        duration: 1000
      });
    }
  },
  // 支付
  pay: function() {
    var that = this;
    var wxdata = server.globalData.wxdata;
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package;
    var sign = wxdata.sign;
    let utoken = wx.getStorageSync('utoken');
    wx.requestPayment({
      nonceStr: nonceStr,
      package: package1,
      signType: "MD5",
      timeStamp: timeStamp,
      paySign: sign,
      success: function(res) {
        server.sendRequest({
          url: "?r=wxapp.sale.coupon.detail.payresult",
          data: {
            utoken: utoken,
            logid: logid
          },
          method: "GET",
          success: function(res) {
            wx.navigateTo({
              url: "../getCoupon/getCoupon"
            });
          }
        });
      },
      fail: function(res) {
        wx.showToast({
          title: "支付失败",
          icon: "success",
          duration: 2000
        });
      }
    });
  },
  getToPageMenDian: function(e) {
    wx.navigateTo({
      url: "/packageA/pages/store/detail/index?active=2&id=" + e.currentTarget.dataset.storeid
    });
  },
  // 预约
  formSubmitX: function(e) {
    let arr = [];
    var dataX = e.detail.value;
    for (let x in dataX) {
      arr[x] = dataX[x];
      if (dataX[x] == "") {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: `${x}不能为空`,
          success: function(res) {
            if (res.confirm) {}
          }
        });
        return;
      }
    }
    let utoken = wx.getStorageSync('utoken');
    server.getUserInfo(function() {
      server.sendRequest({
        url: "?r=wxapp.indexpage.post",
        method: "POST",
        data: {
          wxpage_id: "",
          arr: arr,
          utoken: utoken
        },
        success: function(res) {
          wx.showModal({
            title: "消息",
            content: "预约成功",
            showCancel: false
          });
        }
      });
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
})