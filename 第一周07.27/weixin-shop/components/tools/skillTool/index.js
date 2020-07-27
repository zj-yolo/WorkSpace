const server = require('../../../utils/server.js');
let timer = "";

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num;
}
Component({
  properties: {},
  externalClasses: ['my-class'],
  data: {
    time: {},
    times: [],
    goods: [],
    clock: {},
    skillPriceList: {}
  },
  attached() {
    this.loadSkill();
  },
  methods: {
    loadSkill() {
      server.sendRequest({
        url: '?r=seckill',
        data: {},
        success: res => {
          if (res.data.result && res.data.result.length != 0) {
            if (res.data.result.times) {
              var currTime;
              for (var i = 0; i < res.data.result.times.length; i++) {
                if (res.data.result.times[i].status == 0) {
                  currTime = i;
                  break;
                }
              }
              if (currTime || currTime == 0) {
                this.data.skillPriceList.show = true;
                this.setData({
                  time: res.data.result.time,
                  times: res.data.result.times,
                  goods: res.data.result.goods,
                  skillPriceList: this.data.skillPriceList
                });
                var starttime = this.data.times[currTime].starttime * 1000;
                var nowtime = this.data.time.nowtime * 1000;
                var endtime = this.data.times[currTime].endtime * 1000;
                var total_micro_second = endtime - nowtime;
                this.data.skillPriceList.nowClock =
                  this.data.times[currTime].time;
                this.data.skillPriceList.goods = this.data.goods;
                this.setData({
                  isSkill: true,
                  total_micro_second: total_micro_second,
                  skillPriceList: this.data.skillPriceList
                });
                this.count_down(this);
              } else {
                this.data.skillPriceList.show = "";
                this.setData({
                  skillPriceList: this.data.skillPriceList
                });
              }
            }
          } else {
            this.data.skillPriceList.show = false;
            this.setData({
              skillPriceList: this.data.skillPriceList
            });
          }
        }
      });
    },
    count_down: function (that) {
      var that = this;
      (that.data.skillPriceList.clock = that.date_format(
        that.data.total_micro_second
      )),
      that.setData({
        clock: that.date_format(that.data.total_micro_second),
        skillPriceList: that.data.skillPriceList
      });
      if (that.data.total_micro_second <= 0) {
        that.data.clock.clock_hasTime = "";
        that.data.clock = that.data.clock.clock_hasTime;
        that.setData({
          clock: that.data.clock,
          isSkill: false
        });
        return;
      }
      timer = setTimeout(function () {
        that.data.total_micro_second -= 1000;
        that.count_down(that);
      }, 1000);
    },
    date_format: function (micro_second) {
      var second = Math.floor(micro_second / 1000);
      var hr = fill_zero_prefix(Math.floor(second / 3600));
      var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
      var sec = fill_zero_prefix(second - hr * 3600 - min * 60);
      var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
      var dataTime = {
        clock_hour: hr,
        clock_min: min,
        clock_sec: sec,
        micro_sec: micro_sec,
        clock_all: hr + ":" + min + ":" + sec,
        clock_hasTime: true
      };
      return dataTime;
    },
    toskillList() {
      wx.navigateTo({
        url: '/pages/goods/priceKill/priceKill'
      })
    },
    toskillItem(e) {
      var objectId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/goods/detail/detail?objectId=" + objectId
      });
    }
  }
})