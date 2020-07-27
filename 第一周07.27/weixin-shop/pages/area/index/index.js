var addr = require("../../../utils/add.js")
// var server = require('../../../utils/server');


var pageData = {
  data: {

  },
  onLoad(ev) {
    var that = this
    that.setData({
      local: {
        addr: ev.addr,
        lat: ev.lat,
        lng: ev.lng
      }
    })
    console.log(addr)
    var temABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var hotaddr = [{
      "city": "北京市",
      "N": "39.55",
      "E": "116.24",
      "firststr": "B"
    }, {
      "city": "成都市",
      "N": "30.4",
      "E": "104.04",
      "firststr": "C"
    }, {
      "city": "佛山市",
      "N": "23.02",
      "E": "113.06",
      "firststr": "F"
    }, {
      "city": "广州市",
      "N": "23.08",
      "E": "113.14",
      "firststr": "G"
    }, {
      "city": "杭州市",
      "N": "30.16",
      "E": "120.1",
      "firststr": "H"
    }, {
      "city": "南京市",
      "N": "32.03",
      "E": "118.46",
      "firststr": "N"
    }, {
      "city": "深圳市",
      "N": "22.33",
      "E": "114.07",
      "firststr": "S"
    }, {
      "city": "上海市",
      "N": "31.14",
      "E": "121.29",
      "firststr": "S"
    }, {
      "city": "天津市",
      "N": "39.02",
      "E": "117.12",
      "firststr": "T"
    }, {
      "city": "武汉市",
      "N": "30.35",
      "E": "114.17",
      "firststr": "W"
    }, {
      "city": "西安市",
      "N": "34.17",
      "E": "108.57",
      "firststr": "X"
    }, {
      "city": "重庆市",
      "N": "29.35",
      "E": "106.33",
      "firststr": "Z"
    }, ]
    this.setData({
      add: addr,
      hotaddr: hotaddr,
      temABC: temABC
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  slide: function(res) {
    var that = this;
    that.setData({
      show: 1,
      strA: res.target.dataset.index,
      toView: res.target.dataset.index
    })
    setTimeout(function() {
      that.setData({
        show: 0,
      })
    }, 2000)
  },
  strA: function(e) {
    console.log(e)
  },
  add: function(e) {
    var lat = e.target.dataset.lat;
    var lng = e.target.dataset.lng;
    var city = e.target.dataset.index;
    wx.reLaunch({
      url: '../../index/index?lat=' + lat + '&lng=' + lng + '&city=' + city,
    })
  },
  formSubmit: function(e) {
    for (let x in addr) {
      for (let y in addr[x].item) {

        if (addr[x].item[y].city == e.detail.value) {
          var lat = addr[x].item[y].N;
          var lng = addr[x].item[y].E;
          var city = addr[x].item[y].city;
          wx.reLaunch({
            url: '../../index/index?lat=' + lat + '&lng=' + lng + '&city=' + city,
          })
        }
      }
    }
  },
}
Page(pageData)
