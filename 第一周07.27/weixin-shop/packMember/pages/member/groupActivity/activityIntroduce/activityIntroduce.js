Page({

  data: {
    height: 20,
    focus: false,
    textCont:'',
    activityTip:false,
    classNum:'',
    hh:true
  },
  getFocus:function(){
   this.setData({
      activityTip: false
    })
  },   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  bindFormSubmit: function (e) {
    var that = this;
    if (e.detail.value.textarea == false) {
      console.log('内容为空');
      that.setData({
        activityTip: true
      })
    }else{
      that.setData({
        textCont: e.detail.value.textarea,
        classNum: 1
      })
wx.setStorage({
  key: 'textCont',
  data:{
    textCont:that.data.textCont,
    classNum: that.data.classNum
  } 
})
wx.navigateBack()
    }
  },
})