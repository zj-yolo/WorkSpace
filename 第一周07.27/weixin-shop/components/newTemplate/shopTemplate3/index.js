// components/newTemplate/shopTemplate3/index.js
const {
  loadliveList,
  skipLiveStreaming,
  loadcouponList,
  receiveCoupon,
  getcateData,
  getcategoodsList
} = require('../../../common/api');
Component({
  properties: {
    pageData: Object
  },
  data: {
    searchIcon: true,
    searchKey: '',
    liveInfo: [],
    couponList: [],
    cateList: [],
    cateActive: 0,
    cateGoodslist:[]
  },
  attached() {
    loadliveList((params) => {
      this.setData({
        liveInfo: params
      })
    });
    loadcouponList().then(res => {
      let couponList = res.slice(0,3)
      this.setData({
        couponList: couponList
      })
    });
    //分类数据
    getcateData((params) => {
      let cateItem = {
        name: '推荐',
        id: '0'
      }
      params.unshift(cateItem);
      this.setData({
        cateList: params
      })
    })
  },
  methods: {
    skipLiveItem(e) {
      skipLiveStreaming(e)
    },
    handconfirm(e){
      wx.navigateTo({
        url: '/pages/goods/list/list?keywords=' + e.detail.value,
      })
    },
    handleInput(e) {
      this.setData({
        searchIcon: false,
        searchKey: e.detail.value
      })
      if (e.detail.value == "") {
        this.setData({
          searchIcon: true
        })
      }
    },
    handleCateClck(e){
      this.setData({
        cateActive:e.currentTarget.dataset.id
      })
      getcategoodsList(e.currentTarget.dataset.id,params=>{
        console.log(params)
        this.setData({
          cateGoodslist:params
        })
      })
    },
    handlegaveCoupon(e) {
      let id = e.currentTarget.dataset.id;
      receiveCoupon(id)
    },
    intogoodsdetail(e) {
      console.log(e.currentTarget.dataset.goodsid)
      wx.navigateTo({
        url: '../goods/detail/detail?objectId=' + e.currentTarget.dataset.goodsid,
      })
    },
  },
})