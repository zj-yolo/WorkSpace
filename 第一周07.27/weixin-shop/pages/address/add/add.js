const server = require("../../../utils/server.js");
const datas = require('../../../utils/area.js')
var utoken = wx.getStorageSync("utoken");
var addr;
Page({
  data: {
    operationType: 0,
    region: ['北京市', '北京市', ''],
    /*操作类型，0代表新增，1代表修改*/
    addressInfo: {
      sex: 1,
      address: "",
      realname: "",
      mobile: "",
      city: "",
      province: "",
      areas: "",
      id: "",
      isdefault: 0
    },
    inputValue: "",
    multiIndex: [0, 0, 0],
    multiArray: [
      [],
      [],
      []
    ],
    datas: datas.address
  },
  onLoad: function(options) {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    if (options.addr != undefined) {
      addr = options.addr;
    }
    if (options.id != undefined && options.id != "") {
      var operationType = 1;
      var addressInfo = that.data.addressInfo;
      server.sendRequest({
        url: '?r=wxapp.member.address.post',
        data: {
          utoken,
          id: options.id
        },
        success: function(e) {
          var data = e.data.result;
          addressInfo.id = data.id;
          addressInfo.sex = data.sex;
          addressInfo.realname = data.realname;
          addressInfo.address = data.address;
          addressInfo.province = data.province;
          addressInfo.areas = data.area;
          addressInfo.city = data.city;
          addressInfo.mobile = data.mobile;
          addressInfo.isdefault = data.isdefault;
          that.setData({
            addressInfo,
            operationType
          });
        }
      });
    }
  },
  onShow() {
    let arr1 = [],
      arr2 = [],
      arr3 = [];
    let i1 = 0,
      i2 = 0;
    for (let x in this.data.datas.address.province) {
      arr1.push(this.data.datas.address.province[x].name);
    }
    for (let x in this.data.datas.address.province[i1].city) {
      arr2.push(this.data.datas.address.province[i1].city[x].name)
    }
    for (let x in this.data.datas.address.province[i1].city[i2].county) {
      arr3.push(this.data.datas.address.province[i1].city[i2].county[x].name)
    }
    let multiArray = this.data.multiArray;
    multiArray[0] = arr1
    multiArray[1] = arr2
    multiArray[2] = arr3
    this.setData({
      multiArray: multiArray
    })
  },
  checkSex: function(e) {
    var addressInfo = this.data.addressInfo;
    addressInfo.sex = e.currentTarget.dataset.sex;
    this.setData({
      addressInfo
    });
  },
  isdefault: function() {
    let addressInfo = this.data.addressInfo;
    if (addressInfo.isdefault == 0) {
      addressInfo.isdefault = 1
    } else {
      addressInfo.isdefault = 0
    }
    this.setData({
      addressInfo
    })
  },
  searchAddress: function() {
    var that = this;
    var addressInfo = that.data.addressInfo;
    wx.chooseLocation({
      success: function(res) {
        addressInfo.address = res.address;
        addressInfo.addressTitle = res.name;
        that.setData({
          addressInfo
        });
      },
    })
  },
  setInputValue: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
    this.search(e);
  },
  clearInput: function() {
    this.setData({
      inputValue: ""
    });
  },
  searchBtn: function() {
    if (this.data.inputValue == "") {
      this.setData({
        search: 0
      });
    } else { /* 搜索*/
      var e = {
        detail: {
          value: this.data.inputValue
        }
      };
      this.search(e);
    }
  },
  inputName: function(e) {
    var that = this;
    var addressInfo = that.data.addressInfo;
    addressInfo.realname = e.detail.value;
    that.setData({
      addressInfo
    });
  },
  inputMobile: function(e) {
    var that = this;
    var addressInfo = that.data.addressInfo;
    addressInfo.mobile = e.detail.value;
    that.setData({
      addressInfo
    });
  },
  inputDoorplate: function(e) {
    var that = this;
    var addressInfo = that.data.addressInfo;
    addressInfo.address = e.detail.value;
    that.setData({
      addressInfo
    });
  },
  saveAddress: function() {
    var that = this;
    var addressInfo = this.data.addressInfo;
    if (addressInfo.realname == "") {
      wx.showModal({
        title: '请填写真实姓名',
        content: '',
        showCancel: false
      });
      return false;
    }
    if (!(/^1[345789]\d{9}$/.test(addressInfo.mobile))) {
      wx.showModal({
        title: '请填写正确手机号码',
        content: '',
        showCancel: false
      });
      return false;
    }
    if (addressInfo.city == "") {
      wx.showModal({
        title: '请选择城市',
        content: '',
        showCancel: false
      });
      return false;
    }
    if (addressInfo.address == "") {
      wx.showModal({
        title: '请填写详细地址',
        content: '',
        showCancel: false
      });
      return false;
    }
    if (addr != undefined) { /* 新增*/
      server.sendRequest({
        url: '?r=wxapp.member.address.submit',
        data: {
          utoken,
          sex: addressInfo.sex,
          province: addressInfo.province,
          areas: addressInfo.areas,
          city: addressInfo.city,
          address: addressInfo.address,
          consignee: addressInfo.realname,
          mobile: addressInfo.mobile,
          is_default: addressInfo.isdefault,
        },
        success: function(e) {
          if (e.data.status == 1) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 800,
              success: function() {
                wx.navigateTo({
                  url: '../list/list?addr=addr'
                });
              }
            });
          }
        }
      });
    } /* 新增*/
    else if (this.data.operationType == 0) {
      server.sendRequest({
        url: '?r=wxapp.member.address.submit',
        data: {
          utoken,
          sex: addressInfo.sex,
          province: addressInfo.province,
          areas: addressInfo.areas,
          city: addressInfo.city,
          address: addressInfo.address,
          consignee: addressInfo.realname,
          mobile: addressInfo.mobile,
          is_default: addressInfo.isdefault,
        },
        success: function(e) {
          if (e.data.status == 1) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 800,
              success: function() {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          }
        }
      });
    } /* 修改 */
    else if (this.data.operationType == 1) {
      server.sendRequest({
        url: '?r=wxapp.member.address.submit',
        data: {
          utoken,
          sex: addressInfo.sex,
          address: addressInfo.address,
          consignee: addressInfo.realname,
          mobile: addressInfo.mobile,
          province: addressInfo.province,
          areas: addressInfo.areas,
          city: addressInfo.city,
          is_default: addressInfo.isdefault,
          id: addressInfo.id
        },
        success: function(e) {
          if (e.data.status == 1) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 800,
              success: function() {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '错误',
        content: '操作异常',
        showCancel: false
      })
    }
  },
  bindRegionChange: function(e) {
    var that = this;
    var value = e.detail.value;
    var addressInfo = that.data.addressInfo;
    addressInfo.areas = value[2];
    addressInfo.city = value[1];
    addressInfo.province = value[0];
    that.setData({
      addressInfo
    });
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为11', e.detail.column, '，值为', e.detail.value)

    let column = e.detail.column;
    let value = e.detail.value;
    let multiIndex = this.data.multiIndex;
    multiIndex[column] = value;
    let arr1 = [],
      arr2 = [],
      arr3 = [];
    let multiArray = this.data.multiArray;
    let key1, key2, key3;
    key1 = multiIndex[0];
    key2 = multiIndex[1];
    key3 = multiIndex[2];
    for (let x in this.data.datas.address.province) {
      arr1.push(this.data.datas.address.province[x].name);
    }
    for (let x in this.data.datas.address.province[key1].city) {
      arr2.push(this.data.datas.address.province[key1].city[x].name)
    }
    for (let x in this.data.datas.address.province[key1].city[key2].county) {
      if (this.data.datas.address.province[key1].city[key2].county[x].name) {
        arr3.push(this.data.datas.address.province[key1].city[key2].county[x].name)
      } else {
        arr3.push(' ')
      }
    }
    multiArray[0] = arr1
    multiArray[1] = arr2
    multiArray[2] = arr3


    this.setData({
      multiArray: multiArray,
      multiIndex: multiIndex
    })
    var that = this;
    // var value = e.detail.value;


    var addressInfo = that.data.addressInfo;
    addressInfo.areas = multiArray[2][key3];
    addressInfo.city = multiArray[1][key2];
    addressInfo.province = multiArray[0][key1];
    that.setData({
      addressInfo
    });
  },

})