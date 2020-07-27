var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var that = '';
Page({
  data: {
    getCardList:[],
    name:'',
    recharge:'',
    money:'',
    id:'',
    
  },
  onLoad: function (options) { 
    console.log(options);
    that = this;
    that.setData({
      money: options.money,
      id: options.id,
    });
  },
  realnameCont: function (e) {
var that = this;
that.setData({
  realname: e.detail.value
})
  },

  mobileCont: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },


  formSubmit: function (e) {
  console.log(e)
  if (!that.data.realname) {
    wx.showModal({
      title: '消息',
      content: '姓名不能为空',
      showCancel: false,
      confirmColor: '#ff6a6a'
    })
    return;
  }
  if (!(/^1(3|4|5|7|8)\d{9}$/.test(that.data.mobile))) {
    wx.showModal({
      title: '消息',
      content: '手机号格式不正确',
      showCancel: false,
      confirmColor: '#ff6a6a'
    })
    return;
  }
   
  var realname = that.data.realname;
  var mobile = that.data.mobile;
    wx.navigateTo({
      url: '../cardInfo/cardInfo?money=' + that.data.money + '&cardid=' + that.data.id + '&realname=' + realname + '&mobile=' + mobile,
    })

  },
})