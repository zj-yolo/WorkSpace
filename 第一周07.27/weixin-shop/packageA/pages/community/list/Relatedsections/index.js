var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},
  onLoad: function (res) {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.sns.board.relate',
      data:{
        id:res.id,
        utoken:utoken
      },
      method: 'GET',
      success:function(res){
        that.setData({
          data:res.data.result.list
        })
      }
    });
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  toIndex:function(res){
     console.log(res.currentTarget.dataset.id);
    wx.navigateBack({
       delta: 1,
      id:res.currentTarget.dataset.id
    })
  },
})
