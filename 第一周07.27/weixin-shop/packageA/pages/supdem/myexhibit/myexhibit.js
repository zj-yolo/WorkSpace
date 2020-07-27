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
    loading: true,
    list: ['供求', '需求'],
    sub: 0,
    showType: false,
    isType: false,
    hasType: false,
    isBottom: false,
    currtype: '',
    highlight4: ['highlight4']
  },
  onLoad: function(options) {
    that = this;
    if (options.issd) {
      that.setData({
        sub: options.sub
      })
    } else {
      that.setData({
        sub: 0
      })
    }
    that.getalllist()      
  },
  getalllist: function() {
    var that = this;
    utoken = wx.getStorageSync("utoken");
    server.sendRequest({
      url: '?r=sad.get_type&utoken=' + utoken,
      method: 'GET',
      success: function(res) {
        // var typeList = res.data.result;
        // var len;
        // for (var i in typeList) {
        //   console.log('iii',i)
        //   len = i;
        // }
        // typeList[parseInt(len) + 1] = '所有';
        that.setData({
          typeList: res.data.result
          // len: parseInt(len) + 1
        })
        console.log('1111111', that.data.typeList[0])     
        that.allListStrat(utoken, that.data.sub, cpage, that.data.typeList[0], 1)        
      }
    })
  },
  onShow: function() {
    utoken = wx.getStorageSync("utoken");
    var that = this;
    cpage = 1;
    // console.log('1222', that.data.sub, that.data.typeList) 
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
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
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype, 1);

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
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype, 2);
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
    // that.setData({
    //   currtype: ''
    // })
    var sub = e.currentTarget.dataset.index;
    that.setData({
      sub: sub,
      highlight4: ['highlight4']      
    })
    cpage = 1;
    that.getalllist()
    // that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype, 1);
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
      that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype, 1);
    }
  },

  onPullDownRefresh: function() {
    cpage = 1;
    var that = this;
    that.setData({
      currtype: '',
    })
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype, 1);
    wx.stopPullDownRefresh()
  },

  allListStrat: function(utoken, sub, page, currtype, nameTypes) {
    var that = this;
    server.sendRequest({
      url: '?r=sad2.mylist',
      data: {
        utoken: utoken,
        type: sub,
        page: page,
        desc: currtype
      },
      method: 'GET',
      success: function(res) {
        if (res.data.result) {
          if (res.data.result.list && res.data.result.list.length > 0) {
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
  },
  allInfo: function() {
    wx.navigateTo({
      url: "../exhibit/exhibit",
    })

  },
  tapTopCategory: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    that.setData({
      currtype: e.currentTarget.dataset.desc,
      // contList: []
    })
    cpage = 1
    that.allListStrat(utoken, that.data.sub, cpage, that.data.currtype, 1);
    that.setHighlight(index);
  },
  setHighlight: function(index) {
    var highlight4 = [];
    for (var i = 0; i < this.data.topCategories; i++) {
      highlight4[i] = '';
    }
    highlight4[index] = 'highlight4';
    this.setData({
      highlight4: highlight4
    });
    console.log('1111', that.data.highlight4)
  },
})