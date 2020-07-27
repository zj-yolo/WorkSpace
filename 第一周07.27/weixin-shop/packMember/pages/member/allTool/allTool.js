var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({

  data: {
    loading:true
  },
  onLoad: function () {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=member.tool&utoken=' + utoken,
      showToast: false,
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          loading:false,
          toolList: res.data.result
        })
      }
    })
  },
  //收藏
  navigateToCollect: function () {
    wx.navigateTo({
      url: '/pages/member/collect/collect'
    });
  },
  //地址
  navigateToAddress: function () {
    wx.navigateTo({
      url: '/pages/address/list/list'
    });
  },
  //优惠
  navigateToCoupon: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/coupon/myCoupon/myCoupon'
    });
  },
  //预约
  yu_list: function () {
    wx.navigateTo({
      url: '/pages/services/list/index'
    });
  },
  //分销
  navigateRegister: function () {
    wx.navigateTo({
      url: '/pages/bottom/commission/index'
    });
  },
  // 跳转
  navigateToList: function () {
    wx.navigateTo({
      url: '/pages/member/jump/jump'
    });
  },
  // 团购
  groupsbuy: function (e) {
    wx.navigateTo({
      url: '/packMember/pages/member/allTool/groupbuy/index?id=0'
    });
  },
  groupsbuyDetail: function (e) {
    wx.navigateTo({
      url: '/packageA/pages/groupbuy/groupList/index',

    })
  },


  // 开店
  loginbtn: function () {
    wx.navigateTo({
      url: '/pages/member/registered/index',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 进入会员卡中心
  joinMemberCar: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/activeCard/activeCard',
    })
  },
  // 进入关于我们
  joinUs: function () {
    wx.navigateTo({
      url: '/pages/member/aboutus/aboutus',
    })
  },
  // 进入积分商城
  joinIntegral: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/integral/home/index',
    })
  },
  // 进入VIP开卡
  joinVIPCard: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/membership/index',
    })
  },
  // 进入签到
  joinSign: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/sign/sign',
    })
  },
  // 进入发起活动
  joinCreateActivity: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/groupActivity/groupActivity',
    })
  },

  // 进入我的活动
  joinMyActivity: function () {
    wx.navigateTo({
      url: '/packMember/pages/member/groupActivity/channel/channel',
    })
  },
  // 进入发布供求
  joinsupdem: function () {
    wx.navigateTo({
      url: '/packageA/pages/supdem/supdem',
    })
  },
  // 进入我的供求
  joinexihibit: function () {
    wx.navigateTo({
      url: '/packageA/pages/supdem/myexhibit/myexhibit',
    })
  },
  // 进入自定义列表
  joincustomerForm: function () {
    wx.navigateTo({
      url: '/packageA/pages/customerForm/formSuccess/formSuccess',
    })
  },
})
