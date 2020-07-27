var server = require('../../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    typeTitle:[],
    typeCont:'',
    classNum:''
  },
  onLoad: function () {
   utoken = wx.getStorageSync("utoken");
  var that = this;
  server.sendRequest({
    url: '?r=activity.index.get_type&utoken=' + utoken,
    method: 'GET',
    success: function (res) {
      that.setData({
        typeTitle:res.data.result
      });
    }
  })
},
 blockType:function(e){
   var that =this;
   console.log('blockType')
       that.setData({
       currTitleNum: parseInt(e.currentTarget.dataset.id)-1
     })
   },
   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  detailType:function(e){
    var that = this;
        that.setData({
          typeCont: e.currentTarget.dataset.desc,
          classNum: 1
        })
        wx.setStorage({
          key: 'typeCont',
          data: {
            typeCont: that.data.typeCont,
            classNum: that.data.classNum
          }
        })
        wx.navigateBack();
  },
  addTypeCont: function () {
     wx.navigateTo({
       url: '/packMember/pages/member/groupActivity/addType/addType' 
     })
  },
})