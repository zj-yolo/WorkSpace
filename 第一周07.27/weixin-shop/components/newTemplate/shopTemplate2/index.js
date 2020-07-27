const server = require('../../../utils/server');
const {
  loadliveList,
  skipLiveStreaming,
  loadcouponList,
  receiveCoupon,
  getcateData
} = require('../../../common/api');
Component({
  properties: {
    pageData: Object,
  },
  data: {
    liveInfo: [],
    couponList: []
  },
  attached() {
    //从外部获得直播数据回调数据
    loadliveList((params) => {
      this.setData({
        liveInfo: params
      })
    });
    //从外部获得分类数据回调数据
    getcateData((params) => {
      this.setData({
        cateList: params
      })
    });
    //获取优惠券列表promise方式
    loadcouponList().then(res => {
      let couponList = res.slice(0, 3)
      this.setData({
        couponList: couponList
      })
    });
  },
  methods: {
    skipLiveItem(e) {
      skipLiveStreaming(e)
    },
    handleconfirm(e) {
      wx.navigateTo({
        url: '/pages/goods/list/list?keywords=' + e.detail.value,
      })
    },
    skipCate() {
      wx.switchTab({
        url: '/pages/category/category',
      })
    },
    tocateDetail(e) {
      let categoryItem = {
        categoryId: e.currentTarget.dataset.id,
        categoryIndex: e.currentTarget.dataset.index
      }
      wx.setStorageSync('categoryItem', categoryItem)
      wx.switchTab({
        url: '/pages/category/category',
      })
    },
    tostoreDetail(e) {
      let storeId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/packageA/pages/store/detail/index?id=' + storeId,
      })
    },
    handlemorestore() {
      wx.navigateTo({
        url: '/pages/order/mendian/index',
      })
    },

    //领取优惠券
    handlegaveCoupon(e) {
      let id = e.currentTarget.dataset.id;
      receiveCoupon(id)
    },
    intogoodsdetail(e) {
      wx.navigateTo({
        url: '../goods/detail/detail?objectId=' + e.currentTarget.dataset.goodsid,
      })
    },
  }
})