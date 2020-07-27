var that = '';
var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
var cPage = 1;
Page({
  data: {
    myQuesAll: [],
    areaCont: '',
  },
  onLoad: function (options) {
    that = this;
    server.sendRequest({
       url: '?r=order.question.my_question&utoken=' + utoken,
       method: 'GET',
       success: function (res) {
         if (res.data.result){
           that.setData({
             myQuesAll: res.data.result,         
           });
         } 
       }
 
     })
  },
  onShow: function () {
    that = this;
    server.sendRequest({
      url: '?r=order.question.my_question&utoken=' + utoken,
      method: 'GET',
      success: function (res) {

        if (res.data.result) {
          that.setData({
            myQuesAll: res.data.result,
          });
        }
      }
    })
  },
  bindinputCont: function (e) {
    that = this;
    that.setData({
      areaCont: e.detail.value
    })
  },
  bindFormSubmit: function () {
    that = this;
    server.sendRequest({
      url: '?r=order.question.ask&utoken=' + utoken,
      data: {
        question: that.data.areaCont
      },
      method: 'POST',
      success: function (res) {
        server.sendRequest({
          url: '?r=order.question.my_question&utoken=' + utoken,
          method: 'GET',
          success: function (res) {
            that.setData({
              myQuesAll: res.data.result,
            });
            that.setData({
              areaCont: ''
            })
          }
        })
      }
    })
  },
  joinQues: function (e) {
    that = this;
    var currIndex = e.currentTarget.dataset.index
    var currId = that.data.myQuesAll[currIndex].id
    wx.navigateTo({
      url: '../myQuestion/myQuestion?id=' + currId,
    })
  },
  everyComp: function () {
    wx.navigateTo({
      url: '../complaintEvery/complaintEvery',
    })
  },
  onPullDownRefresh: function () {
    that = this;
    server.sendRequest({
      url: '?r=order.question.my_question&utoken=' + utoken,
      method: 'GET',
      success: function (res) {
        if (res.data.result) {
          that.setData({
            myQuesAll: res.data.result,
          });
        }
      }
    })
  },
})
