var server = require('../../../utils/server');
Page({
  data: {
    liveList: [] //直播列表
  },
  onLoad: function(options) {
    this.loadLive_player()
  },
  onReady: function() {},
  onShow: function() {},
  loadLive_player() {
    let that = this;
    server.sendRequest({
      url: '?r=wxapp.liveinfo',
      data: {},
      method: 'GET',
      success: res => {
        if (res.data.status == 1) {
          if (res.data.result.room_info) {
            let room = res.data.result.room_info;
            //商品只截取3个
            room.forEach((item, index) => {
              item.goods=item.goods.slice(0, 3)
            })
            console.log(room)
            that.setData({
              liveList: room
            })
          }

        }
      }
    })
  },
  //跳转直播间
  skipLiveStreaming(e) {
    let roomId = e.currentTarget.dataset.roomid; // 房间号
    let customParams = {
      path: 'pages/index/index',
      pid: 1
    }
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
    })
  },
  onHide: function() {},
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})