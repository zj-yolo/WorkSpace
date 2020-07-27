const server = require("../../../utils/server.js");
var utoken = wx.getStorageSync("utoken");
var addr;
Page({
  data: {
    addressList: [],
  },
  onLoad: function(options) {
    let operateType = options.type ? options.type : '';
    this.setData({
      operateType,
    })
    utoken = wx.getStorageSync("utoken");
    if (options.addr != undefined) {
      addr = options.addr;
    }
  },

  changbgc(){
  },
  onShow: function() {
    this.getAddressList();
  },
  add: function() {
    wx.navigateTo({
      url: '../add/add',
    })
  },
  editAddress: function(e) { /*带参数过去*/
    if(this.data.operateType) {
      utoken = wx.getStorageSync("utoken");
      server.sendRequest({
        url: '?r=wxapp.member.address.setdefault',
        data: {
          utoken,
          id: e.currentTarget.dataset.id
        },
        success: function (e) {
          wx.navigateBack({
            delta: 1
          });
        }
      });
    } else {
      wx.navigateTo({
        url: '../add/add?id=' + e.currentTarget.dataset.id,
      });
    }
  },
  deleteAddress: function(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '真的要删除这个地址吗？',
      content: '',
      success: function(res) {
        if (res.cancel) {
          return false;
        }
        server.sendRequest({
          url: '?r=wxapp.member.address.delete',
          data: {
            utoken,
            id: e.currentTarget.dataset.id
          },
          success: function(e) {
            if (e.data.status == 1) {
              let addrID = wx.getStorageSync('addrID');
              if (id == addrID) {
                wx.removeStorageSync('addrID');
              }
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 800,
                success: function() {
                  that.getAddressList();
                }
              });
            }
          }
        });
      }
    });
  },
  toAddress(){
    wx.chooseAddress({
      success (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
        let  utoken = wx.getStorageSync("utoken");
        server.sendRequest({
          url: '?r=wxapp.member.address.submit',
          data: {
            utoken,
            sex: 1,
            province: res.provinceName,
            areas:res.countyName,
            city: res.cityName,
            address:res.detailInfo,
            consignee:res.userName,
            mobile:res.telNumber,
            is_default: 0,
          },
          success: function(e) {
            if (e.data.status == 1) {
              wx.showToast({
                title: '添加成功',
                icon: 'none',
                duration: 2000,
                success: function() {
             
                }
              });
            }
          }
        });


      }
    });
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  getAddressList: function() {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.member.address',
      data: {
        utoken,
      },
      success: function(e) {
        that.setData({
          addressList: e.data.result
        });
      }
    });
  },
  setdefault: function(e) {
    var that = this;
    if (e.currentTarget.dataset.isdefault == 1) {
      return false;
    }
    wx.showModal({
      title: '设当前地址为默认地址？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          server.sendRequest({
            url: '?r=wxapp.member.address.setdefault',
            data: {
              utoken,
              id: e.currentTarget.dataset.id
            },
            success: function(e) {
              if (e.data.status == 1) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 800,
                  success: function() {
                    if (addr != undefined) {
                      wx.navigateBack({
                        delta: 2
                      })
                    } else {
                      that.getAddressList();
                    }
                  }
                });
              }
            }
          });
        } else if (res.cancel) {}
      }
    });
  },
})