var server = require('../../../utils/server');
Page({
  data:{
      loading:true
  },
	onLoad: function (options) {
		var that =this;
		that.loadPageData();
		that.mapCtx = wx.createMapContext('myMap');
	},   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
	loadPageData:function() {
		var that= this;
		server.sendRequest({
		url: '?r=wxapp.member.aboutus',
		method: 'GET',
    showToast:false,
		success:function(res){
      that.setData({
        loading: false
      })
      if (res.data.result.tel != null && res.data.result.tel != ''){
        if (res.data.result.tel.indexOf(',') > 0) {
          res.data.result.tel = res.data.result.tel.split(',');
          console.log(res.data.result.tel);
        } else {
          var tel = res.data.result.tel;
          res.data.result.tel = [];
          res.data.result.tel.push(tel);
        }
      }
      var con = res.data.result.con;
      res.data.result.con=con.split('\r');    
  			that.setData({
				data:res.data.result,
				markers:[{
				  id: 0,
			      latitude: res.data.result.map1,
			      longitude: res.data.result.map2,
			      width: 50,
			      height: 50,
			      title:res.data.result.address
				}]
			})
      console.log(that.data.data)
		}
	})
	},
		
});