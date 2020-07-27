Page({
  data: {},
  inputType:function(e){
    this.setData({
      typeCont: e.detail.value,
      classNum: 1
    })
  },
  formSubmit:function(e){
    var that = this;
    wx.setStorage({
      key: 'typeCont',
      data: {
        typeCont: that.data.typeCont,
        classNum: that.data.classNum
      }
    })

    wx.navigateBack({
      delta: 2
    })
  },
   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  
})