const server = require('../../../utils/server');

Page({

  data: {
    cardInfo: {},
    bottomPicture: [],
    userCardPhone: '',
    visitList: [],
    commentContent: '',
    isNoCard: false,
  },

  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
    if (!userInfo) {
      server.getUserInfo(this.getInfo());
      return false;
    }
    this.getInfo();
  },
  getInfo() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/home/getCardInfo',
      method: 'get',
      data: {
        utoken,
      },
      success: res => {
        if (res.data.code == 200) {
          wx.stopPullDownRefresh();
          if (res.data.result.id) {
            let bottomPicture = res.data.result.pictures;
            let cardInfo = res.data.result;
            let templateId = res.data.result.template_id ? res.data.result.template_id : '';
            let userCardPhone = cardInfo.ischange == 0 ? this.hiddenPhone(res.data.result.mobile) : res.data.result.mobile;
            let visitList = res.data.result.view.length > 5 ? res.data.result.view.slice(0, 5) : res.data.result.view;
            let startTime = server.getsec();
            this.setData({
              bottomPicture,
              cardInfo,
              userCardPhone,
              visitList,
              startTime,
              templateId
            })

            this.getComment();
            this.getVisitNumber();
          } else {
            let cardInfo = {
              name: '5G云市场',
              position: '客户服务',
              wxnumber: 'shop-5g-gov'
            }
            this.setData({
              isNoCard: true,
              cardInfo,
              userCardPhone: '4006976660'
            })
          }
        }
      }
    }, 'https://report.cnweisou.net')
  },
  getComment() {
    server.sendRequest({
      url: '/api/home/getComment',
      method: 'get',
      data: {
        card_id: this.data.cardInfo.id,
        page: 1,
        pagesize: 1,
      },
      success: res => {
        if (res.data.code == 200) {
          let count = res.data.result.count;
          let list = count > 0 ? res.data.result.list[0] : {};
          let time = count > 0 ? this.formatTime(res.data.result.list[0].createtime) : '';
          this.setData({
            list,
            count,
            time,
          })
        }
      }
    }, 'https://report.cnweisou.net')
  },
  formatTime(value) {
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
    let second = time.getSeconds();
    second = second < 10 ? '0' + second : second;
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  },
  hiddenPhone(phone) {
    if (phone) {
      let reg = /^(\d{3})\d{4}(\d{4})$/;
      return phone.replace(reg, '$1****$2');
    }
    return '';
  },
  handleMakeCall() {
    if (this.data.cardInfo.ischange == 0) {
      wx.showToast({
        title: '请先交换手机号码',
        icon: 'none'
      })
      return false;
    }
    if (this.data.cardInfo.mobile) {
      wx.makePhoneCall({
        phoneNumber: this.data.cardInfo.mobile,
      })
    }else{
      wx.makePhoneCall({
        phoneNumber: '4006976660',
      })
    }

  },
  getVisitNumber() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/home/addView',
      method: 'get',
      data: {
        utoken,
        card_id: this.data.cardInfo.id,
      },
      success: res => {

      }
    }, 'https://report.cnweisou.net')
  },
  handleAdd() {
    if (!this.data.isNoCard) {
      wx.requestSubscribeMessage({
        tmplIds: [this.data.templateId],
      })
      server.reportedData('addWechat', {
        wechat: this.data.cardInfo.wxnumber,
      });
    }
    wx.setClipboardData({
      data: this.data.cardInfo.wxnumber,
      success(res) {

      }
    })
  },
  handleComment() {
    let userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
    if (!userInfo) {
      server.getUserInfo(function() {});
    }
  },
  handleChangePhone(e) {
    let utoken = wx.getStorageSync('utoken');
    let resultMsg = e.detail.errMsg;
    let storageMsg = e.detail.encryptedData;
    let selfiv = e.detail.iv;
    if (resultMsg.indexOf('getPhoneNumber:fail') > -1) {
      wx.showToast({
        title: '已拒绝获取手机号',
        icon: 'none',
      })
    } else {
      server.sendRequest({
        url: '?r=ewei_hotel.member.auth_mobile',
        data: {
          utoken: utoken,
          encryptedData: storageMsg,
          iv: selfiv
        },
        method: "POST",
        success: res => {
          if (res.data.status != 1) {
            wx.showToast({
              title: '授权失败',
            })
          } else {
            server.reportedData('changePhone', {
              card_id: this.data.cardInfo.id,
              mobile: res.data.result.mobile,
            });
            this.getInfo();
          }
        }
      })
    }

  },
  handleClickChange() {
    wx.showToast({
      title: '您已交换成功',
      icon: 'none'
    })
  },
  handleConfirm(e) {
    let userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
    if (!userInfo) {
      return false;
    }
    wx.requestSubscribeMessage({
      tmplIds: [this.data.templateId],
    })
    server.reportedData('addcomment', {
      card_id: this.data.cardInfo.id,
      commentcontent: e.detail.value,
    });


    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/home/addComment',
      method: 'post',
      data: {
        utoken,
        content: e.detail.value,
        card_id: this.data.cardInfo.id,
      },
      success: res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '评论成功',
          })

          this.setData({
            commentContent: ''
          })
          this.getInfo();
        }
      }
    }, 'https://report.cnweisou.net')
  },
  handleVideoPlay() {
    server.reportedData('checkvideo', {
      card_id: this.data.cardInfo.id,
    });
  },
  handleVideoEnd() {
    server.reportedData('checkvideoall', {
      card_id: this.data.cardInfo.id,
    });
  },
  loadComment() {
    wx.navigateTo({
      url: '/pages/card/comment/index?id=' + this.data.cardInfo.id,
    })
  },
  handleShare() {
    wx.navigateTo({
      url: '/pages/card/qrcode/index?id=' + this.data.cardInfo.id,
    })
  },
  shareCard() {
    wx.requestSubscribeMessage({
      tmplIds: [this.data.templateId],
    })
    server.reportedData('sharecard', {
      card_id: this.data.cardInfo.id,
    });
    wx.navigateTo({
      url: '/pages/card/share/index?id=' + this.data.cardInfo.id,
    })
  },
  handleFormSubmit(e) {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/home/addFormIdCard',
      method: 'post',
      data: {
        formId: e.detail.formId,
        utoken,
      },
      success: res => {

      }
    }, 'https://report.cnweisou.net')
  },
  handlePreview(e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url]
    })
  },
  // 点赞
  handleClickLike() {
    if (this.data.cardInfo.is_star == 0) {
      wx.requestSubscribeMessage({
        tmplIds: [this.data.templateId],
      })
      server.reportedData('clicklike', {
        card_id: this.data.cardInfo.id,
      });
    }

    let utoken = wx.getStorageSync('utoken');
    let url = this.data.cardInfo.is_star == 1 ? '/api/home/delStar' : '/api/home/addStar';

    server.sendRequest({
      url,
      method: 'post',
      data: {
        utoken,
        card_id: this.data.cardInfo.id,
      },
      success: res => {
        if (res.data.code == 200) {
          this.getInfo();
        }
      }
    }, 'https://report.cnweisou.net')
  },
  handleChat() {
    let uid = wx.getStorageSync('uid');
    // let link = encodeURIComponent(`${this.data.cardInfo.link}?cardid=${this.data.cardInfo.id}&uid=${uid}&id=1`);
    // wx.navigateTo({
    //   url: '/pages/webviewindex/index?url=' + link,
    // })

    wx.navigateTo({
      url: '/pages/card/chat/index?cardid=' + this.data.cardInfo.id + '&uid=' + uid + '&id=1',
    })
  },
  onReady(res) {
    if (!this.data.isNoCard) {
      this.videoContext = wx.createVideoContext('myVideo')
    }
  },
  onHide() {
    if (!this.data.isNoCard) {
      server.reportedData('seeCard', {
        card_id: this.data.cardInfo.id,
        'start_time': this.data.startTime,
        'end_time': server.getsec()
      });
      if (this.videoContext) {
        this.videoContext.stop();
      }
    }
  },
  onPullDownRefresh() {
    if (this.videoContext) {
      this.videoContext.stop();
    }
    this.getInfo();
  }
})