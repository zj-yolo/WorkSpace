var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var pageData = {
  data: {
    time: '10:00',
    curMonthIndex: ''
  },
  onLoad: function(options) {
    var that = this;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    var myDate = new Date();
    var curYear = myDate.getFullYear();
    var curMonth = myDate.getMonth() + 1;
    var curDate = myDate.getDate();
    const cur_year_now = myDate.getFullYear();
    const cur_month_now = myDate.getMonth() + 1;
    var thisMonthDays = new Date(curYear, curMonth, 0).getDate();
    var nextMonthDays = new Date(curYear, curMonth + 1, 0).getDate();
    var thirdMonthDays = new Date(curYear, curMonth + 2, 0).getDate();
    var curMonthArray = [];
    var nextMonthArray = [];
    var thirdMonthArray = [];
    for (var i = 1; i <= thisMonthDays; i++) {
      curMonthArray.push(i)
    }
    for (var i = 1; i <= nextMonthDays; i++) {
      nextMonthArray.push(i)
    }
    for (var i = 1; i <= thirdMonthDays; i++) {
      thirdMonthArray.push(i)
    }
    let allDays = [{
        days: curMonthArray,
        emptyDays: new Date(Date.UTC(curYear, curMonth - 1, 1)).getDay(),
        month: (curMonth).toString()
      },
      {
        days: nextMonthArray,
        emptyDays: new Date(Date.UTC(curYear, curMonth, 1)).getDay(),
        month: curMonth + 1
      },
      {
        days: thirdMonthArray,
        emptyDays: new Date(Date.UTC(curYear, curMonth + 1, 1)).getDay(),
        month: curMonth + 2
      }
    ];
    that.setData({
      allDays,
      weeks_ch,
      curYear,
      curMonth,
      curDate,
      indexs: curDate,
      curMonthIndex: curMonth,
      id: options.cartIds,
      sum: options.amount,
      title: options.title,
      price: options.price,
      img: options.img,
      store: options.stroe,
      optionid: options.optionid,
      name_arr: options.name_arr
    })
    that.loadData();
  },
  loadData: function() {
    var that = this;
    utoken = wx.getStorageSync('utoken');
    server.sendRequest({
      url: '?r=wxapp.services.price.getprice',
      data: {
        id: that.data.id,
        utoken: utoken,
        optionid: that.data.optionid
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          list: res.data
        })

      }
    })
  },
  Xget: function(e) {
    let that = this;
    let month = e.currentTarget.dataset.month;
    let day = e.currentTarget.dataset.day;
    let year = e.currentTarget.dataset.year;
    that.setData({
      indexs: day,
      curMonthIndex: month
    })
    for (let x in that.data.list) {
      if (that.data.list[x].month == month && that.data.list[x].day == day) {
        if (that.data.name_arr != '') {
          that.setData({
            price: that.data.list[x].oprice,
            thisdate: that.data.list[x].thisdate
          })

          setTimeout(function() {
            wx.navigateTo({
              url: '/pages/order/ordersubmit/index?cartIds=' + that.data.id + '&amount=' + that.data.sum + '&title=' + that.data.title + '&price=' + that.data.price + '&img=' + that.data.img + '&time=' + that.data.thisdate + '&store=1&optionid=' + that.data.optionid + '&name_arr=' + that.data.name_arr,
            })
          }, 1000)
        } else {
          that.setData({
             price: that.data.list[x].oprice,
            thisdate: that.data.list[x].thisdate
          })
          setTimeout(function() {
            console.log('/pages/order/ordersubmit/index?cartIds=' + that.data.id + '&amount=' + that.data.sum + '&title=' + that.data.title + '&price=' + that.data.price + '&img=' + that.data.img + '&time=' + that.data.thisdate + '&store=1&optionid=' + that.data.optionid + '&name_arr=');
            wx.navigateTo({
              url: '/pages/order/ordersubmit/index?cartIds=' + that.data.id + '&amount=' + that.data.sum + '&title=' + that.data.title + '&price=' + that.data.price + '&img=' + that.data.img + '&time=' + that.data.thisdate + '&store=1&optionid=' + that.data.optionid + '&name_arr=',
            })
          }, 1000)
        }
        return;
      }
    }

    wx.showToast({
      title: '暂不支持预定',
      icon: 'loading',
      duration: 2000
    })
  },
  // 修改预约时间
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
}
Page(pageData)