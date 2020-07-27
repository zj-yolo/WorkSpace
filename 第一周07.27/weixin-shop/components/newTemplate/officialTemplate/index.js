var WxParse = require('../../../wxParse/wxParse.js');
Component({
  properties: {
    pageData: Object
  },
  data: {
    toView: '',
    cateIndex: 0
  },
  attached() {
    let that = this;
    let richData = that.properties.pageData.set.content;
    if (richData) {
      richData.forEach((item, index) => {
        // console.log(item, 22)
        if (item) {
          WxParse.wxParse('introduce' + index, 'html', item, that, 5);
        }
      })
    }
  },
  methods: {
    handleIntoview(e) {
      let type = e.currentTarget.dataset.type;
      let id = e.currentTarget.dataset.id;
      this.setData({
        toView: type,
        cateIndex: id
      })
      if (id == 4) {
        wx.switchTab({
          url: '/pages/card/index/index',
        })
      }
    },
    todetail(e) {
      wx.navigateTo({
        url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id
      });
    },
    toacticle(e) {
      if (e.currentTarget.dataset.type) {
        wx.navigateTo({
          url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type
        })
      }
      if (e.currentTarget.dataset.from) {
        wx.navigateTo({
          url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id
        });
      }
    }
  }
})