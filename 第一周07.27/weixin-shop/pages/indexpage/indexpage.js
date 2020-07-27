var WxParse = require('../../wxParse/wxParse.js');
var server = require('../../utils/server.js');
var seat;
var utoken = wx.getStorageSync("utoken");
let page=1;
var pageData = {
  data: {
    bannerHeight: Math.ceil(290.0 / 750.0 * getApp().screenWidth),
    swiperArr: "",
    showIndex: false,
    width: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    arr: {},
    markers: [],
    controls: [{
      id: 0,
      iconPath: '../../images/fixedPosition.png',
      position: {
        left: 175,
        top: 280,
        width: 35,
        height: 35
      },
      clickable: true
    },
    {
      id: 1,
      iconPath: '../../images/mapPosition.png',
      position: {
        left: 320,
        top: 480,
        width: 35,
        height: 35
      },
      clickable: true,
      groupRecgoods: '',
    }
    ],
    loading: true,
    myName: '',
    myAddr: '',
    artData: [],
    artListstyle: '',
    artTitlecolor: '',
    artDesccolor: '',
    artDataB: [],
    artListstyleB: '',
    artTitlecolorB: '',
    artDesccolorB: '',
    artDataA: '',
    shareIcon: false
  },
  controltap(e) {
    var that = this;
    if (e.controlId == 1) {
      this.mapCtx.moveToLocation()
    }

    if (e.controlId == 0) {
      wx.openLocation({
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        scale: 28,
        name: that.data.myName,
        address: that.data.myAddr
      })
    }

  },

  onLoad: function (options) {
    console.log(options)
    if (options.share) {
      this.setData({
        shareIcon: true
      })
    }
    var that = this;
    utoken = wx.getStorageSync("utoken");
    that.mapCtx = wx.createMapContext('map');

    if (options.mid) {
      that.setData({
        mid: options.mid,
      });
      var midX = wx.setStorageSync("mid", options.mid);
      var midZ = wx.getStorageSync("mid");
    }
    var id = '';
    if (options.id) {
      id = options.id
    } else {
      options.id = '';

    }
    that.setData({
      options: options,
      id: id
    })
    that.loadPageData(options);
    //	this.loadPageData();
  },

  onShow: function () {
    var that = this;
    that.getGroupList();
    console.log(that.data.id)
    console.log('that.data.id------------')
    // that.loadPageData(that.data.id);
    if (!that.data.id) {
      //  console.log('showTabBar------------------')
      that.loadPageData(that.data.id);
      wx.showTabBar()
      that.setData({
        showIndex: false
      })
    } else {
      //console.log('hideTabBar------------------')
      wx.hideTabBar();
      that.setData({
        showIndex: true
      })
    }

  },// 团购组
  getGroupList: function () {
    var that = this;
    server.sendRequest({
      url: "?r=wxapp.groups",
      showToast: false,
      data: {
        utoken: utoken,
        page: page
      },
      method: "GET",
      success: function (res) {
        if (res.data.result) {
          that.setData({
            groupRecgoods: res.data.result.recgoods
          });
        }
      }
    });
  },
  onUnloadonUnloadonUnloadonUnloadonUnloa: function () {
    var that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    if (extConfig.tabBarPage) {
      var tabBarPage = extConfig.tabBarPage;
      for (var i in tabBarPage) {
        if (tabBarPage[i] == '/pages/indexpage/indexpage') {
          that.setData({
            id: ''
          })
        }
      }
    }
    this.setData({
      loading: false
    })
  },

  returbBack() {
    console.log('returbBack')
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  onPullDownRefresh: function () {
   utoken = wx.getStorageSync("utoken");
    wx.stopPullDownRefresh();
  },
  loadPageData: function (options) {
    var that = this;
    server.sendRequest({
      //  url: '?r=wxapp.indexpage.index&id='+that.data.id,
      url: '?r=wxapp.indexpage.index',
      data: {
        id: that.data.id
      },
      method: 'GET',
      success: function (res) {

        that.setData({
          data: res.data,
          loading: false,
        });
        var is_pinpoint;
        if (res.data.data.page) {
          if (res.data.data.page.is_pinpoint) {
            is_pinpoint = res.data.data.page.is_pinpoint;
          }
          wx.setNavigationBarTitle({
            title: res.data.data.page.title,
          });
          var frontColorMy = '';
          if (res.data.data.page.titlecolor == 'white') {
            frontColorMy = '#ffffff';
          } else if (res.data.data.page.titlecolor == 'black') {
            frontColorMy = '#000000';
          } else {
            frontColorMy: res.data.data.page.titlecolor
          }
          wx.setNavigationBarColor({
            //  frontColor: res.data.data.page.titlecolor,
            frontColor: frontColorMy,
            backgroundColor: res.data.data.page.backgroundcolor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })

        }
        try {
          if (res.data.data.items) {
            var Data = res.data.data.items;
          }
        } catch (err) { }
        for (var x in res.data.data.items) {

          switch (res.data.data.items[x].id) {


            case "merchgroup":
              if (res.data.data.items[x].params.openlocation == '1') {
                if (options.lng) {
                  that.setData({
                    listLat: options.lat,
                    listLng: options.lng
                  });
                  server.sendRequest({
                    url: '?r=wxapp.shop.list&lat=' + options.lat + '&lng=' + options.lng + '&site=0',
                    showToast: false,
                    data: {
                      is_pinpoint: is_pinpoint
                    },
                    method: 'GET',
                    success: function (res) {

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
                  })
                } else {
                  wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                      var lat = res.latitude;
                      var lng = res.longitude;
                      that.setData({
                        listLat: lat,
                        listLng: lng,
                      });
                      server.sendRequest({
                        url: '?r=wxapp.shop.list&lat=' + res.latitude + '&lng=' + res.longitude + '&site=0',
                        showToast: false,
                        data: {
                          is_pinpoint: is_pinpoint
                        },
                        method: 'GET',
                        success: function (res) {
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
                                }
                                that.setData({
                                  search: search
                                });
                                var address = that.data.search.item.address;
                                var arr = address.split('');
                                if (arr.length >= 6) {
                                  var add = []
                                  for (let x in arr) {
                                    if (x < 6) {
                                      add.push(arr[x])
                                    }
                                  }
                                  add = add.join('');
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
                      })
                    },
                  })
                }
              };
              break;

            case "search":
              that.setData({
                paddingleft: res.data.data.items[x].style.paddingleft
              })
              console.log(that.data.paddingleft)
              wx.getSystemInfo({
                success: function (res) {
                  that.setData({
                    windowWidthS: res.windowWidth * 2 - that.data.paddingleft * 10
                  })
                  console.log(that.data.windowWidthS)
                }
              })

              break;
            case "map":
              console.log('map-----------')
              var latitude = res.data.data.items[x].style.latitude;
              var longitude = res.data.data.items[x].style.longitude;
              if (typeof res.data.data.items[x].style.addr != 'undefined') {
                that.setData({
                  myAddr: res.data.data.items[x].style.addr,
                  myName: '位置'
                })
              }
              var markers = [{
                iconPath: "../../images/hotelPosition.png",
                id: 0,
                latitude: latitude,
                longitude: longitude,
                width: 30,
                height: 30,
                callout: {
                  content: '我在这里喔',
                  color: "#fff",
                  display: 'BYCLICK',
                  bgColor: '#FC6969',
                  padding: 20,
                  borderRadius: 5
                }
              }];
              that.setData({
                markers: markers,
                latitude: parseFloat(res.data.data.items[x].style.latitude),
                longitude: parseFloat(res.data.data.items[x].style.longitude)
              })
              break;
            case "article":
              if (res.data.data.items[x].style.liststyle == 'block one') {
                var artData = []
                for (var i in res.data.data.items[x].data) {
                  artData.push(res.data.data.items[x].data[i])
                }
                that.setData({
                  artData: artData
                })
                console.log('block one', artData)
              } else if (res.data.data.items[x].style.liststyle == 'block two') {
                var artDataB = []
                for (var i in res.data.data.items[x].data) {
                  artDataB.push(res.data.data.items[x].data[i])
                }
                that.setData({
                  [`artDataB[${x}]`]: artDataB
                })
                console.log('block two', artDataB)
              } else {
                console.log('空的')
                that.setData({
                  artDataA: res.data.data.items[x]
                })
              }
              break;
          }
        }
      }

    })
  },

  storebtn: function (e) {
    wx.navigateTo({
      //    url: '../shoppage/index?id='+e.currentTarget.id,
      url: '../goods/shop/shop?id=' + e.currentTarget.id,
    })
  },

  getToPage: function (e) {
    var that = this
    var imgUrl = []
    var urlLink = ''
    console.log('pre', e)
    urlLink = e.currentTarget.dataset.link
    if (e.currentTarget.dataset.groupimg) {
      imgUrl.push(e.currentTarget.dataset.groupimg)
    }
    if (e.currentTarget.dataset.preview == 1) {
      wx.previewImage({
        current: '',
        urls: imgUrl
      })
    } else {
      console.log('这里吗')
      server.getToPage(e);
    }
  },
  // search: function (e) {
  //   wx.navigateTo({
  //     url: "../search/index"
  //   });
  // },
  getInviteCode: function (options) {
    if (options.uid != undefined) {
      wx.showToast({
        title: '来自用户:' + options.uid + '的分享',
        icon: 'success',
        duration: 2000
      })
    }
  },
  // 团购组
  getGroupList: function () {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.groups',
      showToast: false,
      data: {
        utoken: utoken,
        page: page
      },
      method: 'GET',
      success: function (res) {
        console.log('111', res.data.result.category);
        console.log('222', res);
        if (res.data.result) {
          that.setData({
            groupRecgoods: res.data.result.recgoods,
          })
        }
      }
    })
  },
  //进入团购页面
  intoGroupList: function () {
    wx.navigateTo({
      url: '../bottom/groupbuy/index'
    })
  },
  //进入门店
  getToPageMenDian: function (e) {
    console.log(e)
    wx.navigateTo({
      url: "/packageA/pages/store/detail/index?active=2&id=" + e.currentTarget.dataset.storeid
    })
  },
  // 热卖团购详情页面
  toGroupDetail: function (res) {
    console.log('res', res.currentTarget)
    wx.navigateTo({
      url: "/packageA/pages/groupbuy/detail/index?id=" + res.currentTarget.id
    })
  },
  onShareAppMessage: function () {
    return {
      title: "小程序：" + this.userinfo.name,
      path: "/pages/index/index?uid=4719784&share='share'"
    }
  },
  call: function (e) {
    let id = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ["拨打电话", "取消"],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: id
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  formSubmit: function (res) {
    wx.navigateTo({
      url: "../goods/list/list?keywords=" + res.detail.value
    });
  },
  formSubmitX: function (e) {
    // console.log('ssssssss')
    // console.log(utoken);
    if (!utoken) {
      wx.showModal({
        title: '提示',
        content: '请删除小程序，允许授权才能提交',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            return;
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    var dataX = e.detail.value;
    for (let x in dataX) {
      this.data.arr[x] = dataX[x]
      if (dataX[x] == '') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: `${x}不能为空`,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return;

      }
    }
    server.sendRequest({
      url: '?r=wxapp.indexpage.post',
      method: 'POST',
      data: {
        wxpage_id: this.data.id,
        arr: this.data.arr,
        utoken: utoken
      },
      success: function (res) {
        wx.showModal({
          title: '消息',
          content: '预约成功',
          showCancel: false
        })
      }
    })
  },
};

Page(pageData)