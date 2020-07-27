var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
let recharge;
let cardId;
Page({ 
  data: {
    orderid:'',
    cardid:'',
    weixin_app:'',
    weixin_app_paycon:'',
    weixin_app_payimg:'',
    now:'',
  },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
    recharge='';
    var that = this;
    console.log('options', options)
    if (options.recharge) { recharge = options.recharge}
    that.setData({
      orderid: options.orderid,
      cardid: options.cardid,
      weixin_app: options.weixin_app,
      realname: options.realname,
      mobile: options.mobile
    })
    if (that.data.weixin_app==1){
      if(recharge!=''){

      }else{
        server.sendRequest({
          url: '?r=wxapp.member.vipcard.card',
          data: {
            utoken: utoken,
            orderid: that.data.orderid,
            cardid: that.data.cardid,
            realname: that.data.realname,
            mobile: that.data.mobile
          },
          method: 'POST',
          success: function (res) {
             cardId = res.data.result;
              server.sendRequest({
      url: '?r=wxapp.member.vipcard.paymain',
      data: {
        utoken: utoken,
        id: options.orderid,
        cardid:cardId
      },
      method: 'GET',
      success: function (res) {
        // console.log('paydata', res.data)
        if (res.data.status == 1) {
          that.setData({
            paydata: res.data.result.data,
            order: res.data.result.order
          });
          const date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate() + 1;
          ;
          let now = year + '-' + month + "-" + day
          that.setData({
            now: now
          })  
        }
        else if (res.data.status == 10) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
               return;

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
            return;

        }
      }
    })
          }
        })   
      }
 
    }else{
      server.sendRequest({
        url: '?r=wxapp.member.vipcard.card',
        data: {
          utoken: utoken,
          orderid: that.data.orderid,
          cardid: that.data.cardid,
          realname: that.data.realname,
          mobile: that.data.mobile

        },
        method: 'POST',
        success: function (res) {
            cardId = res.data.result;
             server.sendRequest({
      url: '?r=wxapp.member.vipcard.paymain',
      data: {
        utoken: utoken,
        id: options.orderid,
        cardid:cardId
      },
      method: 'GET',
      success: function (res) {
        // console.log('paydata', res.data)
        if (res.data.status == 1) {
          that.setData({
            paydata: res.data.result.data,
            order: res.data.result.order
          });
          const date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate() + 1;
          ;
          let now = year + '-' + month + "-" + day
          that.setData({
            now: now
          })  
        }
        else if (res.data.status == 10) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
               return;

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          });
            return;

        }
      }
    })
        }
      })   
    }
    that.setData({
      weixin_app_paycon: options.weixin_app_paycon,
      weixin_app_payimg: options.weixin_app_payimg,
    })
   
  },
  pay:function(){
    var that = this;
    console.log('pay', that)
   var timeStamp = (wx.getStorageSync('wxdata').timeStamp).toString();
   var nonceStr = wx.getStorageSync('wxdata').nonceStr;
   var package1 = wx.getStorageSync('wxdata').package;
   var sign = wx.getStorageSync('wxdata').sign;
   wx.requestPayment({
     'nonceStr': nonceStr,
     'package': package1,
     'signType': 'MD5',
     'timeStamp': timeStamp,
     'paySign': sign,
     'success': function (res) {
       // server.sendRequest({
       //   url: '?r=wxapp.member.vipcard.card',
       //   data: {
       //     utoken: utoken,
       //     orderid: that.data.orderid,
       //     cardid: that.data.cardid,
       //     realname: that.data.realname,
       //     mobile: that.data.mobile
       //   },
       //   method: 'POST',
       //   success: function (res) {
           // var cardId = that.data.cardid;
             server.sendRequest({
             url: '?r=wxapp.member.vipcard.updateStatus&cardid=' + cardId + '&utoken=' + utoken,
             data: {
             },
             method: 'POST',
             success: function (res) {
               wx.showToast({ title: '支付成功', icon: 'success', duration: 2000 });
               setTimeout(function(){
                 wx.switchTab({
                   url: '../../index/index',
                 })
               },2000)
             }
           })
         // }
       // })
     },
     'fail': function (res) {
       wx.showToast({ title: '支付失败', icon: 'success', duration: 2000 })

     }
   }) 
  },


// 返回首页
toStart:function(){
  wx.switchTab({
    url: "../../../index/index"
  });
}
})