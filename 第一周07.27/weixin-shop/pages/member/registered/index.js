var server = require('../../../utils/server');
var app = getApp();
var utoken;
let arr = [];
let image_arr;
Page({
  data: {
    res: '',
    msg: '申请店铺成功',
    submit: "提交成功",
    checkbox: 1,
    arr: {},
    merchname: "",
    salecate: "",
    desc: "",
    realname: "",
    mobile: "",
    uname: "",
    upass: "",
    address: '',
    id: "",
    utoken: '',
    xieyi: 1,
    images: []
  },
  onLoad: function () {
    utoken = wx.getStorageSync("utoken");
  },
  onShow: function () {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    that.getRegidter()
    image_arr = '';
  },
  getRegidter: function () {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.shop.register',
      data: {
        utoken: utoken
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          data: res.data
        });
        if (res.data.result.license) {
          that.data.images.push(res.data.result.license);
          that.setData({
            images: that.data.images
          })
        }
        that.data.id = res.data.merchid;
        if (res.data.msg == '') {
          res.data.msg = that.data.msg
        } else {
          res.data.msg = res.data.msg
        }
      }
    })
  },
  loadPageData: function () {
    var that = this;
    server.sendRequest({
      url: '?r=wxapp.shop.register',
      method: 'POST',
      data: {
        merchname: that.data.merchname,
        salecate: that.data.salecate,
        desc: that.data.desc,
        realname: that.data.realname,
        mobile: that.data.mobile,
        uname: that.data.uname,
        upass: that.data.upass,
        address: that.data.address,
        utoken: utoken,
        license: image_arr
      },
      success: function (e) {
        wx.showModal({
          title: '消息',
          content: e.data.msg,
          confirmColor:'#FFA500',
          showCancel: false,
          success: function () {
            wx.switchTab({
              url: "../index/index"
            })
          }
        })
      }
    })
  },
  xieyi: function () {
    var that = this;
    if (that.data.data.result.applycontent) {
      that.setData({
        xieyi: 2
      })
    }
  },
  tijiao: function () {
    var that = this;
    if (that.data.data.result.applycontent) {
      that.setData({
        xieyi: 1
      })
    }
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  formSubmit: function (e) {
    var that = this;
    server.getUserInfo(function () {
      if (!e.detail.value.merchname) {
        wx.showModal({
          title: '消息',
          content: '商户名称不能为空',
          showCancel: false
        })
        return;
      }
      if (!e.detail.value.salecate) {
        wx.showModal({
          title: '消息',
          content: '项目名称不能为空',
          showCancel: false
        })
        return;
      }
      if (!e.detail.value.realname) {
        wx.showModal({
          title: '消息',
          content: '联系人不能为空',
          showCancel: false
        })
        return;
      }
      if (!(/^1[34578]\d{9}$/.test(e.detail.value.mobile))) {
        wx.showModal({
          title: '消息',
          content: '联系电话错误',
          showCancel: false
        })
        e.detail.value.mobile = '';
        return;
      }
      if (!e.detail.value.uname) {
        wx.showModal({
          title: '消息',
          content: '账号不能为空',
          showCancel: false
        })
        return;
      }
      if (!e.detail.value.upass) {
        wx.showModal({
          title: '消息',
          content: '密码不能为空',
          showCancel: false
        })
        return;
      }
      if (!e.detail.value.address) {
        wx.showModal({
          title: '消息',
          content: '地址不能为空',
          showCancel: false
        })
        return;
      }

      that.setData({
        merchname: e.detail.value.merchname,
        salecate: e.detail.value.salecate,
        desc: e.detail.value.desc,
        realname: e.detail.value.realname,
        mobile: e.detail.value.mobile,
        uname: e.detail.value.uname,
        upass: e.detail.value.upass,
        address: e.detail.value.address,
      })
      if (that.data.checkbox == 1) {
        that.loadPageData();
      } else {
        wx.showModal({
          title: '消息',
          content: '请阅读注册协议内容',
          showCancel: false
        })
      }
    });
  },
  checked: function (e) {
    this.data.checkbox = e.detail.value.length;
  },
  // 选择图片
  chooseImage: function (res) {
    var that = this;
    if (res.target.id) {
      var index = res.target.id
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://tws.cnweisou.com/wxapi/index.php?r=wxapp.util.uploader',
          filePath: tempFilePaths[0],
          name: 'file',
          method: 'POST',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            var x = res.data;
            var dataObj = JSON.parse(x);
            image_arr = dataObj.url;
          }
        })
        that.setData({
          images: tempFilePaths,
        })
      },
    })
  },
  delete: function (e) {
    var that = this;
    image_arr = '';
    console.log(image_arr);
    that.setData({
      images: '',
    })
  },
  previewImage: function (res) {
    var that = this;
    wx.previewImage({
      urls: that.data.images
    })
  },
})