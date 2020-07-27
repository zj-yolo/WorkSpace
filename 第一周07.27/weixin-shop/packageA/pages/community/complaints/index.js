var server = require('../../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    images:[],
  },
   chooseImage:function(){
    var that=this;
    var ss = []
    wx.chooseImage({
      count:5,
      sizeType: ['compressed'],
      sourceType:['album','camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);  console.log('--------')
        console.log(tempFilePaths[0])
        for (var i = 0; i < tempFilePaths.length;i++)
        {
          wx.uploadFile({
            url: 'https://tws.cnweisou.com/wxapi/index.php?r=wxapp.util.uploader&i=450', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            method: 'POST',
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function (res) {
              var data = res.data
              ss['i'] = res
            }
          })

        }
        that.setData({
          images: that.data.images.concat(tempFilePaths)
        })
        if (that.data.images.length>5){}
      },
    })
  },
  previewImage:function(){
    var that=this;
    wx.previewImage({
      urls: that.data.images
    })
  },
  delete: function (e) {
    var that=this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.images;
    images.splice(index,1);
    that.setData({
      images:images
    })
  },
})
