var WxParse = require('../../wxParse/wxParse.js');
Component({
  properties: {
    pageData: Object,
    storeList: Array,
    richtextList: Array,
    videos: Object,
    acticleList: Array,
  },
  data: {
    btnList: [],
    allStatus: true
  },
  attached: function() {
    var that = this;
    //通过返回的所有门店状态来判断门店模板是否隐藏
    let merchant = that.properties.storeList;
    let merchantStatus = [];
    if (merchant.length > 0) {
      merchant.forEach((item) => {
        merchantStatus.push(item.status)
      })
      let status_C = !merchantStatus.every((value) => value == 0);
      that.setData({
        allStatus: status_C
      })
      console.log(that.data.allStatus)
    }else{
      that.setData({
        allStatus: false
      })
    }
    let richData = that.properties.richtextList;
    if (richData) {
      richData.forEach((item, index) => {
        WxParse.wxParse('introduce' + index, 'html', item, that, 5);
      })
    }
    if (that.properties.pageData && that.properties.pageData.set && that.properties.pageData.set.titleimage) {
      let iconTitle = that.properties.pageData.set.titleimage;
      iconTitle.forEach((item, index) => {
        iconTitle[index] = item.slice(0, 6)
      })
      that.setData({
        btnList: iconTitle
      })
    }
  },
  methods: {
    gobtnURL(e) {
      let index = e.currentTarget.dataset.index;
      if (index == '3') {
        wx.navigateTo({
          url: '/packageA/pages/submitForm/index?banner=' + this.properties.pageData.set.background[0],
        })
      } else {
        let titleName = this.properties.pageData.set.titleimage[index]
        wx.navigateTo({
          url: `/packageA/pages/article/detail/detail?index=${index}&titleName=${titleName}`
        });
      }
    },
    skipLiveStreaming() {
      wx.navigateTo({
        url: '/packageA/pages/live/index',
      })
    },
    tostore(e) {
      wx.navigateTo({
        url: '/packageA/pages/store/detail/index?id=' + e.currentTarget.dataset.id
      })
    },
    toacticle(e) {
      wx.navigateTo({
        url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id
      });
    }
  }
})