var server = require('../../utils/server');
Component({
  properties: {
    pageData: Object,
    allArticle:Array
  },
  data: {
    // 自定义自己喜欢的颜色
    colorArr: ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
      "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
      "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
      "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
      "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"
    ],
    // 存储随机颜色
    randomColorArr: [],
    // 存储随机关注数
    dataArr: [],
    cateList: [],
    allgoodsList: [],
    tabindex: 0,
    storeID: '',
    page: 1,
    pagesize: 10,
    moreGoods: true,
    is_mianyi:0
  },
  attached: function() {
    var that = this;
    // 随机颜色
    var labLen = that.properties.pageData.shopinfo.base.label.length,
      colorArr = that.data.colorArr,
      colorLen = colorArr.length,
      randomColorArr = [];

    do {
      let random = colorArr[Math.floor(Math.random() * colorLen)];
      randomColorArr.push(random);
      labLen--;
    } while (labLen > 0)
    //随机关注数
    let datas = [];
    for (let i = 0; i < that.properties.pageData.shopinfo.brand.length; i++) {
      let datai = that.randomNumBoth(99, 96)
      datas.push(datai)
    }
    let storeID = that.properties.pageData.shopinfo.base.uniacid;
    that.setData({
      randomColorArr,
      storeID,
      dataArr: datas,
      is_mianyi: wx.getStorageSync('is_mianyi')
    })
    that.getallgoodsCate();
  },
  methods: {
    getallgoodsCate() {
      var that = this;
      server.sendRequest({
        url: '/api/shop/getCategory',
        data: {
          wxid: that.data.storeID
        },
        method: 'GET',
        success: (res) => {
          if (res.data.code == 200) {
            let cateItem = {
              id: 0,
              name: '全部商品'
            }
            let cateList = res.data.result.data.parent;
            cateList.unshift(cateItem);
            that.setData({
              cateList: cateList
            })
            this.getallgoods();
          } else {
            console.log(res.data.msg)
          }
        }
      }, 'https://5g-center.cnweisou.net')
    },
    skipLiveStreaming() {
      wx.navigateTo({
        url: '/packageA/pages/live/index',
      })
    },
    getallgoods() {
      var that = this;
      server.sendRequest({
        url: '/api/shop/getXdGoodsList',
        data: {
          wxid: that.data.storeID,
          category_id: that.data.tabindex,
          page: that.data.page,
          pagesize: that.data.pagesize
        },
        method: 'GET',
        success: (res) => {
          if (res.data.code == 200) {
            let allgoodsList = that.data.page == 1 ? [] : that.data.allgoodsList;
            allgoodsList.push(...res.data.result.goods.list)
            let moreGoods = res.data.result.goods.list.length <= 0 ? false : true;
            that.setData({
              allgoodsList,
              moreGoods
            })
          } else {
            console.log(res.data.msg)
          }
        }
      }, 'https://5g-center.cnweisou.net')
    },
    getmore() {
      var that = this;
      if (that.data.moreGoods) {
        that.data.page++;
      } else {
        that.data.page = that.data.page;
      }
      that.getallgoods();
    },
    tourl() {
      let vrLink = this.data.pageData.shopinfo.base.vr_link;
      let userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
      if (vrLink) {
        let url = vrLink.split(':')[0];
        if (url.indexOf('s') > -1) {
          if (userInfo) {
            let isJoin = vrLink.indexOf('?') > -1;
            let link;
            if (isJoin) {
              link = encodeURIComponent(`${vrLink}&from='shop'`);
            } else {
              link = encodeURIComponent(`${vrLink}?from='shop'`);
            }
            wx.navigateTo({
              url: '/pages/webviewindex/index?url=' + link,
            })
          } else {
            server.getUserInfo(function() {});
          }
        }
      }
    },
    // 生成随机数
    randomNumBoth(Min, Max) {
      var Range = Max - Min
      var Rand = Math.random()
      var num = Min + Math.round(Rand * Range) //四舍五入
      return num
    },
    handleTab(e) {
      console.log(e)
      this.setData({
        tabindex: e.currentTarget.dataset.cateid,
        page: 1
      })
      this.getallgoods();
    },
    skipStore(e) {
      wx.navigateTo({
        url: '/packageA/pages/store/detail/index?id=' + e.currentTarget.dataset.id
      })
    },
    skipgoodsDetail(e) {
      wx.navigateTo({
        url: '/pages/goods/detail/detail?objectId=' + e.currentTarget.dataset.goodsid,
      })
    },
    toacticle(e) {
      if (e.currentTarget.dataset.from) {
        wx.navigateTo({
          url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id + "&from=" + e.currentTarget.dataset.from
        })
      } else {
        wx.navigateTo({
          url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id
        });
      }

    }
  }
})