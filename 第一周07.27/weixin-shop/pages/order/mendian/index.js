var server = require('../../../utils/server');
var range = 1;
var lat, lng, men;
var page = 1;
Page({
  data: {
    height: Math.ceil(wx.getSystemInfoSync().screenHeight) * 2,
    navindex: 0,
    refresh: false,
    submitData: {},
    data: [],
    storeidGroup: '',
    showIndex: false,
  },
  onLoad: function(ev) {
    var that = this;

    wx.showShareMenu({

    });
    var pages = getCurrentPages()
    if (pages.length == 1) {
      this.setData({
        showIndex: true
      })
    };
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        lat = res.latitude;
        lng = res.longitude;
        that.data.submitData = {
          lat: lat,
          lng: lng,
          site: 0,
          page: 1
        }

        if (ev.men) {
          men = ev.men;
        }
        if (ev.merchid) {
          that.data.submitData.merchid = ev.merchid;
          that.getMendianList(that.data.submitData);
        } else {
          that.data.submitData.merchid = '0';
          that.getMendianList(that.data.submitData);
        }
        if (ev.idGroup) {
          that.setData({
            storeidGroup: ev.idGroup,
            // storeidGroup: ev.id,
          })
          that.getStoreGroupList()
        }

      }
    })
  },
  getMendianList: function(submitdata) {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.shop.list.getshop',
      // url: '?r=wxapp.store.list.getshop',
      data: submitdata,
      method: 'GET',
      success: function(res) {
        var selfList = that.data.data;
        if (res.data.result.length > 0) {
          for (var i in res.data.result) {
            selfList.push(res.data.result[i])
          }
          that.setData({
            refresh: false
          })
        }
        wx.stopPullDownRefresh()
        that.setData({
          data: selfList,
        })
      }
    })
  },
  onShow: () => {
    page = 1;
  },
  onPullDownRefresh: function(e) {
    var that = this;
    that.data.submitData.page = 1;
    that.setData({
      data: [],
      refresh: false
    })
    that.getMendianList(that.data.submitData);
  },
  merch: function(res) {
    if (men == '1') {
      let carrierData = {
        active: '2',
        carrierid: res.currentTarget.id,
        realname: res.currentTarget.dataset.realname,
        mobile: res.currentTarget.dataset.moblie,
        storename: res.currentTarget.dataset.storename,
        address: res.currentTarget.dataset.address
      }
      wx.setStorageSync('carrierData', carrierData)
      wx.navigateBack({
        delta: 1
      })

      // wx.navigateTo({
      //     url: "../ordersubmit/index?active=2&carrierid=" + res.currentTarget.id + "&realname=" + res.currentTarget.dataset.realname + "&mobile=" + res.currentTarget.dataset.moblie + "&storename=" + res.currentTarget.dataset.storename + "&address=" + res.currentTarget.dataset.address //+"&id="+id+"&optionid="+optionid+"&total="+total
      // })
    } else {
      wx.navigateTo({
        url: "/packageA/pages/store/detail/index?active=2&id=" + res.currentTarget.id
      })
    }

  },
  sort: function(e) {
    var that = this;
    that.setData({
      navindex: e.currentTarget.id
    })
    that.setData({
      data: []
    })
    that.data.submitData.page = 1;
    that.data.submitData.sorttype = 1;
    that.data.submitData.range = range;
    that.getMendianList(that.data.submitData);
  },
  down: function(e) {
    var that = this
    that.setData({
      navindex: e.currentTarget.id
    })
  },
  distance: function(e) {
    range = e.target.dataset.index;
    var that = this;
    that.data.submitData.page = 1;
    that.data.submitData.range = e.target.dataset.index;
    that.data.submitData.sorttype ? delete that.data.submitData.sorttype : '';
    that.setData({
      data: [],
      navindex: 0
    })
    that.getMendianList(that.data.submitData);
  },
  formSubmit: function(e) {
    var that = this;
    that.data.submitData.page = 1;
    that.data.submitData.range ? delete that.data.submitData.range : '';
    that.data.submitData.sorttype ? delete that.data.submitData.sorttype : '';
    if (e.detail.value.keyword) {
      that.data.submitData.keyword = e.detail.value.keyword;
    } else {
      that.data.submitData.keyword = e.detail.value;
    }
    that.setData({
      data: []
    })
    that.getMendianList(that.data.submitData);
  },
  list_bd: function() {
    this.setData({
      navindex: 0
    })
  },
  phone: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.index
    })
  },
  addr: function(e) {
    wx.openLocation({
      latitude: parseFloat(e.target.dataset.lat),
      longitude: parseFloat(e.target.dataset.lng),
      name: e.currentTarget.dataset.name,
      scale: 28,
      success: function(res) {},

    })

  },
  onReachBottom: function(e) {
    var that = this;
    if (that.data.refresh) {
      return false;
    }
    that.setData({
      refresh: true
    })
    page = page + 1;
    that.data.submitData.page = that.data.submitData.page + 1;
    that.getMendianList(that.data.submitData);
  },
  getStoreGroupList: function() {
    var that = this
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.groups.goods.getStore',
      data: {
        goodsid: that.data.storeidGroup,
        utoken: utoken,
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          data: res.data.result
        })
        // wx.setStorageSync('groupStoreList', that.data.data)
      }

    })
  },
  retureGroup: function(res) {
    let groupData = {
      active: '2',
      carrierid: res.currentTarget.id,
      realname: res.currentTarget.dataset.realname,
      mobile: res.currentTarget.dataset.moblie,
      storename: res.currentTarget.dataset.storename,
      address: res.currentTarget.dataset.address
    }
    wx.setStorageSync('groupData', groupData)
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: "../../store/detail/index?active=2&id=" + res.currentTarget.id
    // })
  }
})