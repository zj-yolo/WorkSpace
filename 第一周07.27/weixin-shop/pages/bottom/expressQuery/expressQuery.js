var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");
Page({
  data: {
    array: [],
    index: 0,
    company:'',
    expressArray:[],
    expressresult:false,
    resultList:{},
    searchSubmit:false
  },
  onLoad:function(e){
    var that=this;
    server.sendRequest({
      url:'?r=wxapp.express.getExpressList',
      data: {
        utoken: utoken
      },
      method: 'GET',
      success:function(res){
        var array=res.data.result;
        var selfarray=[];
        var expressArray=[];
        for(var i=0;i<array.length;i++){
          selfarray.push(array[i].name)
        }
        for (var i = 0; i < array.length; i++) {
          expressArray.push(array[i].express)
        }
      that.setData({
        array: selfarray,
        company: expressArray[0],
        expressArray: expressArray,
        searchSubmit: false
      })
      }
    })
  },
  //获取订单号
  getOrderNum: function (e) {
    var value = e.detail.value;
    this.setData({
      ordernum: value
    });
  },
  //获取物流公司
  bindPickerChange: function (e) {
    var that=this;
    this.setData({
      index: e.detail.value,
      company: that.data.expressArray[e.detail.value],
    })
  },
  //点击查询按钮
  search: function (e) {
    var that = this;
    var ordernum = that.data.ordernum;
    var company = that.data.company;
    var utoken = wx.getStorageSync("utoken");
    if (!ordernum) {
      server.showModal({ content: '请输入订单号！' });
      return;
    }
    server.sendRequest({
      url: '?r=wxapp.express',
      data: {
        utoken: utoken,
        express: company,
        expresssn: ordernum,
      },
      method: 'POST',
      success: function (res) {
        var resultList = res.data.result;
        if (resultList != ''){
          that.setData({
            resultList: resultList,
            expressresult: true,
            searchSubmit:true
          })
        }else{
          that.setData({
            expressresult: false,
            searchSubmit:true
          })
        } 
        console.log(resultList);
      }
    })
  },
})
