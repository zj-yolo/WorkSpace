var server = require('../../../../utils/server');
var cPage = 0;
var ctype = "-1";
Page({
  tabClick: function(e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({
      tabClasss: classs,
      tab: index
    })
    var types = ["-1", "0", "1"]
    cPage = 0;
    ctype = types[index];
    this.data.comments = [];
    this.getEvaluateLists(ctype, cPage);
  },
  onReachBottom: function() {
    this.getEvaluateLists(ctype, ++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function() {

    cPage = 0;
    this.data.orders = [];
    this.getEvaluateLists(ctype, cPage);
  },

  data: {
    comments: [],
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
  },
  getEvaluateLists: function(cType, page) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id

    server.getJSON('/User/comments/user_id/' + user_id + "/page/" + page + "/status/" + cType, function(res) {
      var datas = res.data.result;
      var ms = that.data.comments
      for (var i in datas) {
        ms.push(datas[i]);
      }
      wx.stopPullDownRefresh();
      that.setData({
        comments: ms
      });
    });

  },
  details: function(e) {
    var index = e.currentTarget.dataset.index;
    var goods = this.data.comments[index];
    wx.navigateTo({
      url: '/pages/order/details/index?order_id=' + goods['order_id']
    });
  },
  addevaluate: function(e) {
    var index = e.currentTarget.dataset.index;
    var goods = this.data.comments[index];
    wx.navigateTo({
      url: '/packMember/pages/member/evaluate/addevaluate/index?goods_name=' + goods['goods_name'] + "&image=" + goods['image'] + "&spec=" + goods['spec_key_name'] + "&goods_id=" + goods['goods_id'] + "&order_id=" + goods['order_id']
    });
  },
  onLoad: function() {
    cPage = 0;
    this.getEvaluateLists("-1", cPage);
    return;
  }
});