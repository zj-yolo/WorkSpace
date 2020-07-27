
Page({
  data: {},
  onLoad:function(res){
    console.log(res.logid);
    this.setData({
      logid:res.logid
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  toReceived:function(){
    var that=this;
    console.log(111);
    wx.reLaunch({
      url:"../received/index?id="+that.data.logid
    })
  }
})