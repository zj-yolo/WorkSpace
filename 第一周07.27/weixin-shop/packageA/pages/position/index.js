let server = require('../../../utils/server.js');
let obj = {};
Page({

    data: {

    },

    onLoad: function(e) {
        let that = this;
        obj = e;
        // console.log(e);

        that.loadData(e);


    },
    onShow: function() {
        let that = this;
        let position = wx.getStorageSync("position");
        if (position) {
            that.loadData(position);
        } else {
            that.loadData(obj);
        }
        let CITY =wx.getStorageSync("CITY");
        that.setData({
            CITY:CITY
        })

        wx.getStorageSync("position") ? wx.removeStorageSync("position") : '';
        obj = {};

    },
    loadData: function(obj) {
        let that = this;
        server.sendRequest({
            url: '?r=wxapp.shop.localtion&lat=' + obj.lat + '&lng=' + obj.lng,
            showToast: false,
            that: that,

            method: 'GET',
            success: function(res) {
                console.log(res.data.result.result.pois);
                console.log(res.data.result.result.address_component.city);
                let position = {
                   
                    address: obj.addr,
                    lat: obj.lat,
                    lng: obj.lng
                };
                that.setData({
                   pois: res.data.result.result.pois,
                    position: position,
                    city: obj.city
                });
            }
        })
    },
    bindinput: function(e) {
        console.log(e.detail.value);
        let that = this;


        let str=that.data.city+e.detail.value;
        console.log(str);
        // https://tws.cnweisou.com/wxapi/index.php?r=wxapp.shop.localtion.address&address=深圳市宝安区宝通大厦
         server.sendRequest({
            url: '?r=wxapp.shop.localtion.address',
            showToast: false,
            data:{
              address:str
            },

            method: 'GET',
            success: function(res) {
              console.log(res);
                // console.log(res.data.result.result.pois);
                // console.log(res.data.result.result.address_component.city);
                let 
                    pois=[
                    {title:res.data.result.result.title,
                      location:res.data.result.result.location}]
                      

                    
                   
                
                that.setData({
            
                      pois:pois
                
                  
                });
            }
        })
    },
    toCity: function() {
        wx.navigateTo({
            url: '/packageA/pages/position/select/index'
        })
    },
    getAddr: function(e) {
      let that = this;
      
        // console.log(e.currentTarget.dataset.lat);
        // console.log(e.currentTarget.dataset.lng);
        // console.log(e.currentTarget.dataset.addr);
        let position = {
            address: e.currentTarget.dataset.addr,
            lat: e.currentTarget.dataset.lat,
            lng: e.currentTarget.dataset.lng,
            city:that.data.city
        }
        wx.setStorageSync("position", position);
        wx.navigateBack({
            delta: 1
        })
    }


})