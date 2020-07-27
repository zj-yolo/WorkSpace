var server = require('../../../utils/server');
Page({
  data: {
    cateList: [],
    cateid: 0,
    companyList: [],
    page: 1,
    pagesize: 10,
    noMore: false,
    typefrom: 0,
    viewfrom: null //从新版本投资版本进入
  },
  onLoad: function (options) {
    let that = this;
    that.loadCateList();
    if (options.type) {
      that.setData({
        cateid: options.type,
        typefrom: 1
      })
      if (options.from && options.from == 'maptemplate') {
        that.setData({
          viewfrom: 'maptemplate'
        })
      }
      that.loadCompany()
    }
  },
  loadCateList() {
    let that = this;
    server.sendRequest({
      url: '?r=wxapp.getAreaList',
      data: {},
      success: res => {
        if (res.data.status == 1) {
          //从新版本进入 
          let arr = res.data.result;
          if (this.data.viewfrom && this.data.viewfrom == 'maptemplate') {
            that.setData({
              cateList:arr.filter(x => x.pid != 0)
            })
          } else {
            that.setData({
              cateList: arr,
            })
          }
          if (that.data.typefrom == 0) {
            that.setData({
              cateid: res.data.result[0].id,
            })
            that.loadCompany();
          }
        }
      }
    })
  },
  loadCompany() {
    let that = this;
    server.sendRequest({
      url: '?r=wxapp.getAreaInfo',
      data: {
        cateid: that.data.cateid,
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      method: 'GET',
      success: res => {
        if (res.data.status == 1) {
          let companyList = that.data.page == 1 ? [] : that.data.companyList;
          let noMore = res.data.result.length == 0 ? true : false;
          companyList.push(...res.data.result);

          that.setData({
            companyList,
            noMore
          })
        }
      }
    })
  },
  toActicle(e) {
    wx.navigateTo({
      url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id + "&type=companyActicle"
    })
  },
  handleCate(e) {
    let that = this;
    that.setData({
      cateid: e.currentTarget.dataset.id,
      page: 1,
      companyList: []
    })
    that.loadCompany()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    let page = this.data.page;
    if (this.data.noMore) {
      page = page;
    } else {
      page = ++page;
    }
    this.setData({
      page,
    })

    this.loadCompany();
  },
  onShareAppMessage: function () {

  }
})