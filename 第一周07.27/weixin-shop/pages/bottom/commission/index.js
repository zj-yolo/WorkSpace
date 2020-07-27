var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var app = getApp();
Page({
  data: {
    loading: true,
    disabled: false,
    distributor: '成为分销商'
  },
  onLoad: function() {
    var that = this;
    server.getUserInfo();
    that.getInfo();
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  getInfo: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    server.sendRequest({
      method: 'GET',
      url: '?r=wxapp.commission.register&utoken=' + utoken,
      showToast: false,
      data: {},
      success: function(res) {
        if (res.data.result && typeof(res.data.result.length) == 'undefined') {
          if (res.data.result.set) {
            let become = res.data.result.set.become;
            that.setData({
              become ,
              set: res.data.result.set
            })
            if (res.data.result.member.isagent == 1 && res.data.result.member.status != 1) {
              that.setData({
                distributor: '商家申请中',
                disabled: true
              })
            } else {
              that.setData({
                disabled: false
              })
            }
            if (res.data.result.member.isagent == 1 && res.data.result.member.status == 1) {
              that.setData({
                isdistributor: true,
                become: 5
              })
              server.sendRequest({
                url: '?r=wxapp.commission.index&utoken=' + utoken,
                data: {},
                showToast: false,
                success: function(res) {
                  var data = res.data.result.member;
                  that.setData({
                    data: data,
                    sets: res.data.result.set.commission.texts,
                  })
                  var shop = res.data.result.member.nickname;


                  if (res.data.result.member.aagentlevel == null) {
                    var rank = '默认等级';
                  } else {
                    var rank = res.data.result.member.aagentlevel;
                  }

                  that.setData({
                    shop: shop,
                    rank: rank
                  })
                  if (data.agentid == 0) {
                    var person = "总店";
                    that.setData({
                      person: person
                    })
                  } else {
                    var person = res.data.result.member.person;
                    that.setData({
                      person: person
                    })
                  }
                }
              })
            }
          }
        } else {
          that.setData({
            isdistributor: true,
            become: 5
          })
          server.sendRequest({
            url: '?r=wxapp.commission.index&utoken=' + utoken,
            data: {},
            showToast: false,
            success: function(res) {
              var data = res.data.result.member;
              that.setData({
                data: data,
                sets: res.data.result.set.commission.texts,
              })
              var shop = res.data.result.member.nickname;


              if (res.data.result.member.aagentlevel == null) {
                var rank = '默认等级';
              } else {
                var rank = res.data.result.member.aagentlevel;
              }

              that.setData({
                shop: shop,
                rank: rank
              })
              if (data.agentid == 0) {
                var person = "总店";
                that.setData({
                  person: person
                })
              } else {
                var person = res.data.result.member.person;
                that.setData({
                  person: person
                })
              }
            }
          })
        }
        that.setData({
          loading: false
        });
      }

    })
  },
  toindex: function() {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  toAgreement: function() {
    wx.navigateTo({
      url: "/packageA/pages/commission/agreement/agreement"
    })
  },
  joingoodDetail: function() {
    var that = this;
    wx.navigateTo({
      url: "/pages/goods/detail/detail?objectId=" + that.data.set.goods.id
    })
  },



  formSubmit: function(e) {
    this.setData({
      realname: e.detail.value.name,
      mobile: e.detail.value.phone,
      weixin: e.detail.value.weChat

    })
  },
  submitClick: function(e) {
    var that = this;
    server.getUserInfo(function() {
      if (!that.data.realname) {
        wx.showModal({
          title: '消息',
          content: '姓名不能为空',
          showCancel: false,
          confirmColor: '#FF6A6A'
        })
        return;
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(that.data.mobile))) {
        wx.showModal({
          title: '消息',
          content: '请填写正确的手机号',
          showCancel: false,
          confirmColor: '#FF6A6A'
        })
        return;
      }
      if (!that.data.weixin) {
        wx.showModal({
          title: '消息',
          content: '微信号不能为空',
          showCancel: false,
          confirmColor: '#FF6A6A'
        })
        return;
      }
      var utoken = wx.getStorageSync("utoken");
      server.sendRequest({
        url: '?r=wxapp.commission.register&utoken=' + utoken,
        data: {
          realname: that.data.realname,
          mobile: that.data.mobile,
          weixin: that.data.weixin
        },
        method: 'POST',
        success: function(res) {
          if (res.data.status == 1) {
            if (res.data.result.member.isagent == 1 && res.data.result.member.status != 1) {
              that.setData({
                disabled: true
              })
            }
            if (res.data.result.isagent == 1 && res.data.result.member.status == 1) {
              that.setData({
                isdistributor: true,
                become: 5
              })
              server.sendRequest({
                url: '?r=wxapp.commission.index&utoken=' + utoken,
                data: {},
                showToast: false,
                success: function(res) {
                  var data = res.data.result.member;
                  that.setData({
                    data: data,
                    sets: res.data.result.set.commission.texts,
                  })
                  var shop = res.data.result.member.nickname;


                  if (res.data.result.member.aagentlevel == null) {
                    var rank = '默认等级';
                  } else {
                    var rank = res.data.result.member.aagentlevel;
                  }

                  that.setData({
                    shop: shop,
                    rank: rank
                  })
                  if (data.agentid == 0) {
                    var person = "总店";
                    that.setData({
                      person: person
                    })
                  } else {
                    var person = res.data.result.member.person;
                    that.setData({
                      person: person
                    })
                  }
                }
              })
            }
            wx.showToast({
              title: '商家注册成功',
              icon: 'success',
              duration: 3000
            })
            that.setData({
              realname: that.data.realname,
              mobile: that.data.mobile,
              weixin: that.data.weixin,
              distributor: '商家申请中'
            })
          }
        }
      })
    })
  },
  distribution: function() {
    wx.navigateTo({
      url: '/packageA/pages/commission/distributionPrice/distributionPrice',
    })
  },
  Withdraw: function() {
    wx.navigateTo({
      url: '/packageA/pages/commission/distributionPrice/distributionPrice',
    })
  },
  order: function() {
    wx.navigateTo({
      url: '/packageA/pages/commission/orderForm/orderForm',
    })
  },
  Withdraw: function() {
    wx.navigateTo({
      url: '/packageA/pages/commission/Withdraw/Withdraw',
    })
  },
  team: function() {
    wx.navigateTo({
      url: '/packageA/pages/commission/team/team',
    })
  },
  QRcode: function() {
    var that = this;
    wx.navigateTo({
      url: '/packageA/pages/commission/QRcode/QRcode?mid=' + that.data.data.id,
    })
  },
  QStroe: function() {
    var that = this;
    wx.navigateTo({
      url: "/packageA/pages/commission/shopStore/index?mid=" + that.data.data.id
    })
  }
})