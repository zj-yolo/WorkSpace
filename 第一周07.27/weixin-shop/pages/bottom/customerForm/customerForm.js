var that;
var server = require("../../../utils/server");
var utoken = wx.getStorageSync("utoken");
var imgs = {};
var values = {};
Page({
  data: {
    showType: false,
    region: ["北京市", "北京市", "东城区"],
    images:{},
    values:{},
    ValueLists:{},
    areaIndex: 0,
    issunmbit: true,
    diydataList: [],
    ismoreImg: true,
    id:'',
    currImgIndex:'',
    timeSlot:''
  },
   onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
     },
  onLoad: function(options) {
    that = this;
    that.setData({
      id: options.id
    });
    var T = new Date();
    var y = T.getFullYear();
    var m = T.getMonth() + 1;
    var d = T.getDate();
    var h = T.getHours();
    var ms = T.getMinutes();
    if (m < 10) {
      m = "0" + m;
    }
    if (d < 10) {
      d = "0" + d;
    }
    if (h < 10) {
      h = "0" + h;
    }
    if (ms < 10) {
      ms = "0" + ms;
    }
    var v = new Date(Date.now() + 86400000 * 1);
    var ny = v.getFullYear();
    var nm = v.getMonth() + 1;
    var nd = v.getDate();
    var nms = T.getMinutes();
    if (nm < 10) {
      nm = "0" + nm;
    }
    if (nd < 10) {
      nd = "0" + nd;
    }
    if (nms < 10) {
      nms = "0" + nms;
    }
    that.setData({
      Startdate: y + "-" + m + "-" + d,
      Enddate: ny + "-" + nm + "-" + nd,
      Nowdate: y + "-" + m + "-" + d,
      appointmentTime: y + "-" + m + "-" + d
    });
    var stratEndTime = {};
    stratEndTime.Startdate = that.data.Startdate;
    stratEndTime.Enddate = that.data.Enddate;
    that.setData({
      stratEndTime: stratEndTime
    });
     this.getCurList();
  },

  onShow(){
   
  },
  onUnload: function () {
    var that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    if (extConfig.tabBarPage) {
      var tabBarPage = extConfig.tabBarPage;
      for (var i in tabBarPage) {
        if (tabBarPage[i] == '/pages/customerForm/customerForm') {
          that.setData({
            id:''
          })
        }
      }
    }
  },

    getCurList(){
      var utoken = wx.getStorageSync("utoken");
      var that =this;
      server.sendRequest({
        url: '?r=wxapp.diyform.diyform&utoken=' + utoken + '&id=' + that.data.id,
        method: "GET",
        success: function(res) {
          if (res.data.result) {
            that.setData({
              dfieldsList: res.data.result.dfields,
              dfieldsListSubmit: res.data.result.dfields,
              id: res.data.result.id,
              img: res.data.result.img,
              title: res.data.result.title
            });
            for (var a in that.data.dfieldsList) {
              that.data.dfieldsList[a].title = "";
              that.setData({
                dfieldsList: that.data.dfieldsList
              });
  
              if (that.data.dfieldsList[a].data_type == 8) {
              
                /*
                default_btime
                default_etime
                */
                var stratEndTimeCurr = {};
                stratEndTimeCurr.Startdate = that.data.Startdate;
                stratEndTimeCurr.Enddate = that.data.Enddate;
                if (that.data.dfieldsList[a].default_etime_type == 2 && that.data.dfieldsList[a].default_btime_type == 1) {
                  stratEndTimeCurr.Enddate = that.data.dfieldsList[a].default_etime;
                  that.data.dfieldsList[a].stratEndTime = stratEndTimeCurr;

                } else if (that.data.dfieldsList[a].default_etime_type == 1 && that.data.dfieldsList[a].default_btime_type == 2){
                  stratEndTimeCurr.Startdate = that.data.dfieldsList[a].default_btime;
                  that.data.dfieldsList[a].stratEndTime = stratEndTimeCurr;

                } else if (that.data.dfieldsList[a].default_etime_type == 2 && that.data.dfieldsList[a].default_btime_type == 2){
                  stratEndTimeCurr.Enddate = that.data.dfieldsList[a].default_etime;
                  stratEndTimeCurr.Startdate = that.data.dfieldsList[a].default_btime;
                  that.data.dfieldsList[a].stratEndTime = stratEndTimeCurr;

                } else if (that.data.dfieldsList[a].default_etime_type == 1 && that.data.dfieldsList[a].default_btime_type == 1) {
                  that.data.dfieldsList[a].stratEndTime = that.data.stratEndTime;
                }
                that.setData({
                  dfieldsList: that.data.dfieldsList,
                  timeSlot: that.data.dfieldsList[a].index
                });
              } else if (that.data.dfieldsList[a].data_type == 7) {
                if (that.data.dfieldsList[a].default_time_type == 2){
                  that.data.dfieldsList[a].appointmentTime =
                    that.data.dfieldsList[a].default_time
                 }else{
                  that.data.dfieldsList[a].appointmentTime =
                    that.data.appointmentTime;
                 }

                that.setData({
                  dfieldsList: that.data.dfieldsList
                });
              } else if (that.data.dfieldsList[a].data_type == 9) {
                that.data.dfieldsList[a].region = that.data.region;
                that.setData({
                  dfieldsList: that.data.dfieldsList
                });
              } else if (that.data.dfieldsList[a].data_type == 2) {
                that.data.dfieldsList[a].showType = that.data.showType;
                that.setData({
                  dfieldsList: that.data.dfieldsList
                });
              } else if (that.data.dfieldsList[a].data_type == 5) {
                that.data.dfieldsList[a].images = that.data.images;
                that.data.dfieldsList[a].ValueLists = that.data.ValueLists;
                that.setData({
                  dfieldsList: that.data.dfieldsList,
                });
              }
            }
          }
        }
      });
    },

  
  titleBlock: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.data.dfieldsList[index].title = "";
    that.setData({
      dfieldsList: that.data.dfieldsList
    });
  },
  title: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.data.dfieldsList[index].title = "block";
    that.setData({
      dfieldsList: that.data.dfieldsList
    });
  },

  pname: function(e) {
    that = this;
    var currId = e.target.dataset.id;
    var pname = e.detail.value;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 0) {
        if (i == currId) {
          that.data.dfieldsList[i].myCont = e.detail.value;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
    if (pname) {
      that.setData({
        pname: pname
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "信息填写错误",
        success: function(res) {
          if (res.confirm) {
            that.setData({
              pname: ""
            });
          } else if (res.cancel) {
            that.setData({
              pname: ""
            });
          }
        }
      });
    }
  },
  phoneChange: function(e) {
    that = this;
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 0) {
        if (i == currId) {
          var phone = e.detail.value;
          if (/^1[34578]\d{9}$/.test(phone)) {
            that.setData({
              phone: phone
            });
          } else {
            wx.showModal({
              title: "提示",
              content: "信息填写错误",
              success: function(res) {
                if (res.confirm) {
                  that.setData({
                    phone: ""
                  });
                } else if (res.cancel) {
                  that.setData({
                    phone: ""
                  });
                }
              }
            });
          }

          that.data.dfieldsList[i].myCont = that.data.phone;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },

  idNumber: function(e) {
    that = this;
    var idNumber = e.detail.value;
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 6) {
        if (i == currId) {
          if (/^\d{17}(\d|x)$/i.test(idNumber)) {
            that.setData({
              idNumber: idNumber
            });
          } else {
            wx.showModal({
              title: "提示",
              content: "信息填写错误",
              success: function(res) {
                if (res.confirm) {
                  that.setData({
                    idNumber: ""
                  });
                } else if (res.cancel) {
                  that.setData({
                    idNumber: ""
                  });
                }
              }
            });
          }
          that.data.dfieldsList[i].idNumber = that.data.idNumber;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },

  areaCont: function(e) {
    that = this;
    var cont = e.detail.value;
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 1) {
        if (i == currId) {
          that.data.dfieldsList[i].myArea = e.detail.value;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
    that.setData({
      cont: cont
    });
  },
  checkboxChange: function(e) {
    var that = this;
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 3) {
        if (i == currId) {
          that.data.dfieldsList[i].myOption = e.detail.value;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },

  selectArea: function(e) {
    that = this;
    that.setData({
      areaIndex: e.detail.value
    });
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 2) {
        if (i == currId) {
          that.data.dfieldsList[i].areaIndex = that.data.areaIndex;
          that.data.dfieldsList[i].selectArea =
            that.data.dfieldsList[i].tp_text[
              that.data.dfieldsList[i].areaIndex
            ];
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },

  bindRegionChange: function(e) {
    var that = this;
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 9) {
        if (i == currId) {
          that.data.dfieldsList[i].region = e.detail.value;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },
  chooseImage: function(e) {
    var that = this;
    let selfIndex = e.currentTarget.dataset.selfindex;
    let tp_max = e.currentTarget.dataset.tp_max;
    that.setData({
      currImgIndex: selfIndex
    })
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url:
            "https://tws.cnweisou.com/wxapi/index.php?r=order.refund.upload_img&utoken=" + utoken,
          filePath: tempFilePaths[0],
          name: "file",
          success: function(res) {
            var data = JSON.parse(res.data);
            imgs[selfIndex] = [];
            values[selfIndex] = [];
            if (typeof that.data.images[selfIndex] !='undefined'){
               imgs[selfIndex] = that.data.images[selfIndex];
            }
            if (typeof that.data.ValueLists[selfIndex] != 'undefined') {
              values[selfIndex] = that.data.ValueLists[selfIndex];
            }
             imgs[selfIndex].push(data.result.url);
             values[selfIndex].push(data.result.value);
            if (
              imgs[selfIndex].length > tp_max ||
              values[selfIndex].length > tp_max
            ) {
              wx.showToast({
                title: "超过上传图片数量",
                icon: "success",
                duration: 2000
              });
              imgs[selfIndex].splice(tp_max, 1);
              values[selfIndex].splice(tp_max, 1);

              that.setData({
                images: imgs,
                ValueLists: values
              });
            } else {
              that.setData({
                images: imgs,
                ValueLists: values
              });
            }
             var currId = e.target.dataset.id;
            for (var i in that.data.dfieldsList) {
              if (that.data.dfieldsList[i].data_type == 5) {
                if (i == currId) {
                  that.data.dfieldsList[i].images = that.data.images;
                  that.data.dfieldsList[i].ValueLists = that.data.ValueLists;
                    
                  that.setData({
                    dfieldsList: that.data.dfieldsList,
                    previewImage: that.data.dfieldsList[i].images,
                    thisI: i
                  });
                }
              }
            }
          }
        });
      },
      fail:function(){
       that.setData({
        dfieldsList:that.data.dfieldsList
       })
      }
    });
  },
  // 预览图片
  previewImage: function(e) {
    var that = this;
    let selfIndex = e.currentTarget.dataset.selfindex;
    let selfId = e.currentTarget.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 5) {
        if (i == that.data.thisI) {
          wx.previewImage({
            current: that.data.dfieldsList[i].images[selfIndex][selfId],
            urls: that.data.dfieldsList[i].images[selfIndex]
          });
        }
      }
    }
  },
  // 删除图片
  delete: function(e) {
    var that = this;
      let selfIndex = e.currentTarget.dataset.selfindex;
      let selfId = e.currentTarget.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 5) {
        if (i == that.data.thisI) {
          var images = that.data.dfieldsList[i].images;
          var ValueLists = that.data.dfieldsList[i].ValueLists;
          images[selfIndex].splice(selfId, 1);
          ValueLists[selfIndex].splice(selfId, 1);
          that.setData({
            images: images,
            ValueLists: ValueLists
          });
          that.data.dfieldsList[i].images = that.data.images;
          that.data.dfieldsList[i].ValueLists = that.data.ValueLists;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },

  // 预约时间
  appointment: function(e) {
    that = this;
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 7) {
        if (i == currId) {
          this.setData({
              appointmentTime: e.detail.value
            });

          that.data.dfieldsList[i].appointmentTime = that.data.appointmentTime;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },
  //选择时间
  changeStartDate: function(e) {
    that = this;
    var currId = e.target.dataset.id;
    that.setData({
      timeSlot: e.currentTarget.dataset.name
    })

    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 8) {
        if (i == currId) {
          that.setData({
              Startdate: e.detail.value
            });
          that.data.dfieldsList[i].stratEndTime.Startdate = that.data.Startdate;

          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },

  changeEndDate: function(e) {
    var that = this;
    that.setData({
      timeSlot: e.currentTarget.dataset.name
    })
    var currId = e.target.dataset.id;
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].data_type == 8) {
        if (i == currId) {
          this.setData({
              Enddate: e.detail.value
            });
          that.data.dfieldsList[i].stratEndTime.Enddate = that.data.Enddate;
          that.setData({
            dfieldsList: that.data.dfieldsList
          });
        }
      }
    }
  },

  formResetAll: function() {},

  formSubmitAll: function() {
    that = this;
    server.getUserInfo(function(){
    var list = [];
    for (var i in that.data.dfieldsList) {
      if (that.data.dfieldsList[i].tp_must == 1) {
        if (that.data.dfieldsList[i].data_type == 0) {
          if (!that.data.dfieldsList[i].myCont) {
            list.push(false);
          } else {
            list.push(true);
          }
        }
        if (that.data.dfieldsList[i].data_type == 1) {
          if (!that.data.dfieldsList[i].myArea) {
            list.push(false);
          } else {
            list.push(true);
          }
        }

        if (that.data.dfieldsList[i].data_type == 2) {
          if (!that.data.dfieldsList[i].selectArea) {
            list.push(false);
          } else {
            list.push(true);
          }
        }
        if (that.data.dfieldsList[i].data_type == 3) {
          if (!that.data.dfieldsList[i].myOption) {
            list.push(false);
          } else {
          }
        }
        if (that.data.dfieldsList[i].data_type == 5) {
          if (typeof that.data.dfieldsList[i].ValueLists=='object' && that.data.dfieldsList[i].ValueLists.length==0) {
            list.push(false);
          } else {
            list.push(true);
          }
        }
        if (that.data.dfieldsList[i].data_type == 6) {
          if (!that.data.dfieldsList[i].idNumber) {
            list.push(false);
          } else {
            list.push(true);
          }
        }

        if (that.data.dfieldsList[i].data_type == 7) {
          if (!that.data.dfieldsList[i].appointmentTime) {
            list.push(false);
          } else {
            list.push(true);
          }
        }

        if (that.data.dfieldsList[i].data_type == 8) {
          if (
            !that.data.dfieldsList[i].stratEndTime.Startdate &&
            that.data.dfieldsList[i].stratEndTime.Enddate
          ) {
            list.push(false);
          } else {
            list.push(true);
          }
        }
        if (that.data.dfieldsList[i].data_type == 9) {
          if (!that.data.dfieldsList[i].region) {
            list.push(false);
          } else {
            list.push(true);
          }
        }
      }
    }
    var falseList = [];
    for (var x in list) {
      if (list[x] == false) {
        falseList.push(list[x]);
      }
    }
    if (falseList.length == 0) {
      that.setData({
        issunmbit: true
      });
    } else {
      that.setData({
        issunmbit: ""
      });
    }
    if (that.data.issunmbit) {
      var listObj = [];
      var newArray = [];
      for (var t in that.data.dfieldsList) {
        switch (that.data.dfieldsList[t].data_type) {
          case "0":
            that.data.dfieldsListSubmit[t] = that.data.dfieldsList[t].myCont;
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
            break;
          case "1":
            that.data.dfieldsListSubmit[t] = that.data.dfieldsList[t].myArea;
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
            break;
          case "2":
            that.data.dfieldsListSubmit[t] =
              that.data.dfieldsList[t].selectArea;
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
            break;
          case "3":
            that.data.dfieldsListSubmit[t] = that.data.dfieldsList[t].myOption;
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
            break;
          case "5":
            that.data.dfieldsListSubmit[t] =
              that.data.dfieldsList[t].ValueLists[that.data.dfieldsList[t].index];

            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
            break;
          case "6":
            that.data.dfieldsListSubmit[t] = that.data.dfieldsList[t].idNumber;
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
            break;
          case "7":
            that.data.dfieldsListSubmit[t] =
              that.data.dfieldsList[t].appointmentTime;
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
    

            break;
          case "8":
            var timeList = [];
            that.data.dfieldsListSubmit["_0"] =
              that.data.dfieldsList[t].stratEndTime.Startdate;
            that.data.dfieldsListSubmit["_1"] =
              that.data.dfieldsList[t].stratEndTime.Enddate;
            delete that.data.dfieldsListSubmit[t];
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });
            break;
          case "9":
            that.data.dfieldsListSubmit[t] = that.data.dfieldsList[t].region;
            that.setData({
              dfieldsListSubmit: that.data.dfieldsListSubmit
            });

            break;
        }
      }
     
      var indexArray = [];
      for (var z in that.data.dfieldsList) {
        indexArray.push(that.data.dfieldsList[z].index);
      }
      var alls = {};
      for (var r in that.data.dfieldsListSubmit) {
        if (r.indexOf('_')!=-1){
          alls[that.data.timeSlot+r] = that.data.dfieldsListSubmit[r]
        }else{
          alls[indexArray[r]] = that.data.dfieldsListSubmit[r];
          if (alls[indexArray[r]] == undefined) {
            alls[indexArray[r]] = "";
          }
        }
       
    
      }

      var utoken = wx.getStorageSync("utoken");
      server.sendRequest({
        url:
          "?r=wxapp.diyform.diyform.submit&utoken=" +
          utoken +
          "&diyformid=" +
          that.data.id,
        data: {
          diydata: alls
        },
        showToast: false,
        method: "post",
        success: function(res) {

          wx.showModal({
            title: "提示",
            content: "提交成功",
            showCancel:false,
            success: function(res) {
                wx.navigateTo({
                  url: "/packageA/pages/customerForm/formSuccess/formSuccess"
                });
            },
            complete:function(){
            }
          });
       
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "请填写带*的必填项",
        success: function(res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      });
    }
   })
  },
  returnIndex: function() {
    var that = this;
    that.setData({
      isError: false
    });
  },
  joinAgain: function() {
    wx.redirectTo({
      url: "/packageA/pages/customerForm/formSuccess/formSuccess"
    });
  }
});
