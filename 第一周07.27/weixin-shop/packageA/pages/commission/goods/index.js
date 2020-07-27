const server = require('../../../../utils/server')

Page({

  data: {
    page: 1,
    pageSize: 10,
    noMore: false,
    goodsList: [],
    hasContent: true,
  },

  onLoad: function (options) {
    if(options.uid) {
      this.setData({
        uid: options.uid,
      })
    }
    this.getGoods();
  },
  getGoods() {
    let { page, pageSize, goodsList } = this.data;
    server.sendRequest({
      url: '/api/Distribution/getGoods',
      method: "GET",
      data: {
        cateid: -1,
        page,
        page_size: pageSize
      },
      success: res => {
        if (res.data.code == 200) {
          let list = page == 1 ? [] : goodsList;
          list.push(...res.data.result.list);
          let noMore = res.data.result.list.length == 0 ? true : false;
          let hasContent = list.length == 0 ? false : true;
          this.setData({
            goodsList: list,
            noMore,
            hasContent
          })
        } else {
          this.setData({
            hasContent: false,
          })
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  onReachBottom() {
    let page = this.data.page;
    if (!this.data.noMore) {
      page += 1;
    }
    this.setData({
      page,
    })

    this.getGoods();
  },
  handleSkip(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?objectId=' + id + '&uid=' + this.data.uid,
    })
  },
  onShareAppMessage: function () {

  }
})