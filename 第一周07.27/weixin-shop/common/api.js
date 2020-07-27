const server = require('../utils/server')
//获取直播列表(callback写法)
const loadliveList = (callback) => {
  server.sendRequest({
    url: '?r=wxapp.liveinfo',
    data: {},
    method: 'GET',
    success: res => {
      if (res.data.status == 1) {
        let data = res.data.result.room_info ? res.data.result.room_info : [];
        callback(data)
      }
    }
  })
}
//获取优惠券列表(promise写法)
const loadcouponList = () => {
  return new Promise((resolve, reject) => {
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.getlist',
      data: {
        comefrom: "goodsdetail"
      },
      success: res => {
        if (res.data.status == 1 && res.data.result.list) {
          resolve(res.data.result.list)
        } else {
          reject(res)
        }
      }
    });
  })
}
//领取优惠券
const receiveCoupon = (id) => {
  let utoken = wx.getStorageSync('utoken');
  server.getUserInfo(() => {
    server.sendRequest({
      url: '?r=wxapp.sale.coupon.detail.pay',
      data: {
        utoken,
        id,
        jie: 1
      },
      method: 'GET',
      success: res => {
        if (res.data.status == 1) {
          server.sendRequest({
            url: '?r=wxapp.sale.coupon.detail.payresult',
            data: {
              utoken: utoken,
              logid: res.data.result.logid
            },
            method: 'GET',
            success: function (res) {
              wx.showToast({
                title: '领取成功',
                icon: 'none',
              })
              setTimeout(() => {
                wx.hideToast();
              }, 1500);
            },
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
          setTimeout(() => {
            wx.hideToast();
          }, 1500);
        }
      }
    })
  })
}
//获取分类
const getcateData = (callback) => {
  server.sendRequest({
    url: '?r=wxapp.shop.takingOrder.getCategory',
    data: {},
    method: 'GET',
    success: res => {
      if (res.data.status == 1) {
        let cateList = res.data.result.data.parent;
        callback(cateList)
      }
    }
  })
}
//获取分类商品数据
const getcategoodsList = (objectId, callback) => {
  server.sendRequest({
    url: '?r=wxapp.shop.takingOrder.getCategoryGoodsList',
    data: {
      category_id: objectId,
      page: 1,
    },
    method: 'GET',
    success: res => {
      if (res.data.status == 1) {
        let goodslist = res.data.result.goods;
        callback(goodslist)
      }
    }
  })
}
//获取拼团分类数据
const getgroupCateList = (callback) => {
  server.sendRequest({
    url: '?r=wxapp.groups',
    data: {
      page: 1
    },
    method: 'GET',
    success: res => {
      if (res.data.status == 1) {
        let category = res.data.result.category;
        callback(category)
      }
    }
  })
}
//获取拼团数据
const getgroupList = (categoryId, callback) => {
  server.sendRequest({
    url: '?r=wxapp.groups.category.get_list',
    data: {
      page: 1,
      category: categoryId,
    },
    method: 'GET',
    success: res => {
      if (res.data.status == 1) {
        let grouplist =res.data.result.list;
        callback(grouplist)
      }
    }
  })
}

//跳转直播间
const skipLiveStreaming = (e) => {
  let roomId = e.currentTarget.dataset.roomid; // 房间号
  let customParams = {
    path: 'pages/index/index',
    pid: 1
  }
  wx.navigateTo({
    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
  })
}

module.exports = {
  loadliveList,
  skipLiveStreaming,
  loadcouponList,
  receiveCoupon,
  getcateData,
  getcategoodsList,
  getgroupCateList,
  getgroupList
}