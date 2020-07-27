// packageA/pages/position/index.js
Page({


    data: {},


    onLoad: function(options) {
        let obj = {
            0: {
                "city": "北京市",
                "N": "39.55",
                "E": "116.24",
                "firststr": "B"
            },
            1: {
                "city": "上海市",
                "N": "31.14",
                "E": "121.29",
                "firststr": "S"
            },
            2: {
                "city": "广州",
                "N": "23.08",
                "E": "113.14",
                "firststr": "G"
            },
            3: {
                "city": "深圳",
                "N": "22.33",
                "E": "114.07",
                "firststr": "S"
            },
            4: {
                "city": "杭州",
                "N": "30.16",
                "E": "120.1",
                "firststr": "H"
            },
            5: {
                "city": "天津市",
                "N": "39.02",
                "E": "117.12",
                "firststr": "T"
            },
            6: {
                "city": "南京",
                "N": "32.03",
                "E": "118.46",
                "firststr": "N"
            },
            7: {
                "city": "苏州",
                "N": "31.19",
                "E": "120.37",
                "firststr": "S"
            },
            8: {
                "city": "无锡",
                "N": "31.34",
                "E": "120.18",
                "firststr": "W"
            },
            9: {
                "city": "合肥",
                "N": "31.52",
                "E": "117.17",
                "firststr": "H"
            },
            10: {
                "city": "济南",
                "N": "36.4",
                "E": "117",
                "firststr": "J"
            },
            11:{
                "city": "石家庄",
                "N": "38.02",
                "E": "114.3",
                "firststr": "S"
            },
            12: {
                "city": "青岛",
                "N": "36.03",
                "E": "120.18",
                "firststr": "Q"
            },
            13: {
                "city": "太原",
                "N": "37.54",
                "E": "112.33",
                "firststr": "T"
            },
            14: {
                "city": "宁波",
                "N": "29.52",
                "E": "121.33",
                "firststr": "N"
            },
            15: {
                "city": "南通",
                "N": "32.01",
                "E": "120.51",
                "firststr": "N"
            }
        };
        let that = this;

        that.setData({
          obj:obj
        })

    },
    toCity:function(e){
      console.log(e.currentTarget.dataset.addr);
       console.log(e.currentTarget.dataset.lat);
        console.log(e.currentTarget.dataset.lng);
        let position={
          addr:e.currentTarget.dataset.addr,
          lat:e.currentTarget.dataset.lat,
          lng:e.currentTarget.dataset.lng,
          city:e.currentTarget.dataset.addr
        }
          wx.setStorageSync("position", position);
          wx.navigateBack({
            delta:1
          })

    }

})