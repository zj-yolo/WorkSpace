var that,
  cpage = 1;
var allList;
var allListF;
var allListS;
var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken"),
  contListAll = [];
Page({
  data: {
    list: ['供求', '需求'],
    sub: 0,
    showType: false,
    isType: false,
    hasType: false,
    isBottom: false,
    currtype: ''
  },
  onLoad: function(options) {
    that = this;
    that.setData({
      sub: 0
    })
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=sad.get_type&utoken=' + utoken,
      method: 'GET',
      success: function(res) {
        var typeList = res.data.result;
        var len;
        for (var i in typeList) {
          len = i;
        }
        typeList[parseInt(len) + 1] = '所有';
        that.setData({
          typeList: typeList,
          len: parseInt(len) + 1
        })
      }
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onShow: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    cpage = 1;
    that.setData({
      currtype: '',
    })
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype,1);
  },
  // 点击出现类型
  selectType: function(e) {
    that = this;
    that.setData({
      showType: true,
      listType: that.data.typeList
    })
  },
  chooseType: function(e) {
    var that = this;
    var currIndex = e.currentTarget.dataset.index;
    that.setData({
      showType: false,
      currtype: that.data.listType[currIndex]
    })
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype,1);

  },
  sarchType: function() {
    that = this;
  },
  searchCont: function(e) {
    var that = this;
    var searchCont = e.detail.value;
    var typeSame = [];
    that.setData({
      searchCont: searchCont
    })
    if (that.data.searchCont) {
      var listType = that.data.typeList;
      for (var i in listType) {
        if (listType[i].indexOf(that.data.searchCont) > -1) {
          typeSame.push(listType[i]);
        }
      }
      if (typeSame.length != 0) {
        that.setData({
          typeSame: typeSame,
          isType: false
        })
        var len = that.data.typeList.length;
      } else {
        that.setData({
          isType: true
        })
      }
    }
  },
  choosetypeSame: function(e) {
    var that = this;
    var currIndex = e.currentTarget.dataset.index;
    that.setData({
      searchCont: that.data.typeSame[currIndex],
      currtype: that.data.typeSame[currIndex],
      typeSame: '',
    })
    cpage = 1;
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype,2);
  },
  returnIndex: function() {
    var that = this;
    that.setData({
      isBottom: false,
    })
  },
  isType: function() {
    var that = this;
    that.setData({
      isType: false,
      searchCont: '',
    })
  },
  returnIndex: function() {
    var that = this;
    that.setData({
      isBottom: false,
    })
  },
  add: function() {
    wx.navigateTo({
      url: '../../supdem/supdem',
    })

  },
  // 点击供应/需求
  clickTitle: function(e) {
    cpage = 1;
    var that = this;
    that.setData({
      currtype: ''
    })
    var sub = e.currentTarget.dataset.index;
    that.setData({
      sub: sub
    })
    cpage = 1;
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype,1);
  },
  joindetialInfo: function(e) {
    that = this;
    var currIndex = e.currentTarget.dataset.index;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=sad.add_views&utoken=' + utoken + '&id=' + that.data.contList[currIndex].id,
      data: {},
      method: 'GET',
      success: function(res) {
        wx.navigateTo({
          url: '../detialInfo/detialInfo?id=' + that.data.contList[currIndex].id,
        })
      }
    })
  },
  joinCreatActivity: function() {
    wx.navigateTo({
      url: '../../supdem/supdem?sub=' + that.data.sub,
    })
  },
  onReachBottom: function() {
    var that = this;
    if (!that.data.isBottom) {
      cpage++;
      that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype,1);
    }
  },
  onPullDownRefresh: function() {
    cpage = 1;
    var that = this;
    that.setData({
      currtype: '',
    })
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype, nameTypes,1);
    wx.stopPullDownRefresh()
  },
  allListStrat: function (utoken, sub, page, currtype,nameTypes) {
    var that = this;
    server.sendRequest({
      url: '?r=sad2.sad_list',
      data: {
        utoken: utoken,
        type: sub,
        page: page,
        desc: currtype
      },
      method: 'GET',
      success: function(res) {
        if (res.data.result) {
          if (res.data.result.list.length > 0) {
            that.setData({
              isMylist: true,
              searchCont: '',
              isBottom: false
            })
            var timeNum;
            for (var i in res.data.result.list) {
              timeNum = res.data.result.list[i].createtime.indexOf(' ');
              res.data.result.list[i].createtime = res.data.result.list[i].createtime.substring(0, timeNum)
            }

            if (page == 1) {
              contListAll = [];
              contListAll = res.data.result.list;
              that.setData({
                contList: contListAll
              })
            } else {
              contListAll = contListAll.concat(res.data.result.list);
              that.setData({
                contList: contListAll
              })
            }
          } else {
            if (nameTypes == 1) {
              if (page == 1) {
                that.setData({
                  isMylist: false,
                  isType: false
                })
              } else {
                that.setData({
                  isBottom: true
                })
              }
              that.setData({
                searchCont: '',
              })
            } else {
              that.setData({
                isMylist: true,
                isType: true
              })
            }
          }
        }
      }
    })
  }
})