var that = '';
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var cPage = 1;
var waitLength = '';
Page({
  data: {
    list: ['退/换货', '我的订单'],
    sub: 0,
    orders: [],
    refresh:false
  },

  onLoad: function (options) {
   that = this;
  utoken = wx.getStorageSync("utoken");
  },

  onShow: function (options) {
   that = this;
   cPage = 1;
   that.getOrderLists1(cPage);
  }, 
    onPullDownRefresh: function(){
      that = this;
      cPage = 1;
      that.getOrderLists1(cPage);

  },
  clickTitle: function (e) {

    that = this;
    var sub = e.currentTarget.dataset.index;
    that.setData({
      sub: sub
    })
    if (that.data.sub==1){
      wx.navigateTo({
        url: '../list/list?id=' + 1
  })
      that.setData({
        sub: 0
      })
}
  },
  details: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goods = this.data.orders[index];
    console.log(this.data.orders[index].status)
  
  wx.navigateTo({
      url: '../details/index?order_id=' + that.data.orders[index].id + '&currIndex=' + that.data.orders[index].status
    });
  },

// 
  onReachBottom: function () {
    //cPage = 1;
    var that=this;
    if (that.data.refresh){
      return false;
    }
    that.data.refresh=true;
    that.getOrderLists(++cPage);
     
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },

  onPullDownRefresh: function () {
     cPage = 1;
    this.getOrderLists1(1);
       wx.stopPullDownRefresh()
  },
  getOrderLists: function (page) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");

    //订单列表

    server.sendRequest({
      url: '?r=wxapp.order&utoken=' + utoken + '&status=' + 4 + '&page=' + page+'&is_pc=1',
      data: {

      },
      method: 'GET',
      success: function (res) {

        if (res.data.result) {
          var orderList = [];
          var orderLists = [];
          orderList = res.data.result.order;
          orderLists = that.data.orders.concat(orderList)
          that.setData({
            orders: orderLists,

          });
       

        }
        if(res.data.result != ''){
          that.setData({
            refresh: false,

          });
        }
      }
    })
  },

  getOrderLists1: function (page) {
    var that = this;
server.sendRequest({
  url: '?r=wxapp.order&utoken=' + utoken + '&status=' + 4 + '&page=' + 1 + '&is_pc=1',
     data: {
      
     },
     method: 'GET',
     success: function (res) {
       if (res.data.result.order[0]) {
         that.setData({
           orders: res.data.result.order,
         });
       }else{
          that.setData({
           orders:[],
         });
       }
     }
   })

  },

})