var server = require('../../utils/server');
var utoken = wx.getStorageSync("utoken");
var top_categorys, page = 1,
  arrIndex = [],
  tsx = [],
  txarr = [],
  level, objectId, num, name_arr = [];
Page({
  data: {
    loading: true,
    topCategories: [],
    subCategories: [],
    highlight: ['highlight', '', '', '', '', '', '', '', '', '', '', ''],
    highlight4: ['highlight4', '', '', '', '', '', '', '', '', '', '', ''],
    banner: '',
    index: 0,
    refresh: false,
    input: '',
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 1.5,
    refresh: false,
    noMoreData: false,
    diymenu: '',
    scrollHeight: Math.ceil(wx.getSystemInfoSync().windowHeight),
    show: false,
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    addSpecId: '',
    sum: 0,
    total: 1,
    showb: false,
    templateID: ''
  },
  onLoad: function () {
    var that = this;
    that.setData({
      templateID: wx.getStorageSync('templeid')
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight - 100
        })
      }
    })
    name_arr = [];
    that.leftDate();
  },

  leftDate: function () {
    var that = this;
    var utoken = wx.getStorageSync("utoken");

    // 判断是否添加自定义底部
    if (wx.getStorageSync("diymenu")) {
      that.setData({
        diymenu: wx.getStorageSync("diymenu")
      })
    }
    var url = that.data.templateID == '12' ? '?r=wxapp.shop.takingOrder.serviceCatergory' : '?r=wxapp.shop.takingOrder.getCategory';
    server.sendRequest({
      url: url,
      showToast: false,
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          loading: false
        });
        if (that.data.templateID == '12') {
          that.setData({
            topCategories: res.data.result.data.parent,
            objectId: res.data.result.data.parent[0].id
          })
          that.rightData(res.data.result.data.parent[0].id);
        } else {
          level = res.data.result.level;
          var parentList, parentFirstId, parentFirstTitle;
          if (res.data.result.data.parent) {
            parentList = res.data.result.data.parent
            if (res.data.result.data.parent[0]) {
              parentFirstId = res.data.result.data.parent[0].id;
              parentFirstTitle = res.data.result.data.parent[0].name
            }
          }
          that.setData({
            topCategories: parentList,
            level: level,
            id: parentFirstId,
            imgguangg: res.data.result.catadvimg
          });

          server.reportedData('change_goods_classify', {
            classify_id: parentFirstId,
            classify_name: parentFirstTitle
          });
          that.rightData(parentFirstId);
        }
      }
    })
  },
  rightData: function (objectId) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    var url = that.data.templateID == '12' ? '?r=wxapp.shop.takingOrder.getServiceGoodsList' : '?r=wxapp.shop.takingOrder.getCategoryGoodsList';
    server.sendRequest({
      url: url,
      data: {
        category_id: objectId,
        page: 1,
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        if (that.data.templateID == '12') {
          that.setData({
            subCategorListG: res.data.result.goods.list,
          })
        } else {
          if (level == 1 || level == 4) {
            if (res.data.result.goods != '') {
              that.setData({
                subCategorListG: res.data.result.goods,
              })
            } else {
              that.setData({
                subCategorListG: res.data.result.goods,
              })
            }
          } else if (level == 2) {
            that.setData({
              subCategorListC: res.data.result.children,
            })

          }
          if (res.data.result.cart) {
            that.setData({
              newStyle: res.data.result.cart
            })
          }
        }
      }
    })

  },

  onShow: function () {
    var that = this;
    that.setData({
      input: ''
    })
    if (wx.getStorageSync('categoryItem')) {
      objectId = wx.getStorageSync('categoryItem').categoryId;
      let index = parseInt(wx.getStorageSync('categoryItem').categoryIndex);
      that.setHighlight(index);
      that.setData({
        index
      })
      page = 1;
      this.rightData(objectId)
    }
  },
  setinputValue(e) {
    this.setData({
      input: e.detail.value
    })
  },
  formSubmit: function () {
    if (this.data.templateID == '12') {
      wx.navigateTo({
        url: "/packageA/pages/services/search/search?keywords=" + this.data.input
      });
    } else {
      wx.navigateTo({
        url: "/pages/goods/list/list?keywords=" + this.data.input
      });
    }
  },
  tapTopCategory: function (e) {
    console.log(e)
    var that = this;
    objectId = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.banner;
    var index = parseInt(e.currentTarget.dataset.index);
    var level = e.currentTarget.dataset.level;

    that.setHighlight(index);
    that.setData({
      index: index,
      id: objectId,
      refresh: false,
      noMoreData: false
    });
    page = 1;
    that.rightData(objectId);

    //数据埋点切换分类
    server.reportedData('change_goods_classify', {
      classify_id: objectId,
      classify_name: name
    });
  },
  setHighlight: function (index) {
    var highlight = [];
    var highlight4 = [];
    for (var i = 0; i < this.data.topCategories; i++) {
      highlight[i] = '';
      highlight4[i] = '';
    }
    highlight[index] = 'highlight';
    highlight4[index] = 'highlight4';
    this.setData({
      highlight: highlight,
      highlight4: highlight4
    });
  },
  avatarTap: function (e) {
    var that = this;
    objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: "../goods/list/list?categoryId=" + objectId
    });
  },
  avatarDetail: function (e) {
    var that = this;
    var objectIdD = e.currentTarget.dataset.objectId;
    if (this.data.templateID == '12') {
      wx.navigateTo({
        url: "/packageA/pages/services/detail/index?objectId=" + objectIdD
      })
    } else {
      wx.navigateTo({
        url: "/pages/goods/detail/detail?objectId=" + objectIdD
      })
    }
  },
  bottom: function (e) {

    var that = this;
    if (that.data.refresh) return;
    that.setData({
      refresh: true,
      noMoreData: false
    });

    page = page + 1;
    var utoken = wx.getStorageSync("utoken");
    var url = that.data.templateID == '12' ? '?r=wxapp.shop.takingOrder.getServiceGoodsList' : '?r=wxapp.shop.takingOrder.getCategoryGoodsList';
    server.sendRequest({
      url: url,
      data: {
        category_id: that.data.id,
        page: 1,
        utoken: utoken,
        page: page
      },
      method: 'GET',
      success: function (res) {

        if (that.data.templateID == '12') {
          var arr = [];
          for (let x in that.data.subCategorListG) {
            arr.push(that.data.subCategorListG[x]);
          }
          if (res.data.result.goods.list) {
            for (let y in res.data.result.goods.list) {
              arr.push(res.data.result.goods.list[y]);
            }
            that.setData({
              subCategorListG: arr,
              refresh: false
            });
          } else {
            page = page - 1;
          }
        } else {
          var arr = [];
          if (level == 1 || level == 4) {
            for (let x in that.data.subCategorListG) {
              arr.push(that.data.subCategorListG[x]);
            }
            if (res.data.result.goods) {
              for (let x in res.data.result.goods) {
                arr.push(res.data.result.goods[x]);
              }
              that.setData({
                subCategorListG: arr,
                refresh: false
              });
            } else {
              page = page - 1;
              that.setData({
                noMoreData: true
              });
            }
          } else {
            for (let x in that.data.subCategorListC) {
              arr.push(that.data.subCategorListC[x]);
            }
            if (res.data.result.goods) {
              for (let x in res.data.result.goods) {
                arr.push(res.data.result.goods[x]);
              }
              that.setData({
                subCategorListC: arr,
                refresh: false
              });
            } else {
              page = page - 1;
              that.setData({
                noMoreData: true
              });
            }
          }
        }


      }
    });

  },
  // 自定义底部
  diy_phone: function () {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync("tel")
    })
  },
  diy_index: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  add: function (e) {
    server.getUserInfo(function () {});
    //  这里写获取授权成功后的回调
    var that = this
    var index = parseInt(e.currentTarget.dataset.index);
    var goodsidd = parseInt(e.currentTarget.dataset.id);
    var sum = parseInt(that.data.subCategorListG[index].goods.showtotal)
    for (let i in that.data.subCategorListG) {
      if (that.data.subCategorListG[i].goods_spec_list) {
        that.setData({
          show: true
        })
        if (e.currentTarget.dataset.id == that.data.subCategorListG[i].goods.id) {
          that.setData({
            specData: that.data.subCategorListG[i].goods_spec_list,
            title: that.data.subCategorListG[i].goods.title,
            guigePrice: that.data.subCategorListG[i].goods.marketprice,
            addSpecId: e.currentTarget.dataset.id,
            goodsidd: goodsidd,
            index: index
          })

        }
      }
    }
  },
  addNoGz: function (e) {
    server.getUserInfo(function () {

    });
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var goodsis = parseInt(e.currentTarget.dataset.id);
    var sum = parseInt(that.data.subCategorListG[index].goods.showtotal)
    for (let j in that.data.subCategorListG) {
      if (that.data.subCategorListG[j].goods.id == goodsis) {
        sum = that.data.subCategorListG[j].goods.showtotal

        sum++
        if (parseInt(sum) > parseInt(that.data.subCategorListG[j].goods.total)) {
          wx.showToast({
            title: '库存不足',
          })
        } else {
          that.data.subCategorListG[index].goods.showtotal = sum
          var subCategorListG = this.data.subCategorListG;
          subCategorListG[index].goods.showtotal = sum;
          this.setData({
            subCategorListG: subCategorListG,
          });
          server.sendRequest({
            url: '?r=wxapp.member.cart.add',
            data: {
              utoken: utoken,
              id: goodsis,
              total: 1,
              diyformdata: false
            },
            method: 'GET',
            success: function (res) {
              that.setData({
                showb: true
              })
              setTimeout(function () {
                that.setData({
                  showb: false
                })
              }, 1500)

            }
          })
        }
      }
    }
  },
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
    var goodsB = this.data.subCategorListG
    for (var t in goodsB) {
      if (that.data.addSpecId == goodsB[t].goods.id) {
        if (goodsB[t].spec_goods_price && goodsB[t].spec_goods_price[pos].price != "null") {
          this.setData({
            guigePrice: goodsB[t].spec_goods_price[pos].price,
          })
        } else {
          this.setData({
            guigePrice: goodsB[t].goods.marketprice,
          })
        }
        for (var i = 0; i < goodsB[t].goods_spec_list[index].length; i++) {
          if (i == pos) {
            goodsB[t].goods_spec_list[index][pos].isClick = 1;
            arrIndex[index] = e.currentTarget.id;
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
        for (var ssss in that.data.subCategorListG[t].goods_spec_list) {
          var ts = [];
          ts.push(that.data.subCategorListG[t].goods_spec_list[ssss].length)
          ts.push(ssss);
          if (tsx.length < that.data.subCategorListG[t].goods_spec_list.length) {
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
          goods: goodsB,
          specData: goodsB[t].goods_spec_list
        });
        this.checkPrice();
        for (var x in that.data.subCategorListG[t].spec_goods_price) {
          if (that.data.subCategorListG[t].spec_goods_price[x].key == str) {
            that.setData({
              guigePrice: that.data.subCategorListG[t].spec_goods_price[x].price,
            })
          }
        }
        if (ss_t.length != goodsB[t].goods_spec_list.length) {
          let guigePrice, store_count;
          for (let x in that.data.subCategorListG[t].spec_goods_price) {
            guigePrice = that.data.subCategorListG[t].spec_goods_price[x].price,
              store_count = that.data.subCategorListG[t].spec_goods_price[x].store_count
            if ((that.data.subCategorListG[t].spec_goods_price[x].key).indexOf(item_id) > -1) {
              break;
            }
          }
          that.setData({
            guigePrice,
          })
        } else {}
      }
    }
  },
  checkPrice: function () {
    var that = this
    var goodsB = this.data.subCategorListG;
    for (var t in goodsB) {
      if (that.data.addSpecId == goodsB[t].goods.id) {
        var spec = "";
        if (!goodsB[t].goods || !goodsB[t].goods_spec_list) {
          return
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
            price: price,
            guigePrice: price
          });
        }
      }
    }
  },
  buyCart: function (e) {
    var that = this
    var goodsB = that.data.subCategorListG
    for (var t in goodsB) {
      if (that.data.addSpecId == goodsB[t].goods.id) {
        if (goodsB[t].goods_spec_list != null) {
          if (that.data.name_arr == undefined) {
            wx.showModal({
              showCancel: false,
              content: '请选择规格',
            })
            return
          }
          for (let x in goodsB[t].goods_spec_list) {
            if (!that.data.name_arr[x]) {
              wx.showModal({
                showCancel: false,
                content: '请选择规格',
              })
              return
            }
          }
        }
      }
    }
    for (let i in that.data.subCategorListG) {
      if (that.data.subCategorListG[i].goods.id == that.data.goodsidd) {
        server.sendRequest({
          url: '?r=wxapp.member.cart.add',
          data: {
            utoken: utoken,
            id: that.data.goodsidd,
            optionid: that.data.optionid,
            total: that.data.total,
            diyformdata: false
          },
          method: 'GET',
          success: function (res) {
            // wx.showToast({
            //   title: '添加成功',
            //   icon: 'success',
            // })
            that.setData({
              showb: true
            })
            setTimeout(function () {
              that.setData({
                showb: false,
                show: false
              })
            }, 1500)
            txarr = []
            for (let v in that.data.subCategorListG) {
              for (let j in that.data.subCategorListG[v].goods_spec_list) {
                var subCategorListG = that.data.subCategorListG
                for (let o in subCategorListG[v].goods_spec_list[j]) {
                  subCategorListG[v].goods_spec_list[j][o].isClick = 0
                  that.setData({
                    subCategorListG: subCategorListG
                  })
                }
              }
            }
            that.setData({
              total: 1
            })
          }
        })
        // }

      }
    }
    name_arr = []
    tsx = []
  },
  redux: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var goodsis = parseInt(e.currentTarget.dataset.id);
    var sum = parseInt(that.data.subCategorListG[index].goods.showtotal)
    for (let j in that.data.subCategorListG) {
      if (that.data.subCategorListG[j].goods.id == goodsis) {
        sum = that.data.subCategorListG[j].goods.showtotal
        sum--
        if (parseInt(sum) < 0) {
          wx.showToast({
            title: '数量不能小于0',
          })
        } else {
          that.data.subCategorListG[index].goods.showtotal = sum
          var subCategorListG = this.data.subCategorListG;
          subCategorListG[index].goods.showtotal = sum;
          this.setData({
            subCategorListG: subCategorListG,
          });

          server.sendRequest({
            url: '?r=wxapp.member.cart.update',
            data: {
              utoken: utoken,
              id: goodsis,
              total: 1,
              optionid: ''
            },
            method: 'GET',
            success: function (res) {}
          })
        }
      }
    }

  },
  addB: function (e) {
    var that = this
    var numberB
    numberB = that.data.total
    var addid = e.currentTarget.dataset.id
    for (let i in that.data.subCategorListG) {
      if (that.data.subCategorListG[i].goods.id == addid) {
        if (that.data.subCategorListG[i].goods.total <= numberB) {
          wx.showToast({
            title: '库存不足',
          })
        } else {
          numberB++
          that.setData({
            total: parseInt(numberB)
          })
        }
      }
    }
  },
  reduxB: function (e) {
    var that = this
    var numberB
    numberB = that.data.total
    var addid = e.currentTarget.dataset.id
    if (numberB <= 1) {
      wx.showToast({
        title: '不能小于1',
      })
    } else {
      numberB--
      that.setData({
        total: parseInt(numberB)
      })
    }
  },
  sql: function () {
    this.setData({
      show: false
    })
  }
})