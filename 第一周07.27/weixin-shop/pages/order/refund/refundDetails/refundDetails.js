var that ='';
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var rtypeCont = '';
Page({
  data: {
ClassNum:1,
    Treatmentmodeitems: [
    '退款（仅退款不退货）', '退款（退款退货）', '退款（退款退货）','换货（不退款)'],
    nothing:'无',
  },
  
  onLoad: function (options) {
  var that = this;
  var order_id = options.id;
  var currIndex = options.currIndex
    utoken = wx.getStorageSync("utoken");
that.setData({
  order_id: order_id,
  currIndex: currIndex
})

    server.sendRequest({
     url: '?r=order.refund.detail&utoken=' + utoken + '&id=' + that.data.order_id,
      method: 'POST',
      success: function (res) {
        that.setData({
          refundList: res.data.result,
          applyprice: res.data.result.applyprice,
          content: res.data.result.content,
          createtime: res.data.result.createtime,
          reason: res.data.result.reason,
          rtypeNum: res.data.result.rtype,
          statemsg: res.data.result.statemsg,
          images: res.data.result.images,
          isimages: res.data.result.images[0]
        });
  
        for (let i = 0; i < that.data.Treatmentmodeitems.length;i++){
          if (that.data.rtypeNum == i){
            rtypeCont = that.data.Treatmentmodeitems[i]
                     }
        }
          that.setData({
            rtype: rtypeCont
          })
      }
    })


  },
  moreSelectArrow: function () {
    that = this;
    if (that.data.ClassNum == 1) {
      that.setData({
        ClassNum: 0
      })
    } else {
      that.setData({
        ClassNum: 1
      })
    }
  },
  formSubmit:function(){
      var that = this;
    utoken = wx.getStorageSync("utoken");
    wx.showModal({
      title: '提示',
      content: '您确定要取消申请么',
      success: function (res) {
        if (res.confirm) {
          server.sendRequest({
            url: '?r=order.refund.cancel&utoken=' + utoken + '&id=' + that.data.order_id,
            method: 'GET',
            success: function (res) {   
              wx.navigateTo({
                url: '/pages/order/details/index?order_id=' + that.data.order_id + '&currIndex=' + that.data.currIndex,
              })
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
})