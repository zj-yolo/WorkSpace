var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {},
  onLoad: function (options) {
     utoken = wx.getStorageSync("utoken");
    var that = this;
    that.setData({
      activity_id: options.activity_id,
      allNum: options.allNum,
    })
    server.sendRequest({
       url: '?r=activity.index.get_members&utoken=' + utoken + '&activity_id=' + that.data.activity_id,
      method: 'GET',
      success: function (res) {
        res.data.result[0].mobile = res.data.result.mobile
        that.setData({
          userList: res.data.result
        });
        delete that.data.userList.mobile
        that.setData({
          userList: that.data.userList
        }); 

        for (var i in that.data.userList){
          if (!that.data.userList[i].nickname){
            delete that.data.userList[i]
            }
      }
        that.setData({
          userList: that.data.userList
        }); 

      }
    })
  },
   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onShow: function () {
     utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
       url: '?r=activity.index.get_members&utoken=' + utoken + '&activity_id=' + that.data.activity_id,
      method: 'GET',
      success: function (res) {
        res.data.result[0].mobile = res.data.result.mobile
        that.setData({
          userList: res.data.result
        });
        delete that.data.userList.mobile
        that.setData({
          userList: that.data.userList
        });
        for (var i in that.data.userList) {
          if (!that.data.userList[i].nickname) {
            delete that.data.userList[i]
          }
        }
        that.setData({
          userList: that.data.userList
        }); 
      }
    })   
  },
})