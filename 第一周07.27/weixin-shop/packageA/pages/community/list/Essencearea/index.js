// pages/list/Essencearea/index.js
var WxParse = require('../../../../../wxParse/wxParse.js');
var replyArr = [];
var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var page=1;
Page({
  data: {
    height:Math.ceil(wx.getSystemInfoSync().screenHeight)*2,
    refresh:false
  },
  onLoad: function (res) {
    utoken = wx.getStorageSync("utoken");
    var that =this;
    that.setData({
      bid:res.bid
    })
    server.sendRequest({
      url: '?r=wxapp.sns.board.getlist',
      data:{
        bid:that.data.bid,
        isbest:1,
        utoken:utoken
      },
      method: 'GET',
      success:function(res){
        if(res.data.result.list!=''){
         for(let x in res.data.result.list){
        x=res.data.result.list[x].content
        replyArr.push(x);
        }
         for (let i = 0; i < replyArr.length; i++) {
            WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
            if (i === replyArr.length - 1) {
              WxParse.wxParseTemArray("replyTemArray",'reply', replyArr.length, that)
            }
          }
        that.setData({
          list:res.data.result.list
        })
      }
    }
    });
      },
       toTopic:function(res){
         var that = this;
    wx.navigateTo({
      url:"../../topic/index?pid="+res.currentTarget.dataset.pid+"&bid="+res.currentTarget.dataset.bid
    })
  },
  toPerson:function(res){
    wx.navigateTo({
      url:"../../person/center?id="+res.currentTarget.dataset.id
    })
  },
  bottom:function(){
    var that = this;
      if(that.data.refresh)return;
      that.setData({refresh:true})
      page=page+1;
      server.sendRequest({
        url: '?r=wxapp.sns.board.getlist',
        data:{
          bid:that.data.bid,
          isbest:1,
          page:page,
          utoken:utoken
        },
        method: 'GET',
        success:function(res){
          var arr=[];

          for(let x in that.data.list){
            arr.push(that.data.list[x])
          }

          if(res.data.result.list==''){page=page-1}
          else{
            for(let x in res.data.result.list){
              arr.push(res.data.result.list[x])
            }
              that.setData({refresh:false})
          }
          that.setData({
            list:arr
          })
      }
      });
  }
})
