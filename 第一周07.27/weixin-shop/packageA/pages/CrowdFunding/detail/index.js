var server = require('../../../../utils/server');
var utoken = 0;
if (wx.getStorageSync("utoken")) {
  utoken = wx.getStorageSync("utoken");
}
var WxParse = require('../../../../wxParse/wxParse.js');
let content, goodsid;

Page({


  data: {
    type: 0,
    num: 1,
    sum: 0,
    isfavorite: 0,
    loading: true,
    flag: false
  },
  onLoad: function(e) {
    var that = this;
    that.setData({
      goodsid: e.id
    })
   if(getCurrentPages().length <= 1){
     that.setData({
       flag: true
     })
   }
  },
  onShow(e) {
    let that = this;
    // 商品的id
    // goodsid=e.goodsid;
    that.loadData();


  },
  addCollect() {
    let that = this;
    server.getUserInfo(function() {
      let isfavorite;
      if (that.data.isfavorite == 1) {
        isfavorite = 0;
      } else {
        isfavorite = 1;
      }
      server.sendRequest({
        url: '?r=wxapp.crowdFunding.goods.collect',
        data: {
          goodsid: that.data.goodsid,
          utoken,
          isfavorite: isfavorite
        },
        method: 'GET',
        success: function(res) {
          that.setData({
            isfavorite: res.data.result.isfavorite
          })
        }
      })
    })

  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '?r=wxapp.crowdFunding.goods.detail',
      data: {
        goodsid: that.data.goodsid,
        utoken: utoken
      },
      method: 'GET',
      success: function(res) {
        let sum = (res.data.result.goods.orderprice / res.data.result.goods.price * 100).toFixed(2);
        that.setData({
          data: res.data.result,
          sum: sum,
          isfavorite: res.data.result.goods.isfavorite,
          title: res.data.result.goods.title,
          loading: false
        })
        content = res.data.result.goods.content;
        WxParse.wxParse('contain', 'html', content, that, 5);
      }
    })
  },
  // 前往购买
  toBuy() {
    var that = this
    server.getUserInfo(function() {
      wx.navigateTo({
        url: '../order/index?goodsid=' + that.data.goodsid + '&num=' + that.data.num + '&itemid=' + that.data.data.goods.items[that.data.type].id
      })
    })

  },
  // 切换种类
  toSelect(e) {
    this.setData({
      type: e.currentTarget.dataset.index,
      num: 1
    })
  },

  // 通过input修改数量
  bindManual(e) {
    let that = this;
    let num = e.detail.value
    if (!num) {
      that.setData({
        num: 1
      })
    } else {
      that.setData({
        num: num
      })
    }

  },
  // 减少
  bindMinus() {
    let that = this;
    let num = that.data.num;
    num = num - 1;
    if (num <= 1) {
      that.setData({
        num: 1
      })
    } else {
      that.setData({
        num: num
      })
    }

  },
  // 增加
  bindPlus() {
    let that = this;
    let num = that.data.num;

    let count = that.data.data.goods.items[that.data.type].count;

    if (num == count) {
      wx.showToast({
        title: '最多只能购买数量为' + count,
        icon: 'none'
      })
    } else {

      num = num + 1;
      that.setData({
        num: num
      })

    }

  },
  move() {
    var countall = 0
    for (let i in this.data.data.goods.items) {
      countall += parseInt(this.data.data.goods.items[i].count)
    }
    if (parseInt(countall) != 0) {
      if (parseInt(this.data.data.goods.items[this.data.type].count) != 0) {
        this.setData({
          buy: 1,
        })
        var anima1 = wx.createAnimation({
          timingFunction: 'ease-in',
        }).translate(0, -600).step({
          duration: 500
        });
        this.setData({
          animationData: anima1.export()
        })
        this.setData({
          pf: true
        })
      } else {
        wx.showToast({
          title: '请先选择档位',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '暂时没有库存',
        icon: 'none'
      })
    }
  },
  none: function() {
    var anima1 = wx.createAnimation({
      timingFunction: 'ease-in',
    }).translate(0, 600).step({
      duration: 300
    });

    this.setData({
      animationData: anima1.export(),
      pf: false
    })
    this.setData({
      buy: '',
    })
  },
  // 分享
  onShareAppMessage: function(res) {
    return {
      title: this.data.title,
      path: '/packageA/pages/CrowdFunding/detail/index?id=' + this.data.data.goods.id,
      imageUrl: this.data.data.goods.thumb_url[0]
    }
  },
  backToIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})