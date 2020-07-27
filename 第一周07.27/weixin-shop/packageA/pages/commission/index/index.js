const server = require('../../../../utils/server')

Page({

  data: {
    cateId: '',
    cateList: [],
    showModal: false,
    page: 1,
    pageSize: 10,
    noMore: false,
    goodsList: [],
    hasContent: true,
  },

  onLoad: function (options) {
    this.getCateList();
  },

  onShow: function () {

  },
  getCateList() {
    server.sendRequest({
      url: '/api/Distribution/getGoodsCate',
      method: 'GET',
      data: {},
      success: res => {
        if(res.data.code == 200) {
          let list = res.data.result;
          let cateId = list[0] ? list[0].id : '';
          this.setData({
            cateList: list,
            cateId
          })
          this.getGoods();
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  getGoods() {
    let { cateId, page, pageSize, goodsList} = this.data;
    server.sendRequest({
      url: '/api/Distribution/getGoods',
      method: "GET",
      data: {
        cateid: cateId,
        page,
        page_size: pageSize
      },
      success: res => {
        if(res.data.code == 200) {
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
  handleCateClick(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      cateId: id,
      page: 1,
    })
    this.getGoods();
  },
  handleShowModal(e) {
    let type = e.currentTarget.dataset.type;
    if(type == 'single') {
      let item = e.currentTarget.dataset.item;
      this.setData({
        shareItem: item,
      })
    }

    this.setData({
      showModal: true,
      shareType: type,
    })
  },
  handleCloseModal() {
    this.setData({
      showModal: false,
    })
  },
  stopPropagation() {
    return false;
  },
  handleShowRule() {
    wx.navigateTo({
      url: '/packageA/pages/commission/rule/index',
    })
  },
  handleShare() {
    let goodsId = '';
    if(this.data.shareType == 'single') {
      goodsId = this.data.shareItem.goodsid;
    }
    wx.navigateTo({
      url: '/packageA/pages/commission/share/index?goodsId=' + goodsId,
    })
  },
  onReachBottom() {
    let page = this.data.page;
    if(!this.data.noMore) {
      page += 1;
    }
    this.setData({
      page,
    })

    this.getGoods();
  },
  handleSkip(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?objectId=' + id,
    })
  },
  onShareAppMessage: function () {
    let shareType = this.data.shareType;
    let uid = wx.getStorageSync('uid');
    let params = {}

    if(shareType == 'single') {
      params.title = this.data.shareItem.title;
      params.path = '/pages/goods/detail/detail?uid=' + uid + '&objectId=' + this.data.shareItem.goodsid,
      params.imageUrl = this.data.shareItem.image;
    } else {
      params.path = '/packageA/pages/commission/goods/index?uid=' + uid;
    }

    return params;
  }
})