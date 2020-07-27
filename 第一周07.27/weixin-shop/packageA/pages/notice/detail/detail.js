var server = require('../../../../utils/server');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
  data: {
    detail: [],
    article:''
  }, 
  onLoad: function (options) {
    let Id = options.objectId;
    this.getDetail(Id);
  },
  getDetail: function (Id) {
    let that = this
    server.sendRequest({
      url: '?r=wxapp.notice.detail&aid=' + Id,
      method: 'GET',
      success: function (res) {
        that.data.detail = res.data.result;
        let article = that.data.detail.detail;
        WxParse.wxParse('article', 'html', article, that, 5);
        that.setData({
          detail: that.data.detail
        });
      }
    })

  },
})