var server = require('../../../../utils/server');
Page({
  data: {},
  onLoad: function (options) {
    var that = this;
    this.loadPageData();
  },
  loadPageData: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxarticle.list.getmerchlist&merchid=3',
      method: 'GET',
      success: function(res) {
        console.log(res)
        that.setData({
          data: res.data
        });
  }})
},
  getToPage: function(event) {
    server.getToPage(event);
  },

})
