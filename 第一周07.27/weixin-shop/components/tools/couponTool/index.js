const server = require('../../../utils/server.js')
Component({
  properties: {},
  externalClasses: ['my-class'], //引入外部样式类
  data: {
    couponList:{}
  },
  attached(){
    this.loadCoupon();
  },
  methods: {
    loadCoupon(){
      server.sendRequest({
        url: '?r=wxapp.sale.coupon.getlist',
        data: {
          comefrom: "goodsdetail"
        },
        success: res=>{
          if(res.data.status==1){
              this.setData({
                couponList:res.data.result.list
              })
          }else{
            console.log('获取失败')
          }
        }
      });
    },
    receiveCoupon(e){
    let id = e.currentTarget.dataset.id;
    let utoken = wx.getStorageSync('utoken');
    server.getUserInfo(() => {
      server.sendRequest({
        url: '?r=wxapp.sale.coupon.detail.pay',
        data: {
          utoken,
          id,
          jie: 1
        },
        method: 'GET',
        success: res => {
          if (res.data.status == 1) {
            server.sendRequest({
              url: '?r=wxapp.sale.coupon.detail.payresult',
              data: {
                utoken: utoken,
                logid: res.data.result.logid
              },
              method: 'GET',
              success: function (res) {
                wx.showToast({
                  title: '领取成功',
                  icon: 'none',
                })
				
				setTimeout(()=>{ wx.hideToast();},1500);
              },
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
			setTimeout(()=>{ wx.hideToast();},1500);
          }
        }
      })
    })
    }
  }
})
