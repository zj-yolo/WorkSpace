var server = require('../../../../../utils/server');
var cPage = 1;
var ctype = "";
Page({
  data: {
    
  },
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var types = ["", "1", "2", "3", "4"]
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({
      tabClasss: classs,
      tab: index,
      currIndex: index
    })
    cPage = 1;
    ctype = types[index];
    this.data.orders = [];
    this.getOrderLists(types[index], cPage);
  },
  //支付
  pay: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (this.data.orders[index].teamid) {
      var teamid = that.data.orders[index].teamid;
    }
    var id = that.data.orders[index].id;
    var goods = this.data.orders[index];
    wx.navigateTo({
      url: '/packageA/pages/groupbuy/cashier/index?orderid=' + id + "&teamid=" + teamid
    });

  },
  //取消订单
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
            url: '?r=wxapp.groups.orders.cancel',
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
          //订单列表
          server.sendRequest({
            url: '?r=wxapp.groups.orders.finish',
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
  //订单详细
  details: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    if (that.data.orders[index].teamid) {
      var teamid = that.data.orders[index].teamid;
    }
    var id = that.data.orders[index].id;

    var goods = that.data.orders[index];
    wx.navigateTo({
      url: '/packMember/pages/member/allTool/details/index?orderid=' + id + "&teamid=" + teamid
    });

  },
  onReachBottom: function () {
    var that = this;
    if(that.data.refresh){
      return false;
    }
    that.data.refresh=true;
    that.getOrderLists(ctype, ++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function () {
    cPage = 1;
    this.data.orders = [];
    this.getOrderLists(ctype, 1);
  },
  data: {
    loading:true,
    orders: [],
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
    refresh:false
  },
  getOrderLists: function (ctype, page,showToast) {
    var that = this;
    var showToast = showToast;
    var utoken = wx.getStorageSync("utoken");
    //订单列表
    server.sendRequest({
      url: '?r=wxapp.groups.orders.get_list',
      showToast: showToast,
      data: {
        utoken: utoken,
        status: ctype,
        page: page,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          var datas = res.data.result.list;
          var ms = that.data.orders
          for (var i in datas) {
            ms.push(datas[i]);
          }
          wx.stopPullDownRefresh();
          that.setData({
            loading:false,
            orders: ms
          });

        }
        if (res.data.result.list != ''){
          that.setData({
            refresh:false
          })
        }
      }
    })
  },
  // 评价方法
  evaluation: function (e) {
    var index = e.currentTarget.dataset.index;
    var goods = this.data.orders[index];
    wx.navigateTo({
      url: '/pages/order/pinjia/index?order_id=' + goods['id']
    });
  },
  onShow: function (options) {
    // 页面显示
    cPage = 1;
    var showToast = false;
    this.data.orders = [];
    this.getOrderLists(this.data.indexCurr, cPage, showToast);
    this.setData({
    })
    var types = ["", "0", "1", "2", "3"]
    ctype = this.data.indexCurr;
  },
  onLoad: function (e) {
    var index = e.id;
    var indexCurr = parseInt(e.id) - 1
    var types = ["", "0", "1", "2", "3"]
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({
      tabClasss: classs,
      tab: index,
      indexCurr: indexCurr,
    })
  }
});