var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");

Page({
  data:{},

  onLoad: function (res) {
    utoken = wx.getStorageSync("utoken");
    console.log(res);
    var that = this;

      that.setData({
        pid:res.pid,
        bid:res.bid
      })
    server.sendRequest({
      url: '?r=wxapp.sns.user',
      data:{
        id:res.pid,
        utoken:utoken
      },
      method: 'GET',
      success:function(res){
        console.log(res.data.result);
       that.setData({
         data:res.data.result
       })
      }
    })

  },
  tolist:function(res){
    console.log(res.currentTarget.dataset.bid);
    wx.navigateBack({
      delta: 2,
      bid:res.currentTarget.dataset.bid
    })
  },
  toTopic:function(res){
    console.log(res.currentTarget.dataset.pid);
    wx.navigateBack({
      delta: 1,
      pid:res.currentTarget.dataset.pid
    })
  },

})
