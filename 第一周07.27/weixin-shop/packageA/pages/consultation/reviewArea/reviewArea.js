var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse');
var utoken = wx.getStorageSync("utoken");
var that = "";
Page({
  data: {
    news:false,
    show:false,
    showReport:false,
currArea1:"xa",
currArea1compare: -1,
currArea2:0,
currArea2compare: -1,
isgoods:false,
talkAlert: false,
talkAlert2: false,
giveGood: false,
isNull:true,
isNullS: true,
    submitShow:true,
    showExpression: false,
    showExpressionSec:false,
    currReport:'',
    aid: '',
   msgTalk:'',
   msgGood:'',
  talkList:[],
  talkListSecond:[],
  content:'',
    contentReply:'',
    rid:'',
    isdisabled:true,
    getMap:'',
    getMapS: '',
    currLength:'',
    latitude: '',
    longitude: '',
    latitude2: '',
    longitude2: '',
    address:'',
  },


  onLoad: function (options) {
    utoken = wx.getStorageSync("utoken");
     that = this;
     that.setData({
       aid: options.aid,
     })
    server.sendRequest({
      url: '?r=wxapp.article.report.getlist&utoken=' + utoken + '&aid=' + that.data.aid,
      method: 'GET',
      success: function (res) {
        if (res.data.result.length>0) {
          that.setData({
            news:true
          })
            var reviewList = []
         var talkLists = [];
          for (var i = 0; i < res.data.result.length; i++) {
            talkLists.push(res.data.result[i])
          }
          that.setData({
            talkList: talkLists,
          });
          var replyArr = [];
          for (let i = 0; i < that.data.talkList.length;i++){
            replyArr.push(that.data.talkList[i].cons)
           }
          for (let i = 0; i < replyArr.length; i++) {
            WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
            if (i === replyArr.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
            }
          }
         var replyArrList2 = [];
          var replyArrS = [];
          for (let j = 0; j < that.data.talkList.length; j++) {
            for (let x = 0; x < that.data.talkList[j].child_report.length;x++){
              replyArrS.push(that.data.talkList[j].child_report[x].cons);
           }
          }
         for (let i = 0; i < replyArrS.length; i++) {
            WxParse.wxParse('replyS' + i, 'html', replyArrS[i], that);
            if (i === replyArrS.length - 1) {
              WxParse.wxParseTemArray("replyTemArrayS", 'replyS', replyArrS.length, that)
            }
          }

        }
      }
    })
  },
  getMap: function (e) {
    var that = this;
    wx.chooseLocation({
      type: 'gcj02',
        success: function (res) {
         that.setData({
           latitude: res.latitude,
           longitude: res.longitude,
           getMap:res.address
         })
         if (that.data.getMap) {
           that.setData({
             isNull: false
           })
         }
        }
      })
  },
  bindTextAreaBlur: function (e) {
    that = this;
    var contents = e.detail.value;
    that.setData({
      content: contents,
    })
  },
  submitReview:function(e){
    var contents = e.detail.value.talkContent;
   server.getUserInfo(function(){
    server.sendRequest({
      url: '?r=wxapp.article.report&utoken=' + utoken + '&aid=' + that.data.aid + '&content=' + contents + '&lng=' + that.data.longitude + '&lat=' + that.data.latitude,
      method: 'POST',
      success: function (res) {
        that.setData({
          msgTalk: res.data.msg,
          talkAlert: true,
        })
        server.sendRequest({
          url: '?r=wxapp.article.report.getlist&utoken=' + utoken + '&aid=' + that.data.aid,
            method: 'GET',
          success: function (res) {
            var talkLists = [];
            for (var i = 0; i < res.data.result.length; i++) {
              talkLists.push(res.data.result[i])
            }
            that.setData({
              talkList: talkLists,
              isNull: true,
              longitude: '',
              latitude: '',     
            });
            var replyArr = [];
            for (let i = 0; i < that.data.talkList.length; i++) {
              replyArr.push(that.data.talkList[i].cons)
            }
            for (let i = 0; i < replyArr.length; i++) {
              WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
              if (i === replyArr.length - 1) {
                WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
              }
            }
            var replyArrList2 = [];
            var replyArrS = [];
            for (let j = 0; j < that.data.talkList.length; j++) {
              for (let x = 0; x < that.data.talkList[j].child_report.length; x++) {
                replyArrS.push(that.data.talkList[j].child_report[x].cons);
              }
            }
            for (let i = 0; i < replyArrS.length; i++) {
              WxParse.wxParse('replyS' + i, 'html', replyArrS[i], that);
              if (i === replyArrS.length - 1) {
                WxParse.wxParseTemArray("replyTemArrayS", 'replyS', replyArrS.length, that)
              }
            }
          }
        })
      }
    })
  })
  },
  getMapSecond: function (e) {
    that = this;
    wx.chooseLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude2: res.latitude,
          longitude2: res.longitude,
          getMapS: res.address
        })
        if (that.data.getMapS) {
          that.setData({
            isNullS: false
          })
        }
      }
    })

  },

  talkArea1:function(e){
    that = this;
    var currAindex = e.currentTarget.dataset.index;
    if(that.data.currArea1!=currAindex){
    	that.setData({
      currArea1:currAindex,
    })
    }else if(that.data.currArea1==currAindex){
    	that.setData({
      currArea1:"xa",
    })
    }
    if (that.data.currArea1 == that.data.currArea1compare){
      that.setData({
        currArea1compare:-1
      })
    }else{
      that.setData({
        currArea1compare: currAindex
      })
    }
  },
  everyReply:function(e){
    that = this;
    var contentsReply = e.detail.value;
     that.setData({
       contentReply: contentsReply,
     })
  },


  submitTalk:function(e){
    var currIndex = e.currentTarget.dataset.index;
    that = this;
   server.getUserInfo(function(){
    server.sendRequest({
      url: '?r=wxapp.article.report.post_content&utoken=' + utoken + '&aid=' + that.data.aid + '&content=' + that.data.contentReply + '&rid=' + that.data.talkList[e.currentTarget.dataset.index].id + '&lng=' + that.data.longitude2 + '&lat=' + that.data.latitude2,    
        method: 'POST',
      success: function (res) {
        that.setData({
          isNullS: true,
          currArea1compare: -1,
          contentReply:''
        })
        server.sendRequest({
          url: '?r=wxapp.article.report.getlist&utoken=' + utoken + '&aid=' + that.data.aid,
            method: 'GET',
          success: function (res) {
            var talkLists = [];
            for (var i = 0; i < res.data.result.length; i++) {
              talkLists.push(res.data.result[i])
            }
            that.setData({
              talkList: talkLists,
              longitude2: '',
              latitude2: ''

            });
            var replyArr = [];
            for (let i = 0; i < that.data.talkList.length; i++) {
              replyArr.push(that.data.talkList[i].cons)
            }
            for (let i = 0; i < replyArr.length; i++) {
              WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
              if (i === replyArr.length - 1) {
                WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
              }
            }
            var replyArrList2 = [];
            var replyArrS = [];
            for (let j = 0; j < that.data.talkList.length; j++) {
              for (let x = 0; x < that.data.talkList[j].child_report.length; x++) {
                replyArrS.push(that.data.talkList[j].child_report[x].cons);
              }
            }
            for (let i = 0; i < replyArrS.length; i++) {
              WxParse.wxParse('replyS' + i, 'html', replyArrS[i], that);
              if (i === replyArrS.length - 1) {
                WxParse.wxParseTemArray("replyTemArrayS", 'replyS', replyArrS.length, that)
              }
            }
          }
        })
      }
    })
  })
  },
  talkArea2: function (e) {
    that = this;
    var currAindex2 = e.currentTarget.dataset.index;
    that.setData({
      currArea2: currAindex2
    })
    if (that.data.currArea2 == that.data.currArea2compare) {
      that.setData({
        currArea2compare: -1
      })
    } else {
      that.setData({
        currArea2compare: currAindex2

      })
    }
  },

  returnReview:function(){
    that = this;
    if (that.data.showReport) {
      that.setData({
        showReport: false
      })
    }

  },
  returnIndex: function () {
    var that = this;
    that.setData({
      talkAlert: false,
      submitShow: false,
    })
  },
  giveGood:function(e){
    var that = this;
    var currIndex = e.currentTarget.dataset.index;
    server.getUserInfo(function(){
    server.sendRequest({
      url: '?r=wxapp.article.report.like&utoken=' + utoken + '&aid=' + that.data.aid + '&rid=' + that.data.talkList[e.currentTarget.dataset.index].id,
      method: 'POST',
      success: function (res) {
        that.setData({
        })
       server.sendRequest({
           url: '?r=wxapp.article.report.getlist&utoken=' + utoken + '&aid=' + that.data.aid,
          method: 'GET',
          success: function (res) {
            var talkLists = [];
            for (var i = 0; i < res.data.result.length; i++) {
              talkLists.push(res.data.result[i])
            }

            that.setData({
              talkList: talkLists,

            });
            var talkListSeconds = [];
            for (var i = 0; i < that.data.talkList.length; i++) {
              talkListSeconds = (that.data.talkList[i].child_report)
            }
            that.setData({
              talkListSecond: talkListSeconds,
            });
          }
        })
      }
    })
  })
  },

  goodreturnIndex: function () {
    var that = this;
    that.setData({
      giveGood: false,
    })

  },
  getBLen: function (str) {
    if (str == null) return 0;
    if (typeof str != "string") {
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g, "ab").length;
  },

  getExpression:function(){
var that =this;
that.setData({
  isClick: !that.data.isClick,
})
    if (!that.data.showExpression){

  that.setData({
    showExpression:true,
  })

}else{
      that.setData({
        showExpression: false,
      })
}
  },
  getExpressionSec: function () {
    var that = this;
    that.setData({
      isClick: !that.data.isClick,
    })

    if (!that.data.showExpressionSec) {

      that.setData({
        showExpressionSec: true,
      })

    } else {
      that.setData({
        showExpressionSec: false,
      })

    }
  },
  wxPreEmojiTap: function (e) {
    var that = this;
    WxEmoji.wxPreEmojiTap(that, e);
  },

  wxPreEmojiTapRevi: function (e) {
    var that = this;
    WxEmoji.wxPreEmojiTapRevi(that, e);
  },
  wxPreEmojiTapReviSec: function (e) {
    var that = this;
    WxEmoji.wxPreEmojiTapReviSec(that, e);
  },


})
