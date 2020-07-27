const server = require('../../../utils/server.js')
Component({
  properties: {},
  externalClasses: ['my-class'],
  data: {
    groupList: {}
  },
  attached() {
    this.loadGroup();
  },
  methods: {
    loadGroup() {
      server.sendRequest({
        url: '?r=wxapp.groups',
        data: {},
        success: res => {
          if (res.data.status == 1) {
            this.setData({
              groupList: res.data.result.recgoods
            })
          } else {
            console.log('获取失败')
          }
        }
      });
    },
    togroupList() {
      wx.navigateTo({
        url: '/pages/bottom/groupbuy/index'
      })
    },
    togroupItem(res) {
      wx.navigateTo({
        url: "/packageA/pages/groupbuy/detail/index?id=" + res.currentTarget.dataset.id
      })
    }
  }
})