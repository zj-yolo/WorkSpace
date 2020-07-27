var server = require('../../../utils/server');
var utoken = wx.getStorageSync("utoken");

Page({
	data: {
	},
	onLoad: function(options) {
		utoken = wx.getStorageSync("utoken");
		var that = this;
		server.sendRequest({
			url: '?r=wxapp.activity.bargin',
			data: {
				utoken: utoken
			},
			method: 'GET',
			success: function(res) {
				that.setData({
					data: res.data.result.res					
				})
        if (res.data.result.res) {
          var selfArray=[];
          for (var i in res.data.result.res){
            selfArray.push(res.data.result.res[i]);
          }
						that.setData({
              mid: selfArray[0].mid,
				})
				}
			}
		})
	},
	todetail: function(res) {
		wx.navigateTo({
			url: "/packageA/pages/bargain/detail/index?id=" + res.currentTarget.dataset.id + "&mid=" + res.currentTarget.dataset.mid
		})
	},
	formSubmit: function(res) {
		var that = this;
		server.sendRequest({
			url: '?r=wxapp.activity.bargin',
			data: {
				utoken: utoken,
				keywords: res.detail.value
			},
			method: 'POST',
			success: function(res) {
				that.setData({
					data: res.data.result.res,
				})
			}
		})
	},
})