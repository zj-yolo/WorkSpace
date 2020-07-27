const cacheChatLogs = require('../../../utils/cacheChatLogs')

Page({

  data: {
    //文字消息
    textMsg: '',
    //消息列表
    isHistoryLoading: false,
    scrollAnimation: false,
    scrollTop: 0,
    scrollToView: '',
    msgList: [],
    msgImgList: [],

    playMsgid: null,
    // 抽屉参数
    popupLayerClass: '',
    // more参数
    hideMore: true,
    //表情定义
    hideEmoji: true,
    emojiList: [
      [{ "url": "100.gif", alt: "[微笑]" }, { "url": "101.gif", alt: "[伤心]" }, { "url": "102.gif", alt: "[美女]" }, { "url": "103.gif", alt: "[发呆]" }, { "url": "104.gif", alt: "[墨镜]" }, { "url": "105.gif", alt: "[哭]" }, { "url": "106.gif", alt: "[羞]" }, { "url": "107.gif", alt: "[哑]" }, { "url": "108.gif", alt: "[睡]" }, { "url": "109.gif", alt: "[哭]" }, { "url": "110.gif", alt: "[囧]" }, { "url": "111.gif", alt: "[怒]" }, { "url": "112.gif", alt: "[调皮]" }, { "url": "113.gif", alt: "[笑]" }, { "url": "114.gif", alt: "[惊讶]" }, { "url": "115.gif", alt: "[难过]" }, { "url": "116.gif", alt: "[酷]" }, { "url": "117.gif", alt: "[汗]" }, { "url": "118.gif", alt: "[抓狂]" }, { "url": "119.gif", alt: "[吐]" }, { "url": "120.gif", alt: "[笑]" }, { "url": "121.gif", alt: "[快乐]" }, { "url": "122.gif", alt: "[奇]" }, { "url": "123.gif", alt: "[傲]" }],
      [{ "url": "124.gif", alt: "[饿]" }, { "url": "125.gif", alt: "[累]" }, { "url": "126.gif", alt: "[吓]" }, { "url": "127.gif", alt: "[汗]" }, { "url": "128.gif", alt: "[高兴]" }, { "url": "129.gif", alt: "[闲]" }, { "url": "130.gif", alt: "[努力]" }, { "url": "131.gif", alt: "[骂]" }, { "url": "132.gif", alt: "[疑问]" }, { "url": "133.gif", alt: "[秘密]" }, { "url": "134.gif", alt: "[乱]" }, { "url": "135.gif", alt: "[疯]" }, { "url": "136.gif", alt: "[哀]" }, { "url": "137.gif", alt: "[鬼]" }, { "url": "138.gif", alt: "[打击]" }, { "url": "139.gif", alt: "[bye]" }, { "url": "140.gif", alt: "[汗]" }, { "url": "141.gif", alt: "[抠]" }, { "url": "142.gif", alt: "[鼓掌]" }, { "url": "143.gif", alt: "[糟糕]" }, { "url": "144.gif", alt: "[恶搞]" }, { "url": "145.gif", alt: "[什么]" }, { "url": "146.gif", alt: "[什么]" }, { "url": "147.gif", alt: "[累]" }],
      [{ "url": "148.gif", alt: "[看]" }, { "url": "149.gif", alt: "[难过]" }, { "url": "150.gif", alt: "[难过]" }, { "url": "151.gif", alt: "[坏]" }, { "url": "152.gif", alt: "[亲]" }, { "url": "153.gif", alt: "[吓]" }, { "url": "154.gif", alt: "[可怜]" }, { "url": "155.gif", alt: "[刀]" }, { "url": "156.gif", alt: "[水果]" }, { "url": "157.gif", alt: "[酒]" }, { "url": "158.gif", alt: "[篮球]" }, { "url": "159.gif", alt: "[乒乓]" }, { "url": "160.gif", alt: "[咖啡]" }, { "url": "161.gif", alt: "[美食]" }, { "url": "162.gif", alt: "[动物]" }, { "url": "163.gif", alt: "[鲜花]" }, { "url": "164.gif", alt: "[枯]" }, { "url": "165.gif", alt: "[唇]" }, { "url": "166.gif", alt: "[爱]" }, { "url": "167.gif", alt: "[分手]" }, { "url": "168.gif", alt: "[生日]" }, { "url": "169.gif", alt: "[电]" }, { "url": "170.gif", alt: "[炸弹]" }, { "url": "171.gif", alt: "[刀子]" }],
      [{ "url": "172.gif", alt: "[足球]" }, { "url": "173.gif", alt: "[瓢虫]" }, { "url": "174.gif", alt: "[翔]" }, { "url": "175.gif", alt: "[月亮]" }, { "url": "176.gif", alt: "[太阳]" }, { "url": "177.gif", alt: "[礼物]" }, { "url": "178.gif", alt: "[抱抱]" }, { "url": "179.gif", alt: "[拇指]" }, { "url": "180.gif", alt: "[贬低]" }, { "url": "181.gif", alt: "[握手]" }, { "url": "182.gif", alt: "[剪刀手]" }, { "url": "183.gif", alt: "[抱拳]" }, { "url": "184.gif", alt: "[勾引]" }, { "url": "185.gif", alt: "[拳头]" }, { "url": "186.gif", alt: "[小拇指]" }, { "url": "187.gif", alt: "[拇指八]" }, { "url": "188.gif", alt: "[食指]" }, { "url": "189.gif", alt: "[ok]" }, { "url": "190.gif", alt: "[情侣]" }, { "url": "191.gif", alt: "[爱心]" }, { "url": "192.gif", alt: "[蹦哒]" }, { "url": "193.gif", alt: "[颤抖]" }, { "url": "194.gif", alt: "[怄气]" }, { "url": "195.gif", alt: "[跳舞]" }],
      [{ "url": "196.gif", alt: "[发呆]" }, { "url": "197.gif", alt: "[背着]" }, { "url": "198.gif", alt: "[伸手]" }, { "url": "199.gif", alt: "[耍帅]" }, { "url": "200.png", alt: "[微笑]" }, { "url": "201.png", alt: "[生病]" }, { "url": "202.png", alt: "[哭泣]" }, { "url": "203.png", alt: "[吐舌]" }, { "url": "204.png", alt: "[迷糊]" }, { "url": "205.png", alt: "[瞪眼]" }, { "url": "206.png", alt: "[恐怖]" }, { "url": "207.png", alt: "[忧愁]" }, { "url": "208.png", alt: "[眨眉]" }, { "url": "209.png", alt: "[闭眼]" }, { "url": "210.png", alt: "[鄙视]" }, { "url": "211.png", alt: "[阴暗]" }, { "url": "212.png", alt: "[小鬼]" }, { "url": "213.png", alt: "[礼物]" }, { "url": "214.png", alt: "[拜佛]" }, { "url": "215.png", alt: "[力量]" }, { "url": "216.png", alt: "[金钱]" }, { "url": "217.png", alt: "[蛋糕]" }, { "url": "218.png", alt: "[彩带]" }, { "url": "219.png", alt: "[礼物]" },]
    ],
    //表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
    onlineEmoji: { "100.gif": "AbNQgA.gif", "101.gif": "AbN3ut.gif", "102.gif": "AbNM3d.gif", "103.gif": "AbN8DP.gif", "104.gif": "AbNljI.gif", "105.gif": "AbNtUS.gif", "106.gif": "AbNGHf.gif", "107.gif": "AbNYE8.gif", "108.gif": "AbNaCQ.gif", "109.gif": "AbNN4g.gif", "110.gif": "AbN0vn.gif", "111.gif": "AbNd3j.gif", "112.gif": "AbNsbV.gif", "113.gif": "AbNwgs.gif", "114.gif": "AbNrD0.gif", "115.gif": "AbNDuq.gif", "116.gif": "AbNg5F.gif", "117.gif": "AbN6ET.gif", "118.gif": "AbNcUU.gif", "119.gif": "AbNRC4.gif", "120.gif": "AbNhvR.gif", "121.gif": "AbNf29.gif", "122.gif": "AbNW8J.gif", "123.gif": "AbNob6.gif", "124.gif": "AbN5K1.gif", "125.gif": "AbNHUO.gif", "126.gif": "AbNIDx.gif", "127.gif": "AbN7VK.gif", "128.gif": "AbNb5D.gif", "129.gif": "AbNX2d.gif", "130.gif": "AbNLPe.gif", "131.gif": "AbNjxA.gif", "132.gif": "AbNO8H.gif", "133.gif": "AbNxKI.gif", "134.gif": "AbNzrt.gif", "135.gif": "AbU9Vf.gif", "136.gif": "AbUSqP.gif", "137.gif": "AbUCa8.gif", "138.gif": "AbUkGQ.gif", "139.gif": "AbUFPg.gif", "140.gif": "AbUPIS.gif", "141.gif": "AbUZMn.gif", "142.gif": "AbUExs.gif", "143.gif": "AbUA2j.gif", "144.gif": "AbUMIU.gif", "145.gif": "AbUerq.gif", "146.gif": "AbUKaT.gif", "147.gif": "AbUmq0.gif", "148.gif": "AbUuZV.gif", "149.gif": "AbUliF.gif", "150.gif": "AbU1G4.gif", "151.gif": "AbU8z9.gif", "152.gif": "AbU3RJ.gif", "153.gif": "AbUYs1.gif", "154.gif": "AbUJMR.gif", "155.gif": "AbUadK.gif", "156.gif": "AbUtqx.gif", "157.gif": "AbUUZ6.gif", "158.gif": "AbUBJe.gif", "159.gif": "AbUdIO.gif", "160.gif": "AbU0iD.gif", "161.gif": "AbUrzd.gif", "162.gif": "AbUDRH.gif", "163.gif": "AbUyQA.gif", "164.gif": "AbUWo8.gif", "165.gif": "AbU6sI.gif", "166.gif": "AbU2eP.gif", "167.gif": "AbUcLt.gif", "168.gif": "AbU4Jg.gif", "169.gif": "AbURdf.gif", "170.gif": "AbUhFS.gif", "171.gif": "AbU5WQ.gif", "172.gif": "AbULwV.gif", "173.gif": "AbUIzj.gif", "174.gif": "AbUTQs.gif", "175.gif": "AbU7yn.gif", "176.gif": "AbUqe0.gif", "177.gif": "AbUHLq.gif", "178.gif": "AbUOoT.gif", "179.gif": "AbUvYF.gif", "180.gif": "AbUjFU.gif", "181.gif": "AbaSSJ.gif", "182.gif": "AbUxW4.gif", "183.gif": "AbaCO1.gif", "184.gif": "Abapl9.gif", "185.gif": "Aba9yR.gif", "186.gif": "AbaFw6.gif", "187.gif": "Abaiex.gif", "188.gif": "AbakTK.gif", "189.gif": "AbaZfe.png", "190.gif": "AbaEFO.gif", "191.gif": "AbaVYD.gif", "192.gif": "AbamSH.gif", "193.gif": "AbaKOI.gif", "194.gif": "Abanld.gif", "195.gif": "Abau6A.gif", "196.gif": "AbaQmt.gif", "197.gif": "Abal0P.gif", "198.gif": "AbatpQ.gif", "199.gif": "Aba1Tf.gif", "200.png": "Aba8k8.png", "201.png": "AbaGtS.png", "202.png": "AbaJfg.png", "203.png": "AbaNlj.png", "204.png": "Abawmq.png", "205.png": "AbaU6s.png", "206.png": "AbaaXn.png", "207.png": "Aba000.png", "208.png": "AbarkT.png", "209.png": "AbastU.png", "210.png": "AbaB7V.png", "211.png": "Abafn1.png", "212.png": "Abacp4.png", "213.png": "AbayhF.png", "214.png": "Abag1J.png", "215.png": "Aba2c9.png", "216.png": "AbaRXR.png", "217.png": "Aba476.png", "218.png": "Abah0x.png", "219.png": "Abdg58.png" },
    fromId: '2819659',
    toId: '2368',
    identity: '1',
    Viewid: '',
    /* 房间信息 */
    card_user_info: {},
    /* 用户信息 */
    user_info: {}
  },

  onLoad: function (option) {
    if (option.id == 2) {
      this.setData({
        fromId: option.cardid,
        toId: option.uid,
        myuid: 'worker_' + option.cardid,
        identity: option.id
      })
    } else {
      this.setData({
        fromId: option.uid,
        toId: option.cardid,
        myuid: option.uid,
        identity: option.id
      })
    }

    let roomId = this.data.identity == 1 ? `worker_${this.data.toId}_${this.data.fromId}` : `worker_${this.data.fromId}_${this.data.toId}`;
    this.setData({
      roomId: roomId,
    })
    this.init().then(() => {
      if (cacheChatLogs.getLogs(roomId)) {
        this.groupHistoryTime(cacheChatLogs.getLogs(roomId));
        // wx.nextTick(() => {
          this.setData({
            scrollToView: 'msg' + this.data.msgList[this.data.msgList.length - 1].msg.id
          })
        // })
      }

      setTimeout(() => {
        this.online();
      }, 2000);
    });
    wx.onSocketMessage(res => {
      let data = JSON.parse(res.data);
      switch (data.action) {
        // case 'online':
        //   wx.hideLoading();
        //   break;
        case 'message':
          this.formatMessage(data.result);
          break;
        case 'getUnread':
          this.handleUnreadMessage(data.result);
          break;
        case 'getHistory':
          this.handleGetHistory(data.result);
          break;
        case 'getUserInfo':
          this.handleUserInfo(data.result);
          break;
        default:
          break;
      }
    });
  },
  onShow() {
    this.setData({
      scrollTop: 9999999
    })
  },
  init() {
    // wx.showLoading({
    //   title: '连接中...',
    //   mask: true,
    // })
    return new Promise((resolve, reject) => {
      this.connect().then(() => {
        resolve();
      });
    })
  },
	connect() {
    return new Promise((resolve, reject) => {
      wx.connectSocket({
        url: 'wss://cardsocket.cnweisou.net',
        header: {
          'content-type': 'application/json'
        },
        protocols: ['protocol1'],
        method: 'GET',
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err);
        }
      });
    })
  },
	sendMessage(data) {
    return new Promise((resolve, reject) => {
      wx.sendSocketMessage({
        data: JSON.stringify(data),
      })
    })
  },
  handleAddWeChat(e) {
    let value = e.currentTarget.dataset.item;
    wx.setClipboardData({
      data: value,
    });
  },
  handleMakePhone(e) {
    let value = e.currentTarget.dataset.item;
    wx.makePhoneCall({
      phoneNumber: value
    });
  },
  handleSkip(e) {
    let url = e.currentTarget.dataset.url;
    wx.switchTab({
      url,
    })
  },
  handleUnreadMessage(data) {
    for (let i = 0; i < data.length; i++) {
      this.formatMessage(data[i]);
    }
  },
  formatMessage(data) {
    let time = Math.floor(new Date().valueOf() / 1000);
    if (time - data.time > 3 * 60) {
      let hour = new Date().getHours();
      let minute = new Date().getMinutes();

      let msg = {
        type: 'system',
        msg: {
          id: time,
          type: data.type,
          content: {
            text: `${hour}:${minute}`,
          }
        }
      }
      this.screenMsg(msg);
    }

    let userinfo = {
      uid: data.from,
    };
    if (data.identity == 2) {
      userinfo.username = JSON.parse(data.card_user_info).name;
      userinfo.face = JSON.parse(data.card_user_info).avatar;
    } else {
      userinfo.username = JSON.parse(data.user_info).name;
      userinfo.face = JSON.parse(data.user_info).avatar;
    }
    if (this.data.myuid == data.from) {
      // 自己

    } else {
      // 客服

      this.sendMessage({
        class: 'Chat\\Chat',
        action: 'read',
        content: data,
      });
    }
    let content = {}
    if (data.type == 'text') {
      content.text = data.message;
    } else {
      content.url = data.message;
      wx.getImageInfo({
        src: list[i].message,
        success: (image) => {
          content.w = image.width;
          content.h = image.height;
          content = this.setPicSize(content);
        }
      });
    }

    let msg = {
      type: 'user',
      msg: {
        id: data.time,
        type: data.type,
        content,
        userinfo,
      }
    };
    cacheChatLogs.save(data.room_id, msg);

    this.screenMsg(msg);
  },
  groupHistoryTime(list) {
    let time = '';
    let messageList = [];
    for (let i = 0; i < list.length; i++) {
      if (time != this.formatTime(list[i].msg.id, 1)) {
        time = this.formatTime(list[i].msg.id, 1);
        let showTime = time;
        let currentTime = this.formatTime(Math.floor(new Date().valueOf() / 1000), 1);

        if (time == currentTime) {
          showTime = this.formatTime(list[i].msg.id, 2);
        }

        let msg = {
          type: 'system',
          msg: {
            id: list[i].msg.id + i,
            type: 'text',
            content: {
              text: showTime,
            }
          }
        }
        messageList.push(msg);
        messageList.push(list[i]);
      } else {
        messageList.push(list[i]);
      }
    }
    this.setData({
      msgList: messageList
    })
  },
  formatTime(value, type) {
    let time = new Date(value * 1000);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = time.getDate();
    day = day < 10 ? '0' + day : day;
    let hour = time.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let minute = time.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;

    /* 1返回日期 2返回时间 */
    if (type == 1) {
      return `${year}-${month}-${day}`;
    } else {
      return `${hour}:${minute}`;
    }

  },
  online() {
    this.sendMessage({
      class: 'Chat\\Chat',
      action: 'online',
      content: {
        user_id: this.data.fromId,
        identity: this.data.identity,
      }
    })
    this.sendMessage({
      class: 'Chat\\Chat',
      action: 'getUnread',
      content: {
        from: this.data.fromId,
        to: this.data.toId,
        identity: this.data.identity,
      }
    });
    this.sendMessage({
      class: 'Chat\\Chat',
      action: 'getUserInfo',
      content: {
        from: this.data.fromId,
        to: this.data.toId,
        identity: this.data.identity,
      }
    })
  },
  handleUserInfo(data) {
    this.setData({
      card_user_info: data.card_user_info,
      user_info: data.user_info,
    })
    if (this.data.identity == 1) {
      let uid = 'worker_' + this.data.fromId;
      let time = Math.floor(new Date().valueOf() / 1000);
      let statusMessage = {
        type: 'user',
        msg: {
          id: time,
          type: 'info',
          userinfo: {
            uid,
            username: this.data.card_user_info.name,
            face: this.data.card_user_info.avatar,
            position: this.data.card_user_info.position,
            company_name: this.data.card_user_info.company_name,
            mobile: this.data.card_user_info.mobile,
            wxnumber: this.data.card_user_info.wxnumber,
          }
        }
      }
      wx.setNavigationBarTitle({
        title: this.data.card_user_info.name
      });
      this.screenMsg(statusMessage);
    } else {
      wx.setNavigationBarTitle({
        title: this.data.user_info.name
      });
    }
  },
  // 接受消息(筛选处理)
  screenMsg(msg) {
    //从长连接处转发给这个方法，进行筛选处理
    if (msg.type == 'system') {
      // 系统消息
      switch (msg.msg.type) {
        case 'text':
          this.addSystemTextMsg(msg);
          break;
      }
    } else if (msg.type == 'user') {
      // 用户消息
      switch (msg.msg.type) {
        case 'text':
          this.addTextMsg(msg);
          break;
        case 'info':
          this.addTextMsg(msg);
          break;
        case 'image':
          this.addImgMsg(msg);
          break;
      }

      if (msg.msg.userinfo.uid != this.data.myuid) {
        console.log('振动');
        wx.vibrateLong();
      }
    }

    setTimeout(() => {
      wx.nextTick(() => {
        // 滚动到底
        this.setData({
          scrollToView: 'msg' + msg.msg.id
        })
      });
    }, 200);
  },

  //触发滑动到顶部(加载历史信息记录)
  loadHistory(e) {
    if (this.data.isHistoryLoading) {
      return;
    }
    this.setData({
      isHistoryLoading: true, //参数作为进入请求标识，防止重复请求
      scrollAnimation: false, //关闭滑动动画
    })
    let Viewid = this.data.msgList[0].msg.id;//记住第一个信息ID
    let searchTime = '';
    if (this.data.msgList.length > 0 && this.data.msgList[0].type == 'system') {
      searchTime = this.data.msgList[1].msg.id;
    } else {
      searchTime = this.data.msgList[0].msg.id;
    }
    
    this.setData({
      Viewid,
    })
    this.sendMessage({
      class: 'Chat\\Chat',
      action: 'getHistory',
      content: {
        room_id: this.data.roomId,
        time: searchTime,
      }
    })
  },
  handleGetHistory(list) {
    let time = '';
    let formatList = this.data.msgList;
    let timeList = [];
    for (let i = 0; i < list.length; i++) {
      let userinfo = {
        uid: list[i].from,
      };
      if (list[i].identity == 2) {
        userinfo.username = JSON.parse(list[i].card_user_info).name;
        userinfo.face = JSON.parse(list[i].card_user_info).avatar;
      } else {
        userinfo.username = JSON.parse(list[i].user_info).name;
        userinfo.face = JSON.parse(list[i].user_info).avatar;
      }
      let content = {}
      if (list[i].type == 'text') {
        content.text = list[i].message;
      } else {
        content.url = list[i].message;
        wx.getImageInfo({
          src: list[i].message,
          success: (image) => {
            content.w = image.width;
            content.h = image.height;
            content = this.setPicSize(content);
          }
        });
      }

      let msg = {
        type: 'user',
        msg: {
          id: list[i].time,
          type: list[i].type,
          content,
          userinfo,
        }
      };

      // formatList.unshift(msg);
      if(time != this.formatTime(list[i].time, 1)) {
      	time = this.formatTime(list[i].time, 1);
      	let showTime = time;
      	let currentTime = this.formatTime(Math.floor(new Date().valueOf() / 1000), 1);

      	if(time == currentTime) {
      		showTime = this.formatTime(list[i].time, 2);
      	}

      	let messageContent = {
      		type: 'system',
      		msg: {
            id: list[i].time + i,
      			type: 'text',
      			content: {
      				text: showTime,
      			}
      		}
      	}
        timeList.unshift(msg);
      	timeList.unshift(messageContent);
      } else {
        timeList.splice(-i, 0, msg);
      }
    }
    formatList.unshift(...timeList)
    this.setData({
      msgList: formatList
    })

    //这段代码很重要，不然每次加载历史数据都会跳到顶部
    wx.nextTick(() => {
      this.setData({
        scrollToView: 'msg' + this.data.Viewid, //跳转上次的第一行信息位置
      })
      wx.nextTick(() =>  {
        this.setData({
          scrollAnimation: true,  //恢复滚动动画
        })
      });
    });
    this.setData({
      isHistoryLoading: false,
    })
  },
  //处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
  setPicSize(content) {
    // 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
    let maxW = 350;//350是定义消息图片最大宽度
    let maxH = 350;//350是定义消息图片最大高度
    if (content.w > maxW || content.h > maxH) {
      let scale = content.w / content.h;
      content.w = scale > 1 ? maxW : maxH * scale;
      content.h = scale > 1 ? maxW / scale : maxH;
    }
    return content;
  },

  //更多功能(点击+弹出) 
  showMore() {
    this.setData({
      hideEmoji: true,
    })
    if (this.data.hideMore) {
      this.setData({
        hideMore: false,
      })
      this.openDrawer();
    } else {
      this.hideDrawer();
    }
  },
  // 打开抽屉
  openDrawer() {
    this.setData({
      popupLayerClass: 'showLayer'
    })
  },
  // 隐藏抽屉
  hideDrawer() {
    this.setData({
      popupLayerClass: ''
    })
    setTimeout(() => {
      this.setData({
        hideMore: true,
        hideEmoji: true,
      })
    }, 150);
  },
  // 选择图片发送
  chooseImage() {
    this.getImage('album');
  },
  //拍照发送
  camera() {
    this.getImage('camera');
  },
  //选照片 or 拍照
  getImage(type) {
    this.hideDrawer();
    wx.chooseImage({
      sourceType: [type],
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      success: (res) => {
        wx.showLoading({
          title: '上传中'
        })
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://tws.cnweisou.com/wxapi/index.php?r=wxapp.util.uploader&i=450',
            filePath: res.tempFilePaths[i],
            name: 'file',
            success: data => {
              let file = JSON.parse(data.data)
              let msg = { url: file.url };
              this.sendMsg(msg, 'image');
            },
            complete() {
              wx.hideLoading()
            }
          })
        }
      }
    });
  },
  // 选择表情
  chooseEmoji() {
    this.setData({
      hideMore: true,
    })
    if (this.data.hideEmoji) {
      this.setData({
        hideEmoji: false,
      })
      this.openDrawer();
    } else {
      this.hideDrawer();
    }
  },
  //添加表情
  addEmoji(e) {
    let em = e.currentTarget.dataset.item;
    let textMsg = this.data.textMsg;
    textMsg += em.alt;
    this.setData({
      textMsg
    })
  },

  //获取焦点，如果不是选表情ing,则关闭抽屉
  textareaFocus() {
    if (this.data.popupLayerClass == 'showLayer' && this.data.hideMore == false) {
      this.hideDrawer();
    }
  },
  handleInput(e) {
    this.setData({
      textMsg: e.detail.value
    })
  },
  // 发送文字消息
  sendText() {
    this.hideDrawer();//隐藏抽屉
    if (!this.data.textMsg) {
      return;
    }
    let content = this.replaceEmoji(this.data.textMsg);
    let msg = { text: content }
    this.sendMsg(msg, 'text');
    this.setData({
      textMsg: ''
    })
  },
  //替换表情符号为图片
  replaceEmoji(str) {
    let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
      for (let i = 0; i < this.data.emojiList.length; i++) {
        let row = this.data.emojiList[i];
        for (let j = 0; j < row.length; j++) {
          let EM = row[j];
          if (EM.alt == item) {
            //在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
            //比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
            let onlinePath = 'https://s2.ax1x.com/2019/04/12/'
            let imgstr = '<img src="' + onlinePath + this.data.onlineEmoji[EM.url] + '">';
            return imgstr;
          }
        }
      }
    });
    return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
  },

  // 发送消息
  sendMsg(content, type) {
    let message = type == 'text' ? content.text : content.url;
    let msg = {
      from: this.data.fromId,
      to: this.data.toId,
      identity: this.data.identity,
      message,
      type,
      user_info: JSON.stringify(this.data.user_info),
      card_user_info: JSON.stringify(this.data.card_user_info),
    };
    this.sendMessage({
      class: 'Chat\\Chat',
      action: 'message',
      content: msg,
    });
  },

  // 添加文字消息到列表
  addTextMsg(msg) {
    let msgList = this.data.msgList;
    msgList.push(msg);
    this.setData({
      msgList
    })
  },
  // 添加图片消息到列表
  addImgMsg(msg) {
    wx.getImageInfo({
      src: msg.msg.content.url,
      success: (image) => {
        msg.msg.content.w = image.width;
        msg.msg.content.h = image.height;
        msg.msg.content = this.setPicSize(msg.msg.content);
        let msgImgList = this.data.msgImgList;
        msgImgList.push(msg.msg.content.url);
        let msgList = this.data.msgList;
        msgList.push(msg);
        
        this.setData({
          msgImgList,
          msgList,
        })
      }
    });
  },
  // 添加系统文字消息到列表
  addSystemTextMsg(msg) {
    let msgList = this.data.msgList;
    msgList.push(msg);
    this.setData({
      msgList,
    })
  },
  // 预览图片
  showPic(e) {
    let msg = e.currentTarget.dataset.item;
    wx.previewImage({
      indicator: "none",
      current: msg.content.url,
      urls: [msg.content.url]
    });
  },
  discard() {
    return;
  },
  onHide(){
    wx.onSocketOpen(function () {
      wx.closeSocket()
    })
  }

})