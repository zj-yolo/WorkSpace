let server = require('../../../utils/server');
Page({
  data: {
    parm: ({ 
      keywords: '', 
      menu_type: 0, 
      menu_id: 0, 
      page:0,
      sort: "",
      asc: "desc",
    }),
    menu_subtype:-1,
    lists: [],
    getCategorys: []
  },
  onLoad: function (options) {
    this.getCategorys();
    this.getList(this.data.parm);
  },
  tapMainMenu: function (e) {
    let that = this;
    let parm = that.data.parm;
    parm.menu_type = parseInt(e.currentTarget.dataset.menu_type);
    if (parm.menu_type ==1 ){
    }
    else if(parm.menu_type == 0){
      parm.keywords = '';
      parm.menu_type = 0;
      parm.menu_id = 0;
      parm.page = 0;
      parm.sort = "";
      parm.asc = "desc";
      that.getList(parm);
    }
    else{
      that.getList(parm);
    }
    that.setData({
      menu_subtype: parm.menu_type,
      parm
    });
  },
  tapSubMenu: function (e) {
    let that = this;
    let parm = that.data.parm;
    parm.menu_id = parseInt(e.currentTarget.dataset.menu_id);

    that.getList(parm);

    that.setData({
      menu_subtype: -1,
      parm
    });
  },
  bindChange: function (e) {
    let that = this;
    let parm = that.data.parm;
    parm.keywords = e.detail.value;
    that.setData({
      parm
    });
  },
  //搜索提交
  search: function (e) {
    let that = this;
    let parm = that.data.parm;
    that.getList(parm);
  },
  //信息列表
  getList: function (parm) {

    let that = this;
    
    server.sendRequest({
      url: '?r=wxarticle.list.getlist',
      data: parm,
      method: 'GET',
      success: function (res) {
        let lists = res.data.result
          that.setData({
            lists: lists
          });
      }
    });
  },
  //信息分类列表
  getCategorys: function () {
    let that = this;
    server.sendRequest({
      url: '?r=wxarticle.list.categorys',
      method: 'GET',
      success: function (res) {
        let getCategorys = res.data.result
          that.setData({
            getCategorys: getCategorys
          });
      }
    });
  },
  tapLists: function (e) {
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: "/packageA/pages/article/detail/detail?objectId=" + objectId
    });
  },
});