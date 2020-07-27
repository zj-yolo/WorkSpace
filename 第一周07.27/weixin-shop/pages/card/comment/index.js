const server = require('../../../utils/server');

Page({

  data: {
    avatar: '',
    page: 1,
    cardId: '',
    pageSize: 10,
    list: [],
    noMore: false,
    comment: ''
  },

  onLoad: function (options) {
    this.setData({
      cardId: options.id
    })
    this.getUserInfo();
    this.getList();
  },
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        let avatar = res.userInfo.avatarUrl;
        this.setData({
          avatar,
        })
      }
    })
  },
  getList() {
    server.sendRequest({
      url: '/api/home/getComment',
      method: 'get',
      data: {
        card_id: this.data.cardId,
        page: this.data.page,
        pagesize: this.data.pageSize,
      },
      success: res => {
        if (res.data.code == 200) {
          let list = this.data.page == 1 ? [] : this.data.list;
          let noMore = res.data.result.list.length == 0 ? true : false;
          list.push(...res.data.result.list);

          this.setData({
            list,
            noMore,
          })
        }
      }
    }, 'https://report.cnweisou.net')
  },

  onShow: function () {

  },
  handleComment() {
    let userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
    if (!userInfo) {
      server.getUserInfo(function () { });
    }
  },
  handleConfirm(e) {
    let userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
    if (!userInfo) {
      return false;
    }
    server.reportedData('addcomment', {
      card_id: this.data.cardId,
      commentcontent: e.detail.value,
    });
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/home/addComment',
      method: 'post',
      data: {
        utoken,
        content: e.detail.value,
        card_id: this.data.cardId,
      },
      success: res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '评论成功',
          })
          this.setData({
            page: 1,
            comment: ''
          })
          this.getList();
        }
      }
    }, 'https://report.cnweisou.net')
  },
  onReachBottom() {
    let page = this.data.page;
    page = this.data.noMore ? page : ++page;
    this.setData({
      page
    })
    this.getList();
  }

})