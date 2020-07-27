const server = require('../../utils/server.js');

Page({

  data: {
    vrImg: '',
    vrLink: '',
    start_time: 0,
    videoImg: '',
    videos: '',
    playVideo: false,
    showDefault: false,
    cardId: ''
  },

  onLoad: function(options) {
    if (options.scene) {
      options = server.sceneToParams(options.scene);
      this.setData({
        cardId: options.cardid,
      })
    }
    if (!wx.getStorageSync('utoken')) {
      server.getNewToken(this.getInfo);
    } else {
      this.getInfo();
    }
    this.getImgInfo();
  },

  //点击播放开始上报数据
  toplay: function() {
    this.setData({
      playVideo: true
    })
    server.reportedData('see_storeVideo', {});
  },
  onHide() {
    let that = this;
    let videoContext = wx.createVideoContext('video')
    if (that.data.playVideo == true) {
      //当切换页面时视频视频暂停
      videoContext.pause();
      
    } else {
      server.reportedData('see_vrshow', {
        'start_time': that.start_time,
        'end_time': server.getsec()
      });
    }

  },
  // 复制快手，抖音链接
  copy(tiktok_command, kwaifu_command) {
    let clip = "" + tiktok_command + ' ' + kwaifu_command + "";
    wx.setClipboardData({
      data: clip,
      success: function () {
        wx.hideToast();
      }
    });
  },

  // 获取首页数据
  getImgInfo() {
    let that = this;
    server.sendRequest({
      url: '?r=wxapp.getShopBaseInfo',
      data: {},
      method: 'POST',
      success: function(res) {
        if (res.data.status == 1) {
          that.start_time = server.getsec();
          let showDefault;
          if (res.data.result.base && res.data.result.base.vr_link && res.data.result.base.videos) {
            showDefault = false;
          } else {
            showDefault = true;
          }

          that.copy(res.data.result.base.tiktok_command, res.data.result.base.kwaifu_command)

          that.setData({
            vrImg: res.data.result.base.vr_bg_img,
            vrLink: res.data.result.base.vr_link,
            shopid: res.data.result.base.uniacid,
            videoImg: res.data.result.base.videos_recommend_link,
            videos: res.data.result.base.videos,
            showDefault,
          })
        }
      }
    })
  },
  handleSkip() {
    let userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
    if (this.data.vrLink) {
      let url = this.data.vrLink.split(':')[0];
      if (url.indexOf('s') > -1) {
        if (userInfo) {
          let isJoin = this.data.vrLink.indexOf('?') > -1;
          let link;
          if (isJoin) {
            link = encodeURIComponent(`${this.data.vrLink}&from='shop'`);
          } else {
            link = encodeURIComponent(`${this.data.vrLink}?from='shop'`);
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
  getInfo() {
    let utoken = wx.getStorageSync('utoken');
    let data = {
      utoken,
    }
    if(this.data.cardId) {
      data.card_id = this.data.cardId;
    }
    server.sendRequest({
      url: '/api/home/getCardInfo',
      method: 'get',
      data,
      success: res => {
      }
    }, 'https://report.cnweisou.net')
  }
})