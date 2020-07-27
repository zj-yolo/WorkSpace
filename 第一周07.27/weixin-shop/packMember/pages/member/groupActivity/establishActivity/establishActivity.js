var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");

Page({
  data: {
    isallActivity:true,
    showImage: false,
    cardAgain:false,
    imgUrls: [],
    showImgUrls: [],
    activityList:[],
    limit:'不限',
    currIndexImg:1,
    activityTop:'',
    shareIcon: false
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function (options) {
    if (options.share) {
      this.setData({
        shareIcon: true
      })
    }
    var that = this;
     utoken = wx.getStorageSync("utoken");
    that.setData({
      activity_id: options.activity_id,
    })

    server.sendRequest({
      url: '?r=activity.index.get_activity&utoken=' + utoken + '&activity_id=' + that.data.activity_id,
      method: 'POST',
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.result.title,
        });
        that.setData({
         activityList: res.data.result,
         title: res.data.result.title,
         views: res.data.result.views,
         membersList: res.data.result.members,
         members: res.data.result.members.length,
         type: res.data.result.type,
         locate: res.data.result.locate,
         cost_type: res.data.result.cost_type,
         sy: res.data.result.start_time.y,
         sm: res.data.result.start_time.m,
         sd: res.data.result.start_time.d,
         sh: res.data.result.start_time.h,
         si: res.data.result.start_time.i,  
         ey: res.data.result.end_time.y,
         em: res.data.result.end_time.m,
         ed: res.data.result.end_time.d,
         eh: res.data.result.end_time.h,
         ei: res.data.result.end_time.i,           
         imgUrls: res.data.result.banner_imgs,
         Imagenum: res.data.result.banner_imgs.length,
         limit_members: res.data.result.limit_members,
         mynickname: res.data.result.members[0].nickname,
         mobile: res.data.result.mobile,
         lat: res.data.result.lat,
         lng: res.data.result.lng

        });

        for (var i in that.data.membersList) {
          if (!that.data.membersList[i].nickname) {
            delete that.data.membersList[i]
          }
        }
        that.setData({
          membersList: that.data.membersList
        }); 


        if (parseInt(that.data.limit_members)==0){
          that.setData({
            limit_members: that.data.limit
          })
             }               
      }
    })
  },
  clickOpen:function(){
var that = this;
that.setData({
  isallActivity:false
})
  },
  clickStop: function () {
    var that = this;
    that.setData({
      isallActivity: true
    })
  },
  joinImage: function () {
   var that = this;
    if (!that.data.showImage) {
      that.setData({
        showImage: true
      })
    }
  },
  // 退出缩略轮播图
  showImages: function () {
    var that = this;
    that.setData({
      showImage: false
    })
  },

// 缩略轮播图
  currChange:function(e){
    var that = this;
that.setData({
  currIndexImg: parseInt(e.detail.current)+1
})
  },
  userNavigation:function(){
    var that = this;
        wx.openLocation({
          latitude: parseFloat(that.data.lat),
          longitude: parseFloat(that.data.lng),
          scale: 28
        })
  },
  // 用户详细页
  joinUserInform: function () {
    var that = this;
    wx: wx.navigateTo({
      url: '/packMember/pages/member/groupActivity/userInformation/userInformation?&activity_id=' + that.data.activity_id + '&allNum='+that.data.members,
    })
  },

  // 转发
  onShareAppMessage: function () {
    var that = this; 
    var str = '/packMember/pages/member/groupActivity/establishActivity/establishActivity?objectId=' + that.data.goodsId + "&activity_id=" + that.data.activity_id + '&share=' + 'share';
    return {
      title: that.data.title + that.data.type,
      path: str
    } 
  },
  
  joinActivity:function(){
var that = this;
   utoken = wx.getStorageSync("utoken");
    server.getUserInfo(function(){
    server.sendRequest({
      url: '?r=activity.index.join&utoken=' + utoken + '&activity_id=' + that.data.activity_id,
      data: {},
      method: 'POST',
      success: function (res) {
      that.setData({
        activityTop:res.data.msg
      })

        server.sendRequest({
         url: '?r=activity.index.get_activity&utoken=' + utoken + '&activity_id=' + that.data.activity_id,
          data: { },
          method: 'POST',
          success: function (res) {
            that.setData({
              membersList: res.data.result.members,
              members: res.data.result.members.length,  
              cardAgain:true        
            });
            for (var i in that.data.membersList) {
              if (!that.data.membersList[i].nickname) {
                delete that.data.membersList[i]
              }
            }
            that.setData({
              membersList: that.data.membersList
            }); 


          }
        })
      }
    })
    })

  },

  returnIndex: function () {
    var that = this;
    that.setData({
      cardAgain: false,
    })
  },

})