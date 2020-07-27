var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data:{
    loading:true,
    isrefund: 5
  },
  onLoad:function(res){
    utoken = wx.getStorageSync("utoken");
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.groups.orders.detail',
      showToast:false,
      data: {
        utoken:utoken,
        orderid:res.orderid,
        teamid:res.teamid
      },
      method: 'GET',
      success: function(res) {
        var result = res.data.result
        var price=parseFloat(result.order.price)+parseFloat(result.order.freight)
        that.setData({
          loading:false,
          result:result,
          price:price
          });
        var time=new Date(parseFloat(res.data.result.order.createtime)*1000);
        var y=time.getFullYear();
        var M=(time.getMonth()+1)>10?(time.getMonth()+1):"0"+(time.getMonth()+1);
        var d=(time.getDate())>10?(time.getDate()):"0"+(time.getDate());
        var h=(time.getHours())>10?(time.getHours()):"0"+(time.getHours());
        var m=(time.getMinutes())>10?(time.getMinutes()):"0"+(time.getMinutes());
        var s=(time.getSeconds())>10?(time.getSeconds()):"0"+(time.getSeconds());
        var times=y+'-'+M+'-'+d+' '+h+':'+m+':'+s;
        that.setData({
          times:times
        })
      }
    })

  },
    //支付
  pay:function(e){
    var index = e.currentTarget.dataset.index;
     wx.navigateTo({
       url: '/pages/order/orderpay/payment?order_id=' + index
    });
  },
  // 取消订单
  cancel:function(e)
  {
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel:true,
      content: '确定取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          var utoken = wx.getStorageSync("utoken");
          //订单列表
          server.sendRequest({
            url: '?r=wxapp.order.op.cancel',
            data: {
              utoken:utoken,
              id:index
            },
            method: 'GET',
            success: function(res) {
                wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 });
                wx.navigateTo({
                  url: '/pages/order/list/list'
                });
            }
          })

        }
      }
    })
  },
  // 评价
  evaluation:function(e){
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/order/pinjia/index?order_id=' + index
    });
  },
  // 物流信息
  logistics:function(e){
    var index = e.currentTarget.dataset.index;
     wx.navigateTo({
       url: '/pages/order/logistics/index?order_id=' + index
    });
  },
  // 查看退款
  viewprogress: function () {
    var that = this;
      wx: wx.redirectTo({
      url: '/pages/order/refund/refundDetails/refundDetails?id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,
    })
  },
  // 取消申请
  withdraw: function () {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    wx.showModal({
      title: '提示',
      content: '您确定要取消申请么',
      success: function (res) {
        if (res.confirm) {
          //订单列表
          server.sendRequest({
            url: '?r=order.refund.cancel&utoken=' + utoken + '&id=' + that.data.order_id,
            method: 'GET',
            success: function (res) {
               wx.redirectTo({
                url: '/pages/order/details/index?order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,
              })
            }
          })
        } else if (res.cancel) {
         }
      }
    })
  },
  
  // 申请退款
  applyRefund: function () {
    var that = this;
    wx.redirectTo({
      url: '/pages/order/refund/refund?maxAmount=' + that.data.result.price + '&order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,
    })
  },
  // 投诉卖家
  complaint: function () {
    wx.redirectTo({
      url: '/pages/order/complaint/complaint'
    })

  },

})
