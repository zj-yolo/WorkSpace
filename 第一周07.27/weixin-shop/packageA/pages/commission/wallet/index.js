const server = require('../../../../utils/server')

Page({

  data: {
    optionList: [
      {
        name: '返现明细',
        type: 'returnMoney'
      },
      {
        name: '提现记录',
        type: 'withDraw'
      },
    ],
    optionType: 'returnMoney',
    statusList: [
      {
        name: '全部',
        type: 'all'
      },
      {
        name: '待付款',
        type: '0'
      },
      {
        name: '待发货',
        type: '1'
      },
      {
        name: '待收货',
        type: '2'
      },
      {
        name: '已完成',
        type: '3'
      },
      {
        name: '已退款',
        type: '4'
      },
    ],
    statusType: 'all',
    page: 1,
    noMore: false,
    hasContent: true,
    walletList: [],
    totalMoney: 0,
    withDrawMoney: 0,
    withDrawList: []
  },

  onLoad: function (options) {
  },
  onShow() {
    this.setData({
      page: 1,
      statusList: [
        {
          name: '全部',
          type: 'all'
        },
        {
          name: '待付款',
          type: '0'
        },
        {
          name: '待发货',
          type: '1'
        },
        {
          name: '待收货',
          type: '2'
        },
        {
          name: '已完成',
          type: '3'
        },
        {
          name: '已退款',
          type: '4'
        },
      ],
      statusType: 'all',
      optionType: 'returnMoney',
      noMore: false,
      hasContent: true,
    })
    this.getWalletDetail();
  },
  handleOptionClick(e) {
    let type = e.currentTarget.dataset.type;
    let statusList;

    if(type == 'returnMoney') {
      statusList = [
        {
          name: '全部',
          type: 'all'
        },
        {
          name: '待付款',
          type: '0'
        },
        {
          name: '待发货',
          type: '1'
        },
        {
          name: '待收货',
          type: '2'
        },
        {
          name: '已完成',
          type: '3'
        },
        {
          name: '已退款',
          type: '4'
        },
      ];
    } else {
      statusList = [
        {
          name: '全部',
          type: 'all'
        },
        {
          name: '待审核',
          type: '1'
        },
        {
          name: '已打款',
          type: '2'
        },
        {
          name: '驳回',
          type: '-1'
        },
      ];
    }

    this.setData({
      optionType: type,
      statusList,
      statusType: 'all',
      page: 1,
      hasContent: true,
    })

    if(type == 'returnMoney') {
      this.getWalletDetail();
    } else {
      this.getWithDrawDetail();
    }
  },
  handleStatusClick(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      statusType: type,
      page: 1,
      hasContent: true,
    })
    if (this.data.optionType == 'returnMoney') {
      this.getWalletDetail();
    } else {
      this.getWithDrawDetail();
    }
  },
  handleWithDraw() {
    wx.navigateTo({
      url: '/packageA/pages/commission/newWithDraw/index?num=' + this.data.withDrawMoney,
    })
  },
  /* 返现明细 */
  getWalletDetail() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/Distribution/getWallet',
      method: 'GET',
      data: {
        utoken,
        page: this.data.page,
        status: this.data.statusType,
      },
      success: res => {
        if(res.data.code == 200) {
          let walletList = this.data.page == 1 ? [] : this.data.walletList;
          walletList.push(...res.data.result.list);
          let hasContent = walletList.length == 0 ? false : true;
          let noMore = res.data.result.list.length == 0 ? true : false;
          let withDrawMoney = res.data.result.credit;
          let totalMoney = res.data.result.total_money;

          this.setData({
            noMore,
            walletList,
            hasContent,
            withDrawMoney,
            totalMoney
          })
        } else {
          this.setData({
            hasContent: false,
          })
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  /* 提现记录 */
  getWithDrawDetail() {
    let utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '/api/Distribution/getWithdrawLog',
      method: 'GET',
      data: {
        utoken,
        page: this.data.page,
        status: this.data.statusType,
      },
      success: res => {
        if (res.data.code == 200) {
          let withDrawList = this.data.page == 1 ? [] : this.data.withDrawList;
          withDrawList.push(...res.data.result.list);
          let hasContent = withDrawList.length == 0 ? false : true;
          let noMore = res.data.result.list.length == 0 ? true : false;

          this.setData({
            noMore,
            withDrawList,
            hasContent,
          })
        } else {
          this.setData({
            hasContent: false,
          })
        }
      }
    }, 'https://5g-center.cnweisou.net')
  },
  onReachBottom: function () {
    let page = this.data.page;
    if(!this.data.noMore) {
      page += 1;
    }

    this.setData({
      page,
    })
    if (this.data.optionType == 'returnMoney') {
      this.getWalletDetail();
    } else {
      this.getWithDrawDetail();
    }
  },
})