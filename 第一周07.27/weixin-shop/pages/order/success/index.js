Page({
  data: {},
  toReceived:function(){
    var that=this;
    wx.reLaunch({
      url:"../../member/index/index"
    })
  }
})