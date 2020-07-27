Component({
  properties: {
    pageData: Object,
    allArticle: Array,
  },
  data: {
    keyword: ''
  },
  methods: {
    sreachinput: function(e) {
      let that = this;
      wx.navigateTo({
        url: '/pages/goods/list/list?keywords=' + e.detail.value,
      })
      that.setData({
        keyword: ''
      })
    },
    toareaList(e) {
      console.log(e)
      if (e.currentTarget.dataset.type) {
        wx.navigateTo({
          url: '/packageA/pages/companyList/index?type=' + e.currentTarget.dataset.type,
        })
      } else {
        wx.navigateTo({
          url: '/packageA/pages/companyList/index',
        })
      }
    },
    skipLiveStreaming() {
      wx.navigateTo({
        url: '/packageA/pages/live/index',
      })
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