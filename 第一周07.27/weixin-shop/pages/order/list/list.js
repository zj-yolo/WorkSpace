var server = require('../../../utils/server');
var cPage = 1;
var ctype = "",indexCurr;
var utoken = wx.getStorageSync("utoken");
var deductcredit3 = '';
Page({

   data:{
     scrollTopMy:false
   },
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index;
    indexCurr=parseInt(e.currentTarget.dataset.index)-1;
    var types = ["", "0", "1", "2", "3"]
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({
      tabClasss: classs,
      tab: index,
      currIndex: index,
      indexCurr: index,
      myIndex:index
    })
    cPage = 1;
    ctype = types[index];
    this.data.orders = [];
    this.getOrderLists(types[index], cPage);
  },
  pay: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var order = that.data.orders[index];
    deductcredit3 = that.data.orders[index].deductcredit3;
    that.get_order(order.id);
    // wx.navigateTo({
    // 	url: '../orderpay/payment?order_id=' + order.id
    // });
  },
  
  // 获取订单的数据
  get_order: function (orderid, formId) {
    var that = this;
    utoken = wx.getStorageSync("utoken");

    var url = '?r=wxapp.order.pay'
    server.sendRequest({
      url: url,
      data: {
        utoken: utoken,
        id: orderid,
        formId: formId
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status == 1) {

          server.globalData.wxdata = res.data.result.data;
          server.globalData.order = res.data.result.order;
          that.setData({
            paydata: res.data.result.data,
            order: res.data.result.order
          });


          var wxdata = server.globalData.wxdata
          // 有企业支付直接微信支付
          if (wxdata.timeStamp && res.data.result.order && res.data.result.order.creditpay != '1') {
            that.to_pay();
          }
          // 没有就走二维码支付
          else {
            if (deductcredit3 != 0 && deductcredit3 != '' && deductcredit3 != '0.00'){
              wx.navigateTo({
                url: '../orderpay/payment?order_id=' + orderid + '&formId=' + formId + '&myList=' + 'myList' + '&deductcredit3=' + deductcredit3
              });
            }else{
              wx.navigateTo({
                url: '../orderpay/payment?order_id=' + orderid + '&formId=' + formId + '&myList=' + 'myList'
              });
            }
          }

        } else if (res.data.status == 10) {

          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            url: "../../member/index/index"
          });
          return;

        } else {

          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
          wx.switchTab({
            url: "../../member/index/index"
          });
          return;

        }

      }
    })
  },
  // 支付
  to_pay: function () {

    var wxdata = server.globalData.wxdata
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package
    var sign = wxdata.sign;
    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': package1,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': sign,
      'success': function (res) {

        server.sendRequest({
          url: "?r=wxapp.services.order.updateStatus",
          data: {
            utoken: utoken,
            orderid: orderId
          },
          method: 'GET',
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
          }
        })
        setTimeout(function () {
          wx.switchTab({
            url: "../member/index/index"
          });
        },
          2000);
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  cancel: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          var utoken = wx.getStorageSync("utoken");
          //订单列表
          server.sendRequest({
            url: '?r=wxapp.order.op.cancel',
            data: {
              utoken: utoken,
              id: order['id']
            },
            method: 'GET',
            success: function (res) {
              wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
              cPage = 1;
              that.data.orders = [];
              that.getOrderLists(ctype, 1);
            }
          })

        }
      }
    })
  },
  //收货确认
  confirm: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定已收货吗？',
      success: function (res) {
        if (res.confirm) {
          var utoken = wx.getStorageSync("utoken");
          server.sendRequest({
            url: '?r=wxapp.order.op.finish',
            data: {
              utoken: utoken,
              id: order['id']
            },
            method: 'GET',
            success: function (res) {
              wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
              cPage = 1;
              that.data.orders = [];
              that.getOrderLists(ctype, 1);
            }
          })

        }
      }
    })
  },
  details: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goods = this.data.orders[index];
    wx.navigateTo({
      url: '../details/index?order_id=' + goods['id'] + '&currIndex=' + that.data.orders[index].status + "&myIndex=" + that.data.myIndex
    });
  },

  onPageScroll: function (e) {
    var that = this;
    if (e.scrollTop>510){
       that.setData({
         scrollTopMy:true
       })
    }else{
      that.setData({
        scrollTopMy: false
      })
          }

  },
  toTop:function(){
    var that =this;
    that.setData({
      scrollTopMy: false
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })

  },

  onReachBottom: function (e) {
    console.log(e)
    var that = this;
    if (that.data.refresh){
      return false
    }else{
      that.data.refresh=true;
      that.getOrderLists(ctype, ++cPage);
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
    }
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh----------')
    cPage = 1;
    this.data.orders = [];
    this.getOrderLists(ctype, 1);
    wx.stopPullDownRefresh()
  },
  data: {
    loading:true,
    refresh:false,
    orders: [],
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
  },
  getOrderLists: function (ctype, page,showToast) {
    var that = this;
    var showTosat = showToast;
    var utoken = wx.getStorageSync("utoken");

    server.sendRequest({
      url: '?r=wxapp.order',
      showToast,
      data: {
        utoken: utoken,
        status: ctype,
        page: page,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          if (cPage <= 1 || !cPage) {
            that.setData({
              orders: []
            })
          }
          var datas = res.data.result;
          var ms = that.data.orders
          for (var i in datas) {
            ms.push(datas[i]);
          }
          wx.stopPullDownRefresh();
          that.setData({
            loading:false,
            orders: ms,
            total: res.data.result.total
          });
        }
        if (res.data.result.length > 0){
          that.setData({
            refresh: false
          });
        }
        
      }
    })

  },
  evaluation: function (e) {
    var index = e.currentTarget.dataset.index;
    var goods = this.data.orders[index];
    wx.navigateTo({
      url: '../pinjia/index?order_id=' + goods['id']
    });
  },
  goToAnotherEvalute:function(e){
    var index = e.currentTarget.dataset.index;
    var goods = this.data.orders[index];
    wx.navigateTo({
      url: '../pinjia/index?order_id=' + goods['id'] +'&evaluteType='+2
    });
  },
  onShow: function (options) {
    // 页面显示
     cPage = 1;
    var showToast = false;
    this.data.orders = [];
    if (indexCurr == -1) { indexCurr = '' }
    this.getOrderLists(indexCurr, cPage, showToast);
    this.setData({
    })
  },
  onLoad: function (e) {

     console.log(e)
    cPage = 1;


    var index = parseInt(e.id)+1;
    indexCurr = parseInt(e.id) ;
    var types = ["", "0", "1", "2", "3"]
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({
      tabClasss: classs,
      tab: index,
      indexCurr: indexCurr,
      myIndex:index
    });
     ctype = types[index];
     // console.log(ctype)
    utoken = wx.getStorageSync("utoken");
  }
});