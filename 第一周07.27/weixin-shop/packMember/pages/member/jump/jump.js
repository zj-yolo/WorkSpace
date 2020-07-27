var server = require('../../../../utils/server');
var app = getApp();
var utoken = wx.getStorageSync("utoken");
Page({
  data: { 
    height: Math.ceil(wx.getSystemInfoSync().windowHeight),
    hasId:false,
    data:[]
   },
  onLoad: function (options) {
    let that = this;
     console.log(options);
     console.log(typeof(options.id))
     if(options.id!=undefined){
      server.sendRequest({
        url: '?r=wxapp.member.jump.getone',
        data: {
          id:options.id,
          utoken: utoken
        },
        method: 'GET',
        success: function (res) {
          // console.log(res);
          that.setData({
            hasId:true
          })
          that.jumptotother(res.data.result);
        }
      })  
     }else{
      server.sendRequest({
        url: '?r=wxapp.member.jump.main',
        data: {
          utoken: utoken
        },
        method: 'GET',
        success: function (res) {
          if(res.data.result.length>0){
            that.setData({
              data: res.data.result
            });
          }else{
            that.setData({
              hasId:false
            });            
          }

        }
      })
     }
  },
    onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  jump: function (event) {
    var that = this;
    var s = event.currentTarget.dataset.id 
    server.sendRequest({
      url: '?r=wxapp.member.jump.getone',
      data: {
        id:s,
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        that.jumptotother(res.data.result);
      }
    })   
  },
  jumptotother: function (options)
  {
    if (!options){ return}
      wx.navigateToMiniProgram({
        appId: options.appid,
        path: options.link,
        extarData: {
          foo: 'bar'
        },
        envVersion: 'release',
     
      })
  }
})