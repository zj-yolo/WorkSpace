var server = require('../../../utils/server');
var categoryId
var keywords
var cPage = 0;
var gsort = "shop_price";
var asc = "desc";

function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden', 'hidden'];
}
var initSubMenuHighLight = [
  ['highlight', '', '', '', ''],
  ['', ''],
  ['', '', ''],
  []
];

Page({
  data: {
    loading: false,
    menu: ["highlight", "", "", ""],
    subMenuDisplay: initSubMenuDisplay(),
    subMenuHighLight: initSubMenuHighLight,
    sort: [
      ['shop_price-desc', 'shop_price-asc'],
      ['sales_sum-desc', 'sales_sum-asc'],
      ['is_new-desc', 'is_new-asc'], 'comment_count-asc'
    ],
    goods: [],
    empty: false
  },
  search: function(e) {

    keywords = this.data.keywords;
    cPage = 0;
    this.data.goods = [];
    this.getGoodsByKeywords(keywords, cPage, gsort + "-" + asc);

  },
  bindChange: function(e) {

    var keywords = e.detail.value;

    this.setData({
      keywords: keywords
    });
  },
  onLoad: function(options) {
    categoryId = options.categoryId;
    keywords = options.keywords;
    if (!keywords)
      this.getGoods(categoryId, 0, this.data.sort[0][0]);
    else
      this.getGoodsByKeywords(keywords, 0, this.data.sort[0][0]);
  },
  getGoodsByKeywords: function(keywords, page, sort) {
    var that = this;
    var sortArray = sort.split('-');
    gsort = sortArray[0];
    asc = sortArray[1];

    getApp().sendRequest({
      url: '?r=wxapp.goods&id=' + goodsId,
      showToast: false,
      data: {
        keywords: keywords,
        page: page,
        sort: sort_asc,
        sort_asc: asc
      },
      method: 'GET',
      success: function(res) {
        var newgoods = res.data.result.goods_list
        var ms = that.data.goods
        for (var i in newgoods) {
          ms.push(newgoods[i]);
        }

        wx.stopPullDownRefresh();

        if (ms.length == 0) {
          that.setData({
            empty: true
          });
        } else {
          that.setData({
            empty: false
          });

          that.setData({
            goods: ms,
            loading: false
          });
        }

      }
    })

  },

  getGoods: function(category, pageIndex, sort) {
    var that = this;
    var sortArray = sort.split('-');
    gsort = sortArray[0];
    asc = sortArray[1];

    server.getJSON('/Activity/group_list/' + "p/" + pageIndex, function(res) {

      var newgoods = res.data.result

      var ms = that.data.goods
      for (var i in newgoods) {
        ms.push(newgoods[i]);
      }

      if (ms.length == 0) {
        that.setData({
          empty: true
        });
      } else
        that.setData({
          empty: false
        });
      wx.stopPullDownRefresh();

      that.setData({
        goods: newgoods,
        loading: false
      });


    });

  },


  tapGoods: function(e) {
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: "../../../../../groupDetail/detail?objectId=" + objectId
    });
  },
  tapMainMenu: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var newSubMenuDisplay = initSubMenuDisplay();
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newSubMenuDisplay[index] = 'show';
    } else {
      newSubMenuDisplay[index] = 'hidden';
    }

    var menu = ["", "", "", ""];
    menu[index] = "highlight";

    if (index == 3) {
      this.setData({
        goods: []
      });
      cPage = 0;
      if (!keywords)
        this.getGoods(categoryId, 0, this.data.sort[index]);
      else
        this.getGoodsByKeywords(keywords, 0, this.data.sort[index]);
    }

    this.setData({
      menu: menu,
      subMenuDisplay: newSubMenuDisplay
    });
  },
  tapSubMenu: function(e) {
    this.setData({
      subMenuDisplay: initSubMenuDisplay()
    });
    var indexArray = e.currentTarget.dataset.index.split('-');
    for (var i = 0; i < initSubMenuHighLight.length; i++) {
      for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
        initSubMenuHighLight[i][j] = '';
      }
    }
    this.setData({
      goods: []
    });
    cPage = 0;
    if (!keywords)
      this.getGoods(categoryId, 0, this.data.sort[indexArray[0]][indexArray[1]]);
    else
      this.getGoodsByKeywords(keywords, 0, this.data.sort[indexArray[0]][indexArray[1]]);

    initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
    this.setData({
      subMenuHighLight: initSubMenuHighLight
    });
  },
  onReachBottom: function() {
    if (!keywords)
      this.getGoods(categoryId, ++cPage, gsort + "-" + asc);
    else
      this.getGoodsByKeywords(keywords, ++cPage, gsort + "-" + asc);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function() {
    this.setData({
      goods: []
    });
    cPage = 0;
    if (!keywords)
      this.getGoods(categoryId, cPage, gsort + "-" + asc);
    else
      this.getGoodsByKeywords(keywords, cPage, gsort + "-" + asc);
  }
});