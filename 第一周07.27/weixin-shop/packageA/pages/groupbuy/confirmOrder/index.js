var server = require('../../../../utils/server');
Page({
  data: {
    loading: true,
    height: Math.ceil(wx.getSystemInfoSync().screenHeight),
    nameArr: '',
    priceId: '',
    ggPrice: '',
    currentTab: 0,
    mendiandata: '',
    id: '',
    type: '',
    teamid: '',
    heads: ''
  },
  onLoad: function(res) {
    let utoken = wx.getStorageSync("utoken");
    var that = this;
    if (res.id) {
      that.setData({
        id: res.id,
        type: res.type
      })
    }
    if (res.teamid) {
      that.setData({
        teamid: res.teamid
      })
    }
    if (res.heads) {
      that.setData({
        heads: res.heads
      })
    }
    if (!res.nameArr || res.nameArr == 'undefined') {
      that.setData({
        nameArr: '',
      })
    } else {
      that.setData({
        nameArr: res.nameArr,
      })
    }
    if (res.priceId) {
      that.setData({
        priceId: res.priceId
      })
    }
    if (res.groupPrice) {
      that.setData({
        groupPrice: res.groupPrice
      })
    }
    that.setData({
      type: that.data.type
    })
    that.loadPageData();
    that.getStoreGroupList()
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  loadPageData: function() {
    let utoken = wx.getStorageSync("utoken");
    var that = this;
    if (that.data.teamid) {
      server.sendRequest({
        url: '?r=wxapp.groups.orders.testConfirm',
        showToast: false,
        data: {
          utoken: utoken,
          id: that.data.id,
          type: that.data.type,
          teamid: that.data.teamid,
          optionid: that.data.priceId
        },
        method: 'GET',
        success: function(res) {
          that.setData({
            loading: false
          })
          if (res.data.status < 0) {
            that.setData({
              status: 1,
              msg: res.data.msg
            })
          } else {
            that.setData({
              data: res.data.result,
              ggPrice: res.data.result.price,
              headsmoney: parseFloat(res.data.result.goods.headsmoney).toFixed(2),
              ggPriceAndHead: (parseFloat(res.data.result.price) + parseFloat(res.data.result.goods.headsmoney)).toFixed(2)
            })
            if (that.data.data.goods.singleprice) {
              var total = parseFloat(that.data.ggPrice) + parseFloat(that.data.data.goods.freight)
            }
            that.setData({
              total: total
            })
            if (res.data.result.address != "") {
              that.setData({
                address: res.data.result.address,
                aid: res.data.result.address.id
              })
            }
          }
        }
      })
    } else if (that.data.heads) {
      server.sendRequest({
        url: '?r=wxapp.groups.orders.testConfirm',
        showToast: false,
        data: {
          utoken: utoken,
          id: that.data.id,
          heads: 1,
          type: that.data.type,
          optionid: that.data.priceId
        },
        method: 'GET',
        success: function(res) {
          console.log(222, res.data)
          if (res.data.result == 'error') {
            wx.showModal({
              content: res.data.msg,
              success: function(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../../groupbuy/index/index'
                  })
                } else if (res.cancel) {
                  wx.redirectTo({
                    url: '../../groupbuy/index/index'
                  })
                }
              }
            })
          }
          that.setData({
            loading: false
          })
          if (res.data.status < 0) {
            that.setData({
              status: 1,
              msg: res.data.msg
            })
          } else {
            that.setData({
              data: res.data.result,
              ggPrice: res.data.result.price,
              headsmoney: parseFloat(res.data.result.goods.headsmoney).toFixed(2),
              ggPriceAndHead: (parseFloat(res.data.result.price) + parseFloat(res.data.result.goods.headsmoney)).toFixed(2)
            })
            if (that.data.data.goods.singleprice) {
              var total = parseFloat(that.data.ggPrice) + parseFloat(that.data.data.goods.freight)
            }
            that.setData({
              total: total
            })
            if (res.data.result.address != "" && res.data.result.address != null) {
              that.setData({
                address: res.data.result.address,
                aid: res.data.result.address.id
              })
            }
          }

        }

      })
    } else {
      server.sendRequest({
        url: '?r=wxapp.groups.orders.testConfirm',
        data: {
          utoken: utoken,
          id: that.data.id,
          type: that.data.type,
          optionid: that.data.priceId
        },
        showToast: false,
        method: 'GET',
        success: function(res) {
          that.setData({
            loading: false
          })
          if (res.data.status < 0) {
            that.setData({
              status: 1,
              msg: res.data.msg
            })
          } else {
            that.setData({
              data: res.data.result,
              ggPrice: res.data.result.price,
              headsmoney: parseFloat(res.data.result.goods.headsmoney).toFixed(2),
              ggPriceAndHead: (parseFloat(res.data.result.price) + parseFloat(res.data.result.goods.headsmoney)).toFixed(2)
            })
            if (that.data.ggPrice) {
              var total = parseFloat(that.data.ggPrice) + parseFloat(that.data.data.goods.freight)
            }
            that.setData({
              total: total
            })
            if (res.data.result.address != "") {
              that.setData({
                address: res.data.result.address,
                aid: res.data.result.address.id
              })
            }
          }
        }
      })
    }
  },
  toStart: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onShow: function() {
    var that = this;
    if (wx.getStorageSync('addrdata')) {
      let addrdata = wx.getStorageSync('addrdata');
      let address = {
        realname: addrdata.addressInfo.realname,
        province: addrdata.addressInfo.province,
        city: addrdata.addressInfo.city,
        area: addrdata.addressInfo.area,
        mobile: addrdata.addressInfo.mobile,
      }
      var aid = addrdata.id
      that.setData({
        address,
        aid
      })
      wx.removeStorageSync('addrdata');
    }
    if (wx.getStorageSync('groupData')) {
      let addrdata = wx.getStorageSync('groupData');
      that.setData({
        addrdata
      })
      wx.removeStorageSync('groupData');
    }

  },
  bindFormSubmit: function(res) {
    var that = this;
    let utoken = wx.getStorageSync("utoken");
    if (that.data.address == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入地址！',
        showCancel: false
      })
      return;
    }
    server.getUserInfo(function() {
      if (that.data.heads != 'undefined') {
        server.sendRequest({
          url: '?r=wxapp.groups.orders.testConfirm',
          data: {
            utoken: utoken,
            id: that.data.id,
            aid: that.data.aid,
            message: res.detail.value.prompt,
            type: that.data.type,
            heads: that.data.heads,
            teamid: that.data.teamid,
            optionid: that.data.priceId,
          },
          method: 'POST',
          success: function(res) {
            if (res.data.status < 0) {
              wx.showToast({
                title: '失败',
                duration: 2000
              })
            } else {
              wx.reLaunch({
                url: "../cashier/index?orderid=" + res.data.result.orderid + "&teamid=" + that.data.teamid
              })
            }
          }

        })
      } else {
        server.sendRequest({
          url: '?r=wxapp.groups.orders.testConfirm',
          data: {
            utoken: utoken,
            id: that.data.id,
            aid: that.data.aid,
            message: res.detail.value.prompt,
            type: that.data.type,
            teamid: that.data.teamid,
            optionid: that.data.priceId,
          },
          method: 'POST',
          success: function(res) {
            if (res.data.status < 0) {
              wx.showToast({
                title: '失败',
                duration: 2000
              })
            } else {
              wx.reLaunch({
                url: "../cashier/index?orderid=" + res.data.result.orderid + "&teamid=" + that.data.teamid
              })
            }
          }
        })
      }
    })
  },
  bindFormSubmitForZT: function(res) {
    var that = this;
    let utoken = wx.getStorageSync("utoken");
    server.getUserInfo(function() {
      if (that.data.mendiandata && that.data.mendiandata != '') {
        if (!res.detail.value.person && !res.detail.value.phone) {
          wx.showToast({
            title: '姓名或电话为空',
            icon: 'loading',
            duration: 2000
          })
        } else if (!that.data.addrdata) {
          wx.showToast({
            title: '请选择门店',
            icon: 'loading',
            duration: 2000
          })
        } else {
          if (that.data.heads != 'undefined') {
            server.sendRequest({
              url: '?r=wxapp.groups.orders.testConfirm',
              data: {
                utoken: utoken,
                id: that.data.id,
                aid: that.data.addrdata.carrierid,
                message: res.detail.value.prompt,
                type: that.data.type,
                heads: that.data.heads,
                teamid: that.data.teamid,
                optionid: that.data.priceId,
                realname: res.detail.value.person,
                mobile: res.detail.value.phone,
                storeid: that.data.addrdata.carrierid
              },
              method: 'POST',
              success: function(res) {
                if (res.data.status < 0) {
                  wx.showToast({
                    title: '失败',
                    duration: 2000
                  })
                } else {
                  wx.reLaunch({
                    url: "../cashier/index?orderid=" + res.data.result.orderid + "&teamid=" + that.data.teamid
                  })
                }
              }

            })
          } else {
            server.sendRequest({
              url: '?r=wxapp.groups.orders.testConfirm',
              data: {
                utoken: utoken,
                id: that.data.id,
                aid: that.data.addrdata.carrierid,
                message: res.detail.value.prompt,
                type: that.data.type,
                teamid: that.data.teamid,
                optionid: that.data.priceId,
                realname: res.detail.value.person,
                mobile: res.detail.value.phone,
                storeid: that.data.addrdata.carrierid
              },
              method: 'POST',
              success: function(res) {
                if (res.data.status < 0) {
                  wx.showToast({
                    title: '失败',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  wx.reLaunch({
                    url: "../cashier/index?orderid=" + res.data.result.orderid + "&teamid=" + that.data.teamid
                  })
                }
              }
            })
          }
        }
      } else {
        wx.showToast({
          title: '暂不支持自提',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  //获取门店是否有
  getStoreGroupList: function() {
    var that = this
    let utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=wxapp.groups.goods.getStore',
      data: {
        goodsid: that.data.id,
        utoken: utoken,
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          mendiandata: res.data.result
        })
      }
    })
  },
  //点击收货地址
  addressSelect: function() {
    wx.navigateTo({
      url: '/pages/address/select/index?addr=addr'
    });
  },
  todetail: function() {
    wx.reLaunch({
      url: '/packMember/pages/member/allTool/groupbuy/index?id=1'

    })
  },
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

  },
  storeListSelect: function(e) {
    var that = this
    wx.navigateTo({
      url: '/pages/order/mendian/index?idGroup=' + that.data.id,
    })
  }
})