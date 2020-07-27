const mapdata = require('../../../utils/map')
Component({
  properties: {
    pageData: Object
  },
  data: {
    maplist: [],
    imformationMouth: '',
    imformationDay: '',
    showsearchIcon: true,
    mapshowless: [],
    mapshowmany: [],
    showmap:true
  },
  attached() {
    let reg = new RegExp("省");
    //处理区域值
    let allArea = this.properties.pageData.enterprise_area;
    console.log(allArea)
    let data = allArea.filter(x => x.pid != 0); //通过过滤区域来显示二级省市
    let arr = [];
    if (data && data.length > 0) {
      //匹配接口返回的区域并删除省字
      data.map(item => {
        if (reg.test(item.name)) {
          item.name = item.name.replace(reg, "");
        }
        arr.push(item)
      })
      //组成带有区域图片的数据
      let urlArr = [];
      for (let i = 0; i < arr.length; i++) {
        mapdata.map.forEach(item => {
          if (item.name == arr[i].name) {
            let info = {
              url: item.url,
              id: data[i].id,
              name: data[i].name
            }
            urlArr.push(info)
          }
        })
      }
      this.setData({
        maplist:urlArr.slice(0, 6),
        mapshowmany: urlArr,
        mapshowless: urlArr.slice(0, 6)
      })
    }
    //设置时间：月/日
    let imformationtime = this.properties.pageData.shopinfo && this.properties.pageData.shopinfo.information && this.properties.pageData.shopinfo.information[0].article_date_v;
    if (imformationtime) {
      let imformationDate = imformationtime.split('-');
      this.setData({
        imformationMouth: imformationDate[1],
        imformationDay: imformationDate[2]
      })
    }


  },
  methods: {
    handleconfirm(e) {
      wx.navigateTo({
        url: '/pages/goods/list/list?keywords=' + e.detail.value,
      })
    },
    handleshowmore() {
      let data =this.data.mapshowmany;
      this.setData({
        maplist : data,
        showmap:false
      })
    },
    handlehidemore() {
      let data =this.data.mapshowless;
      this.setData({
        maplist : data,
        showmap:true
      })
    },
    toacticle(e) {
      if (e.currentTarget.dataset.type) {
        wx.navigateTo({
          url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type
        })
      }
      if (e.currentTarget.dataset.from) {
        wx.navigateTo({
          url: "/packageA/pages/article/detail/detail?objectId=" + e.currentTarget.dataset.id 
        });
      }
    },
    toareaList(e) {
      if (e.currentTarget.dataset.type) {
        wx.navigateTo({
          url: '/packageA/pages/companyList/index?type=' + e.currentTarget.dataset.type + '&from='+'maptemplate', //加上from区别
        })
      } 
    },
    handleinput(e) {
      let showIcon;
      if (e.detail.value.trim().length == 0) {
        showIcon = true;
      } else {
        showIcon = false;
      }
      this.setData({
        showsearchIcon: showIcon
      })
    }
  }
})