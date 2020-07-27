function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
var server = require('../../../utils/server');
var WxParse = require('../../../wxParse/wxParse.js');
var utoken = wx.getStorageSync("utoken");
var timer;
Page({
  data: {
    loading: false,
    skillPriceList: ''
  },
  getstartList: function() {
    var that = this;
    var utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=seckill&utoken=' + utoken,
      showToast: false,
      data: {},
      method: 'GET',
      success: function(res) {
        if (res.data.result && res.data.result.title) {
          wx.setNavigationBarTitle({
            title: res.data.result.title
          });
        }
        if (res.data.result && typeof(res.data.result.length) == 'number' && res.data.result.length > 0 || res.data.result && typeof(res.data.result.length) == 'undefined' && res.data.result.goods) {
          if (res.data.result.times) {
            var currTime;
            for (var i = 0; i < res.data.result.times.length; i++) {
              if (res.data.result.times[i].status == 0) {
                currTime = i;
                break;
              }
            }
            if (currTime || currTime == 0) {
              that.setData({
                currTime: currTime,
                times: res.data.result.times,
                goods: res.data.result.goods,
                time: res.data.result.time,
                skillPriceshow: true,
                skillPriceList: that.data.skillPriceList,
                sub: currTime,
                buying: res.data.result.times[currTime].status,
                nowShop: true
              })
              var starttime = (that.data.times[that.data.currTime].starttime) * 1000;
              var nowtime = (that.data.time.nowtime) * 1000;
              var endtime = (that.data.times[that.data.currTime].endtime) * 1000;
              var total_micro_second = endtime - nowtime;

              that.setData({
                loading: false,
                isSkill: true,
                total_micro_second: total_micro_second
              })

              that.count_down(that);
            } else {}
          }
        } else {
          that.setData({
            skillPriceshow: false,
            loading: false,
          })
          wx.showModal({
            title: '提示',
            content: '目前还没有秒杀商品喔',
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })

        }
      }
    })

  },

  onShow: function() {
    var that = this;
    that.getstartList();


  },

  count_down: function(that) {
    var that = this;
    that.setData({
      clock: that.date_format(that.data.total_micro_second)
    });
    if (that.data.total_micro_second <= 0) {
      that.data.clock.clock_hasTime = '';
      that.data.clock = that.data.clock.clock_hasTime
      that.setData({
        clock: that.data.clock,
        isSkill: false,
      });
      that.getstartList();
      return;
    }
    timer = setTimeout(function() {
      that.data.total_micro_second -= 1000;
      that.count_down(that);
    }, 1000)


  },


  date_format: function(micro_second) {
    var second = Math.floor(micro_second / 1000);
    var hr = fill_zero_prefix(Math.floor(second / 3600));
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
    var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
    var dataTime = {
      'clock_hour': hr,
      'clock_min': min,
      'clock_sec': sec,
      'micro_sec': micro_sec,
      'clock_all': hr + ":" + min + ":" + sec,
      'clock_hasTime': true,
    }
    return dataTime;
  },
  // 点击头部列表
  clickTitle: function(e) {
    clearTimeout(timer);
    var that = this;
    var sub = e.currentTarget.dataset.index;
    if (sub == that.data.currTime) {
      that.setData({
        nowShop: true,
        sub: sub,
      })
    } else {
      that.setData({
        nowShop: false,
        sub: sub,
      })
    }

    var id = that.data.times[sub].id;
    var taskid = that.data.times[sub].taskid;
    var utoken = wx.getStorageSync("utoken");

    // 获取秒杀列表
    server.sendRequest({
      url: '?r=seckill.get_goods&utoken' + utoken + "&timeid=" + id + '&taskid=' + taskid,
      data: {},
      method: 'GET',
      success: function(res) {
        if (res.data.result) {
          if (res.data.result.time) {

            that.setData({
              goods: res.data.result.goods,
              time: res.data.result.time,
            })
            var starttime = (that.data.time.starttime) * 1000;
            var endtime = (that.data.time.endtime) * 1000;
            var nowtime = (that.data.time.nowtime) * 1000;

            that.setData({
              isSkill: true,
              buying: that.data.time.status
            })
            if (that.data.time.status == 1) {
              var total_micro_second1 = starttime - nowtime;
              that.setData({
                total_micro_second: total_micro_second1,
                buying: that.data.time.status
              })

              that.count_down(that);

            } else if (that.data.time.status == -1) {
              that.setData({
                buying: that.data.time.status
              })
            } else if (that.data.time.status == 0) {
              var total_micro_second = endtime - nowtime;
              that.setData({
                total_micro_second: total_micro_second,
                buying: that.data.time.status
              })
              that.count_down(that);
            }
          }
        }
      }
    })
  },

  // 去详细页
  joinDetail: function(e) {
    var that = this;
    var sub = e.currentTarget.dataset.index;
    var objectId = that.data.goods[sub].goodsid
    wx.navigateTo({
      url: "../../../../../detail/detail?objectId=" + objectId
    });
  },

  onUnload: function() {
    clearTimeout(timer);
  },
  // onHide: function() {
  //   clearTimeout(timer);

  // },

})