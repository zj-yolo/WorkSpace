var server = require('../../utils/server');

var startPoint, move_index, move_arr = [];
// var maxbuy, minbuy, usermaxbuy, totalmaxbuy;

Page({
  data: {
    loading: true,
    carts: [],
    goodsList: [],
    empty: true,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    selectedAllStatus: true,
    total: '',
    maxbuy:0,
    minbuy:0,
    usermaxbuy:0,
    totalmaxbuy:0
  },
  onLoad: function (option) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        var height = height - height / 750.0 * 60;
        that.setData({
          height: height
        })
      }
    })
  },
  toIndex: function () {
    wx.reLaunch({
      url: "../index/index"
    })
  },
  onPullDownRefresh: function () {
    this.getCarts();
    wx.stopPullDownRefresh()
  },
  // 页面跳转的方法
  getToPage: function (event) {
    wx.switchTab({
      url: '../index/index'
    })
  },
  joinDetail: function (e) {

    wx.navigateTo({
      url: '../goods/detail/detail?objectId=' + e.currentTarget.dataset.goodsid,
    })
  },
  bindMinus: function (e) {

  console.log(e)

    var index = parseInt(e.currentTarget.dataset.index);
    var merchid = parseInt(e.currentTarget.dataset.merchid);
    var num = this.data.carts[merchid][index].total;
    this.setData({
      minbuy:parseInt(e.currentTarget.dataset.minbuy)
    })
 


    if (this.data.minbuy > 0) {
      if (num > this.data.minbuy) {
        num--;
      } else {
        wx.showToast({
          title: '单次最少购买' + this.data.minbuy + e.currentTarget.dataset.unit,
          image: '../../images/goodsNote.png',
          duration: 2000
        })
      }

    } else {
      if (num > 1) {
        num--;
      }
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var carts = this.data.carts;
    carts[merchid][index].total = num;
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
 
  },
  bindPlus: function (e) {

    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var merchid = parseInt(e.currentTarget.dataset.merchid);
    var goodsid = parseInt(e.currentTarget.dataset.goodsid);
    var num = that.data.carts[merchid][index].total,
      limiNum,
      hasNum=0,
      totalNum = that.data.carts[merchid][index].total;
      that.setData({
        maxbuy : parseInt(e.currentTarget.dataset.maxbuy),
        totalmaxbuy : parseInt(e.currentTarget.dataset.totalmaxbuy),
        usermaxbuy : parseInt(e.currentTarget.dataset.usermaxbuy)
      })

      for (var i in that.data.carts[merchid]) {
        if (that.data.carts[merchid][i].goodsid == goodsid) {
          hasNum += parseInt(that.data.carts[merchid][i].total)
        }
      }
 
    num++;

    if (this.data.usermaxbuy > 0 && this.data.maxbuy >= this.data.usermaxbuy || this.data.maxbuy == 0 && this.data.usermaxbuy) {
      limiNum = parseInt(that.data.totalmaxbuy) - hasNum + parseInt(totalNum);
   
      if (num >= limiNum) {
        if (limiNum==0){
          num = totalNum;
        }else{
          num = limiNum;
        }
        
        wx.showToast({
          title: '限购' + that.data.usermaxbuy + e.currentTarget.dataset.unit,
          image: '../../images/goodsNote.png',
          duration: 2000
        })
      }
    } else if (this.data.maxbuy < this.data.usermaxbuy && this.data.maxbuy > 0) {
      limiNum = parseInt(that.data.maxbuy) - hasNum + parseInt(totalNum);
      if (num >= limiNum) {
        if (limiNum == 0) {
          num = totalNum;
        } else {
          num = limiNum;
        }
        wx.showToast({
          title: '单次最多购买' + that.data.maxbuy + e.currentTarget.dataset.unit,
          image: '../../images/goodsNote.png',
          duration: 2000
        })
      }
    }

    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var carts = this.data.carts;
    carts[merchid][index].total = num;
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });

  },
  bindManual: function (e) {
  
    var index = parseInt(e.currentTarget.dataset.index);
    var merchid = parseInt(e.currentTarget.dataset.merchid);
    var carts = this.data.carts;
    var num = e.detail.value;



    carts[merchid][index].total = num;
    this.setData({
      carts: carts
    });

  },
  SaveEditNum: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var merchid = parseInt(e.currentTarget.dataset.merchid);
    var carts = this.data.carts;
    carts[merchid][index].showEdit = false;
    this.setData({
      carts: carts
    });

    if(carts[merchid][index].total>=parseInt(carts[merchid][index].totalmaxbuy)){
       this.saveNum(carts[merchid][index].id, parseInt(carts[merchid][index].totalmaxbuy));
  
    }else{
       this.saveNum(carts[merchid][index].id, carts[merchid][index].total);
    }
    this.sum();
     this.right();
  },
  editNum: function (e) {
    var that =this;
 
    that.setData({
      maxbuy: parseInt(e.currentTarget.dataset.maxbuy),
      totalmaxbuy: parseInt(e.currentTarget.dataset.totalmaxbuy),
      usermaxbuy: parseInt(e.currentTarget.dataset.usermaxbuy),
      minbuy: parseInt(e.currentTarget.dataset.minbuy)
    })


    var index = parseInt(e.currentTarget.dataset.index);
    var merchid = parseInt(e.currentTarget.dataset.merchid);
    var carts = that.data.carts;
    carts[merchid][index].showEdit = true;
    that.setData({
      carts: carts
    });
    that.left();
  },
  //单复选框
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var merchid = parseInt(e.currentTarget.dataset.merchid);
    var selected = this.data.carts[merchid][index].selected;
    var carts = this.data.carts;

    carts[merchid][index].selected = !selected;
    this.setData({
      carts: carts,
    });
    this.updataSelect(carts[merchid][index].id, carts[merchid][index].selected);
    this.sum();
  },

  bindSelectAll: function () {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var carts = this.data.carts;
    for (let x in carts) {
      for (let i in carts[x]) {
        carts[x][i].selected = selectedAllStatus;
      }
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts,
    });
    this.sum();
    this.updateAllSelect('all', selectedAllStatus);
  },
  bindCheckout: function () {
    var carts = this.data.carts;
    var cartIds = [];
    for (let x in carts) {
      for (let i in carts[x]) {
        if (this.data.carts[x][i].selected) {
          cartIds.push(this.data.carts[x][i].id);
        }
      }
    }
    if (cartIds.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    cartIds = cartIds.join(',');

    wx.navigateTo({
      url: '../order/ordersubmit/index'
    });
  },
  //显示购物车数据
  getCarts: function (showToast) {
    var showToast = showToast || true;
    var minusStatuses = [];
    var that = this;
    var utoken = wx.getStorageSync("utoken"); 
    server.sendRequest({
      url: '?r=wxapp.member.cart.getNewCart',
      showToast: showToast,
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        wx.stopPullDownRefresh();
        if (res && res.data) {
          var carts = res.data.result
    
          var goodsList = [];
   
          if (carts) {
            if (carts.length != 0)
              that.setData({ empty: false });
            else {
              that.setData({ empty: true });
            }
          }

          var selectedAllStatus = true;
          for (let x in carts) {
            move_arr[x] = [];
            for (let i in carts[x]) {
              move_arr[x].push(0);
              if (carts[x][i].selected == 1) {
                carts[x][i].selected = true;
              } else {
                carts[x][i].selected = false;
                selectedAllStatus = false;
              }
              minusStatuses[i] = 1;
            }
          }
          that.setData({
            loading: false,
            carts: carts,
            selectedAllStatus: selectedAllStatus,
            minusStatuses: minusStatuses
          });
          // sum
          that.sum();
        } else {
          that.setData({ empty: true });

          that.setData({
            carts: '',
            total: 0
          })
        }
      }
    })
  },
  onShow: function () {
    var showToast = false;
    this.getCarts(showToast);
    return;

    var that = this;
    var user = AV.User.current();
    var query = new AV.Query('Cart');
    var minusStatuses = [];
    query.equalTo('user', user);
    query.include('goods');
    query.find().then(function (carts) {
   
      var goodsList = [];
    
      for (var i = 0; i < carts.length; i++) {
        var goods = carts[i].get('goods');
        goodsList[i] = goods;
        minusStatuses[i] = carts[i].get('quantity') <= 1 ? 'disabled' : 'normal';
      }
      that.setData({
        carts: carts,
        goodsList: goodsList,
        minusStatuses: minusStatuses
      });
      that.sum();
    });
  },
  sum: function () {
    var carts = this.data.carts;
    var total = 0;
    for (let x in carts) {
      for (let i in carts[x]) {
        if (carts[x][i].selected) {
          total += carts[x][i].total * carts[x][i].marketprice;
        }
      }
    }
    var newValue = parseInt(total * 100);
    total = parseFloat(newValue / 100.0).toFixed(2);
    this.setData({
      carts: carts,
      total: total
    });
  },
  deleteCart: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var merchid = parseInt(e.currentTarget.dataset.merchid);
    var id = this.data.carts[merchid][index].id;
    var that = this
    var utoken = wx.getStorageSync("utoken");
    that.right();
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          server.sendRequest({
            url: '?r=wxapp.member.cart.remove',
            data: {
              utoken: utoken,
              id: id
            },
            method: 'GET',
            success: function (res) {
              that.getCarts();
            }
          })
        }
      }
    })
  },
  //修改购物车商品数量
  saveNum: function (id, num, optionid) {
    let that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.member.cart.update',
      data: {
        utoken: utoken,
        id: id,
        total: num,
        optionid: optionid
      },
      method: 'GET',
      success: function (res) {
        that.getCarts();
      }
    })
  },
  //单选购物车商品
  updataSelect: function (id, selected) {
    var that = this;
    if (selected) {
      selected = 1;
    } else {
      selected = 0
    };
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.member.cart.select',
      data: {
        utoken: utoken,
        id: id,
        selected: selected
      },
      method: 'GET',
      success: function (res) {

        var carts = that.data.carts;
        var selectedAllStatus = true;
        for (let x in carts) {
          for (let i in carts[x]) {
            if (carts[x][i].selected == 1) {
              carts[x][i].selected = true;
            } else {
              carts[x][i].selected = false;
              selectedAllStatus = false;
            }
          }
        }
        that.setData({
          selectedAllStatus: selectedAllStatus
        });
        that.sum();
      }
    })
  },
  //购物车商品全选
  updateAllSelect: function (id, selected) {
    if (selected) {
      selected = 1;
    } else {
      selected = 0
    };
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.member.cart.select',
      data: {
        utoken: utoken,
        id: id,
        selected: selected
      },
      method: 'GET',
      success: function (res) { }
    })
  },
  // button拖动的三个方法
  buttonStart: function (e) {
    startPoint = e.touches[0]
    move_index = e.currentTarget.dataset.index;
    var i = e.currentTarget.dataset.i;
    for (let x in move_arr) {
      for (let y in move_arr[i]) {
        move_arr[x][y] = 0;
      }
    }
    move_arr[i][move_index] = 1;
    this.setData({ move_arr })
  },
  buttonEnd: function (e) {
    var that = this;
    var endPoint = e.changedTouches[0];
    if (startPoint.clientX - endPoint.clientX > 50) {
      that.left();
    } else if (endPoint.clientX - startPoint.clientX > 50) {
      that.right();
    }
  },
  right: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translateX(0).step()
    this.setData({
      animationData: animation.export(),
    })
  },
  left: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translateX(-60).step()
    this.setData({
      animationData: animation.export(),
    })
  }
})