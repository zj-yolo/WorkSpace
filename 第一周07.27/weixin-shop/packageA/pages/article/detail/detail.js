var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
  data: {
    detail: [],
    article: '',
    numberPhone: '0',
    shareIcon: false,
    contentIndex: null,
    articlefrom: true,
    newcompany: false, //从个人投资版本进入;
    companyTitle: '',
    createTime: ''
  },
  onLoad: function (options) {
    let that = this;
    //通过官网版按钮传递过来的字段来决定加载文章内容并设置页面标题
    if (options.index && options.titleName) {
      let name = options.titleName.slice(0, 4);
      wx.setNavigationBarTitle({
        title: name
      })
      that.setData({
        contentIndex: options.index
      })
      that.getcompanyInfo();
    } else if (options.from && options.from == "grabArticle") {
      //从门户版本跳转过来
      that.setData({
        articlefrom: false
      })
      that.getArticle(options.objectId)

    } else if (options.type && options.type == 'companyActicle') {
      //从企业介绍进入
      that.setData({
        articlefrom: false
      })
      that.getnewCompanyDetail(options.objectId)
    } else {
      if (options.share) {
        that.setData({
          shareIcon: true
        })
      }
      let Id = options.objectId;
      that.setData({
        objectId: options.objectId
      })
      if (options.merichid) {
        let merichid = options.merichid;
        that.setData({
          merichid: options.merichid
        })
        that.getShopTitle(Id, merichid);
      } else {
        that.getDetail(Id);
      }
    }
  },
  getDetail: function (Id) {
    let that = this
    let utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxarticle&aid=' + Id + '&utoken=' + utoken,
      method: 'GET',
      success: function (res) {
        that.data.detail = res.data.result;
        let article = that.data.detail.article_content;
        WxParse.wxParse('article', 'html', article, that, 5);
        that.setData({
          detail: that.data.detail
        });
        if (res.data.result.article_tel) {
          that.setData({
            numberPhone: res.data.result.article_tel
          })
        }
      }
    })
  },
  //获取抓取文章的详情
  getArticle(acticleId) {
    var that = this;
    server.sendRequest({
      url: '/api/articles/detail',
      data: {
        id: acticleId,
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 200) {
          let article = res.data.result.articles.detail;
          WxParse.wxParse('article', 'html', article, that, 5);
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  //加载公司介绍
  getcompanyInfo() {
    var that = this
    let data = {};
    let obj = wx.getStorageSync('obj')
    data.wxid = obj.wxid;
    if (obj.unionid) {
      data.unionid = obj.unionid;
    }
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').utoken) {
      data.utoken = wx.getStorageSync('userInfo').utoken
    }
    server.sendRequest({
      url: '?r=wxapp.getShopDiyBase',
      data: data,
      method: 'POST',
      success: function (res) {
        if (res.data.status == 1) {
          let companyInfo;
          if (res.data.result && res.data.result.set && res.data.result.set.content) {
            companyInfo = res.data.result.set.content[that.data.contentIndex]
          }
          WxParse.wxParse('companyInfo', 'html', companyInfo, that, 5);
        }
      }
    })

  },
  //加载企业介绍
  getnewCompanyDetail(id) {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.getEnterprise',
      data: {
        id
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status == 1) {
          let time = res.data.result.createtime ? (res.data.result.createtime).slice(0, 10) : '';
          that.setData({
            companyTitle: res.data.result.title,
            createTime: time,
            newcompany: true
          })
          WxParse.wxParse('newcompany', 'html', res.data.result.content, that, 5);
        }
      }
    })
  },
  getShopTitle: function (Id, merichid) {
    let that = this
    let utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxarticle.index.getmerchaticle&aid=' + Id + '&utoken=' + utoken + '&merichid' + merichid,
      method: 'GET',
      success: function (res) {
        that.data.detail = res.data.result;
        let article = that.data.detail.article_content;
        WxParse.wxParse('article', 'html', article, that, 5);

        that.setData({
          detail: that.data.detail
        });
      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this,
      str;
    if (that.data.merichid) {
      str = "/packageA/pages/article/detail/detail?objectId=" + that.data.objectId + '&merichid=' + that.data.merichid + '&share=' + 'share';
    } else {
      str = "/packageA/pages/article/detail/detail?objectId=" + that.data.objectId + '&share=' + 'share';
    }

    //merichid
    return {
      title: that.data.detail.article_title,
      path: str,
    }
  },

  artPhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.numberPhone
    })
  }
})