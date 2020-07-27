// pages/chat/index.js
var server = require("../../utils/server.js");
var cacheChatLogs = require("../../utils/cacheChatLogs.js");
var utoken = wx.getStorageSync('utoken');
var userInfo = server.globalData.userInfo;
let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
let uniacid = extConfig.uniacid;
//拿到socket连接对象
var socket = null;
var app = getApp();
let merchid;

let openid;
let count = 1;

Page({
  data: {
    nomore: false,
    emjoy: [{
        'src': '88_thumb.gif',
        'content': '/88',
        'value': '/:bye'
      },
      {
        'src': 'angrya_thumb.gif',
        'content': '/angry',
        'value': '/::@'
      },
      {
        'src': 'bba_thumb.gif',
        'content': '/bba',
        'value': '/:,@-D'
      },
      {
        'src': 'bs_thumb.gif',
        'content': '/bs',
        'value': '/::('
      },
      {
        'src': 'bs2_thumb.gif',
        'content': '/bs2',
        'value': '/:>-|'
      },
      {
        'src': 'bz_thumb.gif',
        'content': '/bz',
        'value': '/::X'
      },
      {
        'src': 'cj_thumb.gif',
        'content': '/cj',
        'value': '/::O'
      },
      {
        'src': 'cool_thumb.gif',
        'content': '/cool',
        'value': '/::+'
      },
      {
        'src': 'crazya_thumb.gif',
        'content': '/razya',
        'value': '/::Q'
      },
      {
        'src': 'cry.gif',
        'content': '/cry',
        'value': '/:,@!'
      },
      {
        'src': 'cza_thumb.gif',
        'content': '/cza',
        'value': '/::g'
      },
      {
        'src': 'dizzya_thumb.gif',
        'content': '/dizzya',
        'value': '/:,@@'
      },
      {
        'src': 'gza_thumb.gif',
        'content': '/gza',
        'value': '/:handclap'
      },
      {
        'src': 'h_thumb.gif',
        'content': '/cj',
        'value': '/::L'
      },
      {
        'src': 'haqianv2_thumb.gif',
        'content': '/haqianv2',
        'value': '/::-O'
      },
      {
        'src': 'heia_thumb.gif',
        'content': '/heia',
        'value': '/:,@P'
      },
      {
        'src': 'huanglianse_thumb.gif',
        'content': '/huanglianse',
        'value': '/::B'
      },
      {
        'src': 'huanglianwx_thumb.gif',
        'content': '/huanglianwx',
        'value': '/::)'
      },
      {
        'src': 'kl_thumb.gif',
        'content': '/kl',
        'value': '/:8*'
      },
      {
        'src': 'landeln_thumb.gif',
        'content': '/landeln',
        'value': '/:,@o'
      },
      {
        'src': 'laugh.gif',
        'content': '/laugh',
        'value': '/::>'
      },
      {
        'src': 'mb_thumb.gif',
        'content': '/mb',
        'value': '/:,@-D'
      },
      {
        'src': 'moren_feijie_thumb.png',
        'content': '/feijie',
        'value': '/:?'
      },
      {
        'src': 'pcmoren_huaixiao_thumb.png',
        'content': '/huaixiao',
        'value': '/:B-)'
      },
      {
        'src': 'qq_thumb.gif',
        'content': '/qq',
        'value': '/::*'
      },
      {
        'src': 'sada_thumb.gif',
        'content': '/sada',
        'value': '/::<'
      },
      {
        'src': 'sb_thumb.gif',
        'content': '/sbs',
        'value': '/::T'
      },
      {
        'src': 'shamea_thumb.gif',
        'content': '/shamea',
        'value': '/::$'
      },
      {
        'src': 'sw_thumb.gif',
        'content': '/sw',
        'value': '/::('
      },
      {
        'src': 'sweata_thumb.gif',
        'content': '/sweata',
        'value': '/:wipe'
      },
      {
        'src': 't_thumb.gif',
        'content': '/t',
        'value': '/::T'
      },
      {
        'src': 'tootha_thumb.gif',
        'content': '/tootha',
        'value': '/::D'
      },
      {
        'src': 'tza_thumb.gif',
        'content': '/tza',
        'value': '/:,@-D'
      },
      {
        'src': 'wabi_thumb.gif',
        'content': '/wabi',
        'value': '/:dig'
      },
      {
        'src': 'wq_thumb.gif',
        'content': '/wq',
        'value': '/:P-('
      },
      {
        'src': 'x_thumb.gif',
        'content': '/x',
        'value': '/:,@x'
      },
      {
        'src': 'yhh_thumb.gif',
        'content': '/yhh',
        'value': '/:@>'
      },
      {
        'src': 'yw_thumb.gif',
        'content': '/yw',
        'value': '/:?'
      },
      {
        'src': 'yx_thumb.gif',
        'content': '/yx',
        'value': '/:X-)'
      },
      {
        'src': 'zhh_thumb.gif',
        'content': '/zhh',
        'value': '/:<@'
      },
      {
        'src': 'zy_thumb.gif',
        'content': '/zy',
        'value': '/::P'
      }
    ],
    // emjoy: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91],
    showEmjoy: false,
    inputValue: "",
    chatlog: [],
    selfInfo: {
      nickname: "",
      id: "",
      avatar: ""
    },
    toUserInfo: {
      nickname: "",
      id: "",
      avatar: ""
    },
    images: [],
    scrolltop: 0,
    page: 1
  },
  onShow() {
    // 1551252643
    // 1551252669448
  },
  onLoad: function(options) {
    var that = this;
    let data = parseInt(new Date().getTime() / 1000);
    this.setData({
      TIME: data
    })
    count = 1;

    // console.log(data);
    // console.log(111);
    openid = '';
    // storeid 店铺id
    // logo    店铺logo
    // name    店铺name
    this.setData({
      logo: options.logo,
      name: options.name
    })
    merchid = options.storeid;

    //拿到websocket对象
    socket = app.globalData.socket;


    // 拿到utoken
    utoken = wx.getStorageSync('utoken');

    // 拿到用户详情
    userInfo = wx.getStorageSync('userInfo');


    var selfInfo = that.data.selfInfo;
    var toUserInfo = that.data.toUserInfo;

    // 用户
    selfInfo.id = userInfo.id;
    selfInfo.nickname = userInfo.nickname;
    selfInfo.avatar = userInfo.avatar;

    extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};

    uniacid = extConfig.uniacid;


    // 获取消息发送目对象的id；

    // if (options.uid == undefined || options.uid == "") {
    //     wx.showModal({
    //         title: '错误',
    //         content: '未找到聊天对象',
    //         showCancel: false,
    //         success: function(res) {
    //             wx.navigateBack({
    //                 delta: 1
    //             });
    //         }
    //     });
    //     return false;
    // } else if (options.uid == selfInfo.id) {
    //     wx.showModal({
    //         title: '错误',
    //         content: '不能和自己聊天',
    //         showCancel: false,
    //         success: function(res) {
    //             wx.navigateBack({
    //                 delta: 1
    //             })
    //         }
    //     });
    //     return false;
    // }
    //拉取本地聊天记录 
    var chatlog = cacheChatLogs.getLogs(options.storeid) || [];

    //保存用户信息
    //         // storeid 店铺id
    // logo    店铺logo
    // name    店铺name
    toUserInfo.id = options.storeid;
    toUserInfo.nickname = options.name;
    toUserInfo.avatar = options.logo;
    that.setData({
      toUserInfo,
      selfInfo,
      chatlog
    });
    wx.setNavigationBarTitle({
      title: toUserInfo.nickname,
    });
    //socket连接打开后的进行登录操作
    // that.login();
    // that.getMoreChat();
    socket.connect();
    socket.onOpen(function() {
      that.login();
      socket.socketType();

    });
    socket.onMessage(function(message) {
      // 用户
      if (message.FromUserName == openid) {
        //我发给别人的信息
        // 将信息保存到日志里
        chatlog = that.data.chatlog;
        chatlog.push(message);
        cacheChatLogs.save(that.data.toUserInfo.id, message);
        that.setData({
          chatlog,
          inputValue: "",
        });
        that.scroll();
      }
      //店铺
      else if (message.ToUserName == openid) {
        // 别人发来的信息
        chatlog = that.data.chatlog;
        chatlog.push(message);
        cacheChatLogs.save(that.data.toUserInfo.id, message);
        that.readmessage(message.msgid, message.fromUser, message.toUser);
        that.setData({
          chatlog,
        });
        that.scroll();
      }
      // 获取openid
      else if (message.openid) {
        openid = message.openid
        that.setData({
          openid: openid
        })
        that.scroll();
      }

    });
  },

  onReady: function() {
    this.scroll();
  },
  showOrCloseEmjoy: function() {
    var that = this;
    this.setData({
      showEmjoy: !that.data.showEmjoy
    })
  },
  inputData: function(res) {
    var that = this;
    that.setData({
      inputValue: res.detail.value
    })
  },
  inputEmjoy: function(res) {
    var that = this;
    var emjoy = "";
    //  "[$" +
    emjoy = res.currentTarget.dataset.emjoy //+ "$]"
    var inputValue = that.data.inputValue + emjoy;
    that.setData({
      inputValue
    })
  },
  // 发送消息
  sendMessage: function() {
    var that = this;
    var time = Date.parse(new Date());
    var chatlog = that.data.chatlog;
    utoken = wx.getStorageSync('utoken');
    if (that.data.inputValue != '') {
      let sendData = {
        "action": "sendClientMessage",
        "content": {
          "utoken": utoken,
          "uniacid": uniacid,
          "content": that.data.inputValue,
          // 多商户ID
          'merchid': merchid,
          'MsgType': 'text'
        }
      };
      // socket.send(sendData);
      // console.log(socket.send(sendData))

      if (count < 3) {
        if (socket.send(sendData) == 2) {
          socket.connect();
          socket.send(sendData);
          count++;
        } else {
          // socket.connect();
          // socket.send(sendData);
          count = 1;
        }
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '聊天室升级中',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({});
            }
          }
        })
      }


      that.setData({
        showEmjoy: false
      });
    }

  },
  previewImage: function(e) {
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.image]
    });
  },
  sendImage: function() {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: "original",
      success: function(e) {
        //上传图片
        var imageList = e.tempFilePaths;
        for (var j = 0; j < imageList.length; j++) {
          wx.uploadFile({
            url: 'https://tws.cnweisou.com/wxapi/index.php?r=wxapp.util.uploader&i=' + uniacid,
            filePath: imageList[j],
            name: 'file',
            success: function(res) {
              var data = JSON.parse(res.data);
              if (data.status == "success") {
                // 发送图片
                let sendData = {
                  "action": "sendClientMessage",
                  "content": {
                    "utoken": utoken,
                    "uniacid": uniacid,
                    // "content": that.data.inputValue,
                    // 多商户ID
                    'merchid': merchid,
                    'PicUrl': data.url,
                    'MsgType': 'image'
                  }
                };
                socket.send(sendData);
              } else {
                return false;
              }
            }
          });
        }
      }
    });
  },
  // 登陆
  login: function() {
    var that = this;

    utoken = wx.getStorageSync('utoken');
    let sendData = {
      "action": "getConnectInfo",
      "content": {
        'utoken': utoken,
        'merchid': merchid,
        'uniacid': uniacid
      }

    };
    socket.send(sendData);
  },
  scroll: function(e) {
    var that = this;
    var oldscrolltop = that.data.oldscrolltop;
    wx.createSelectorQuery().select('#scroll').boundingClientRect(function(res) {
      // 使页面滚动到底部
      that.setData({
        scrolltop: res.height,
        oldscrolltop: res.height
      })
    }).exec();
  },
  creatLogList: function(list) {
    var that = this;
    var chatlog = that.data.chatlog;
    var chat = {};
    if (list.length <= 0) {
      return;
    }
    for (var i = 0; i < list.length; i++) {
      var chat = {
        "avatar": list[i].avatar,
        "mid": list[i].mid,
        "msgid": list[i].id,
        "nickname": list[i].nickname,
        "text": list[i].text,
        "time": list[i].sendtime,
        "type": list[i].type
      }
      if (list[i].mid == that.data.selfInfo.id) {
        continue;
      }
      chatlog.push(chat);
      that.readmessage(list[i].id, list[i].mid, that.data.selfInfo.id);
      cacheChatLogs.save(that.data.toUserInfo.id, chat);
    }
    that.setData({
      chatlog
    });
    setTimeout(function() {
      that.scroll();
    }, 200);
  },
  readmessage: function(msgid, uid, toUser) {
    var that = this;
    var sendData = {
      "uniacid": uniacid,
      "type": "check",
      "scene": "live",
      "uid": uid,
      "toUser": toUser,
      "msgid": msgid
    }
    // console.log("发送未读消息");
    socket.send(sendData);
  },
  onUnload() {
    socket.close();
  }
})