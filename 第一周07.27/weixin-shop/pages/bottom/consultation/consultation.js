var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var that = '';
Page({
  data: {
    numid: 0,
    sub: 0,
    list: [],
    cateid: '',
    cateId: [],
    articleId: [],
    currarticleId: '',
    getcurrid: '',
    getid: 299,
  },
  onLoad: function (options) {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.article.list&utoken=' + utoken,
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          if (res.data.result[0]) {
            var list = res.data.result;
            var numid = [];
            var numStr = {};
            var cateIds = [];
            for (var i = 0; i < list.length; i++) {
              numid.push(i);
              list[i].numid = numid[i];
              cateIds.push(list[i].id);
            }
            that.setData({
              list: res.data.result,
              cateId: cateIds,
              cateid: res.data.result[0].id
            });
            that.getArticleList();
          }
        }
      }
    })
  },

  getArticleList: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.article.list.getlist&utoken=' + utoken + '&cateid=' + that.data.cateId[that.data.sub],
      method: 'GET',
      success: function (res) {
        var listArticle = res.data.result;
        var articles = [];
        for (var i = 0; i < listArticle.length; i++) {
          articles.push(listArticle[i].id);
        }
        that.setData({
          allNews: res.data.result,
          articleId: articles
        });
      }
    })
  },
  onShow: function () {
    var that = this;
    if (that.data.cateId != '') {
      that.getArticleList();
    }
  },
  clickTitle: function (e) {
    var that = this;
    var sub = e.currentTarget.dataset.index;
    var getcurrids = e.currentTarget.dataset.id;
    that.setData({
      sub: sub,
      numid: sub,
      getcurrid: getcurrids
    })
    that.getArticleList();
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  joinDetail: function (e) {
    that = this;
    var currid = e.currentTarget.dataset.index;
    that.setData({
      currarticleId: currid,
    })
    wx.navigateTo({
      url: '/packageA/pages/consultation/consultationDetail/consultationDetail?aid=' + that.data.articleId[that.data.currarticleId]
    })
  }
})