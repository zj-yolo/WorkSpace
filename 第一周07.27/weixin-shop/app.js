var server = require('./utils/server');
var md5 = require('./utils/md5.js');
var WxEmoji = require('/WxEmojiView/WxEmojiView.js');
var socket = require("./utils/websocket.js");



// 授权登录
App({
  onLaunch: function(e) {
    var that = this;
    //     // 创建一个socket链接对象
    this.globalData.socket = new socket();
    this.globalData.socket.close();
    // console.log(new socket())
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    WxEmoji.init(":_/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif"
    });
    var local_utoken = wx.getStorageSync("utoken");
    let sdata = {
      wxid: wx.getStorageSync('obj').wxid,
      unionid: wx.getStorageSync('obj').unionid,
      utoken: local_utoken
    }
    server.sendRequest({
      url: '?r=wxapp.getShopDiyBase',
      data: sdata,
      method: 'POST',
      success: function(res) {
        if (res.data.status == 1) {
          wx.setStorageSync('templeid', res.data.result.templeid);
          wx.setStorageSync('is_mianyi', res.data.result.shopinfo.base.is_mianyi);
          if (res.data.result.templeid == "11") {
            if(res.data.result.shopinfo.base && res.data.result.shopinfo.base.isdiypage != 1) {
              wx.setTabBarItem({
                index: 1,
                text: '官网',
                "iconPath": "images/website_1.png",
                "selectedIconPath": "images/website.png"
              })
            }
          }
          if (res.data.result && res.data.result.shopinfo && res.data.result.shopinfo.base) {
            let baseInfo = res.data.result.shopinfo.base;
            that.globalData.isDiyDecorate = baseInfo.isdiypage;
          }
        }
      }
    })

    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    var news = extConfig.new;
    this.globalData.news = news;
    this.globalData.utoken = local_utoken;
    server.setLog(local_utoken);
    // 设备信息
    wx.getSystemInfo({
      success: function(res) {
        that.screenWidth = res.windowWidth;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },
  globalData: {
    isDiyDecorate: 0,
  }
})