var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    autoplay: false,
    interval: 5000,
    duration: 1000,
    colorId: 1,
    colorIndex: 0,
    loading: true
  },
  onLoad: function() {
    var that = this
    that.getIndexData()
  },
  updataColor: function(e) {
    var that = this
    that.setData({
      colorId: e.currentTarget.dataset.id,
      colorIndex: e.currentTarget.dataset.index
    })
  },
  getIndexData() {
    var that = this
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.wx',
      method: 'GET',
      success: function(res) {
        that.setData({
          indexData: res.data.result
        })
        var pro
        for (let i in that.data.indexData.hotGoods) {
          pro = (that.data.indexData.hotGoods[i].orderprice / that.data.indexData.hotGoods[i].price) * 100
          that.data.indexData.hotGoods[i].haha = parseFloat(pro).toFixed(2)
        }
        that.setData({
          indexData: that.data.indexData
        })
        var proB
        for (let j in that.data.indexData.category) {
          for (let h in that.data.indexData.category[j].goods) {
            proB = (that.data.indexData.category[j].goods[h].orderprice / that.data.indexData.category[j].goods[h].price) * 100
            that.data.indexData.category[j].goods[h].hahab = parseFloat(proB).toFixed(2)
          }

        }
        that.setData({
          indexData: that.data.indexData,
          loading: false
        })
      }
    })
  },
  isBanner: function(e) {
    var that = this
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  ishote: function(e) {
    var that = this
    console.log('1', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/index?id=' + e.currentTarget.dataset.id
    })
  },
  onPullDownRefresh: function() {
    this.getIndexData()
    wx.stopPullDownRefresh()
  },
})