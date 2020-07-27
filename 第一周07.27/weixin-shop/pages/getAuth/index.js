// pages/getAuth/index.js
var server = require('../../utils/server.js');
var utoken = wx.getStorageSync("utoken");
var app = new getApp();

Page({
  data: {
  
  },
  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
  },
  handleReject() {
    wx.navigateBack({
      delta: 1,
    })
  },
  getUserInfo:function(res){
    utoken = wx.getStorageSync("utoken");
    if (!utoken){
      server.setLog(utoken)
    }
    var that = this;
    if (res.detail.errMsg =='getUserInfo:ok'){
      server.sendRequest({
        url: '?r=logs.asyncUserinfo',
        data: {
          utoken:utoken,
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status == 1) {
            if (server.globalData.userInfo == null){
              server.globalData.userInfo = {
                avatar:'',
                nickname:''
              }
            }
            server.globalData.userInfo.avatar = res.data.result.userInfo.avatarUrl;
            server.globalData.userInfo.nickname = res.data.result.userInfo.nickName;
            let data = server.globalData.userInfo;
            wx.setStorageSync('userInfo',data);
            wx.navigateBack();
            return;
          }
        }
      })
    }else{

    }
  }
})