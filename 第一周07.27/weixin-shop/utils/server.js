var liu_data = require('./data.js');
module.exports = {
  liu_data: liu_data.liu_data,
  //小程序验证
  setLog: function (utoken) {
    var that = this;
    if (utoken == '' || utoken == undefined) {
      that.getNewToken(function (u) {
        that.setLog(u);
      })
    } else {
      //验证session是否过期
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          that.sendRequest({
            url: '?r=wxapp.logs',
            showToast: false,
            data: {
              utoken: utoken
            },
            method: 'GET',
            success: function (res) {
              if (res.data.status == -1) {
                that.getNewToken(function (u) {
                  that.setLog(u);
                })
              } else {
                that.globalData.userInfo = res.data;
                that.globalData.utoken = res.data.token;
                wx.setStorageSync("utoken", res.data.token);
                that.globalData.login = true;
              }
            }
          })
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
            if (utoken == '' || utoken == undefined) {
          that.getNewToken(function (u) {
            that.setLog(u);
          })
        }
        }
      })
    }
  },
  //注册会员返回新的token
  getNewToken: function (cb) {
    let that = this
    let utoken = wx.getStorageSync("utoken");
    wx.login({
      success: function (res) {
        let code = res.code;
        that.sendRequest({
          url: '?r=wxapp.logs.slogin',
          data: {
            code: code
          },
          method: 'POST',
          success: function (res) {
            var midXzx = wx.getStorageSync("mid");
            if (!res.data) {
              return
            }
            if (res.data.status == 1) {
              utoken = res.data.result.utoken;
              //写入数据
              wx.setStorageSync("utoken", utoken);
              wx.setStorageSync("uid", res.data.result.uid);
              that.globalData.login = true;
              if (midXzx) {
                that.sendRequest({
                  method: 'POST',
                  url: '?r=wxapp.commission.register&utoken=' + utoken + '&mid=' + midXzx,
                  data: {},
                  success: function (res) {
                  }
                })
              }
              typeof cb == "function" && cb(utoken)
              return;
            } else if (res.data.status == -1) {

              return;
            } else if (res.data.status == -10) {

              return;
            } else {

              return;
            }
          }
        })
      }
    })
  },
  //获取会员信息
  getUserInfo: function (cb) {
    var that = this
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo'] !== true) {
          wx.navigateTo({
            url: '/pages/getAuth/index',
          })
        } else {
          if (typeof cb == 'function') {
            cb();
          }
        }
      }
    })
  },
  globalData: {
    'userInfo': null,
    'utoken': null,
    'login': false
  },
  //跳转
  getToPage: function (url, isRedirect) {

    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    if (extConfig.tabBarPage) {
      var tabBarPage = extConfig.tabBarPage;
      var url = url.currentTarget.dataset.link;
      if (url) {
        var arr = url.split('?');
        if (tabBarPage.indexOf(arr[0]) != -1) {
          wx.reLaunch({
            url: url
          });
          return;
        }
      }
      if (!isRedirect) {
        wx.navigateTo({
          url: url
        });
      } else {
        wx.redirectTo({
          url: url
        });
      }
    } else {
      var url = url.currentTarget.dataset.link;
      wx.navigateTo({
        url: url
      });
    }
  },
  //重写Request方法
  sendRequest: function (param, customSiteUrl) {
    var that = this,
      data = param.data || {},
      header = param.header,
      requestUrl,
      showToast = param.showToast == undefined ? true : false;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    let uniacid = extConfig.uniacid;

    if (customSiteUrl) {
      if (customSiteUrl.indexOf('insertCard') > -1) {
        requestUrl = customSiteUrl + param.url;
      } else if (customSiteUrl.indexOf('5g-center') > -1) {
        requestUrl = customSiteUrl + param.url + "?i=" + uniacid;
      } else {
        requestUrl = customSiteUrl + param.url + "?i=" + uniacid;
      }
    } else {
      requestUrl = liu_data.liu_data.host_url + param.url + "&i=" + uniacid;
    }

    if (param.method) {
      if (param.method.toLowerCase() == 'post') {
        data = that.modifyPostParam(data); //格式化参数
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      }
      param.method = param.method.toUpperCase();
    }
    if (showToast) {
      // that.showToast({
      //   title: '读取中...',
      //   icon: 'loading',
      //   duration: 3000
      // });
    }
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode && res.statusCode != 200) {
          if (param.url.indexOf('addFormIdCard')>-1) {
            return;
          }
          // that.hideToast();
          //   wx.hideToast();
          that.showModal({
            content: '' + res.errMsg
          });
          return;
        }
        typeof param.success == 'function' && param.success(res);
        // wx.hideToast()
      },
      fail: function (res) {
        // that.showModal({ content: '网络异常，请检查您的网络! ' })
        that.showToast({
          title: '玩命加载中...',
          icon:'loading',
          duration: 2000
        });
        typeof param.fail == 'function' && param.fail(res);
        // 监视网络变化
        wx.onNetworkStatusChange(function (res) {
          if (res.isConnected) {
            //重新发起请求
            that.sendRequest(param, customSiteUrl);
          }
        });
        return false;
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    });
  },
  modifyPostParam: function (obj) {
    let query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  },
  showModal: function (param) {
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function (res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  //读取进度 显示消息提示框
  showToast: function (param) {
    if (param.icon) {
      wx.showToast({
        title: param.title,
        icon: param.icon,
        duration: param.duration || 1500,
        success: function (res) {
          typeof param.success == 'function' && param.success(res);
        },
        fail: function (res) {
          typeof param.fail == 'function' && param.fail(res);
        },
        complete: function (res) {
          typeof param.complete == 'function' && param.complete(res);
        }
      })
    } else {
      wx.showToast({
        title: param.title,
        image: param.image,
        duration: param.duration || 1500,
        success: function (res) {
          typeof param.success == 'function' && param.success(res);
        },
        fail: function (res) {
          typeof param.fail == 'function' && param.fail(res);
        },
        complete: function (res) {
          typeof param.complete == 'function' && param.complete(res);
        }
      })
    }
  },
  // 数据上报方法
  reportedData(tablename, content) {
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {},uniacid = extConfig.uniacid, uid = wx.getStorageSync('uid');
    if (typeof content != 'string') {
      content['uid'] = uid ? uid : '';
      content['uniacid'] = uniacid ? uniacid : '';
      content = JSON.stringify(content);
    }
    this.sendRequest({
      url: "",
      method: 'post',
      data: {
        tablename,
        content
      }

    }, 'https://report.cnweisou.net/api/home/insertCard')
  },
  getsec(){
    return (Date.parse(new Date())/1000);
  },
  sceneToParams(scene) {
    let url = decodeURIComponent(scene);
    let sceneArr = url.split("&");
    let sceneObj = {};
    for (let $key in sceneArr) {
      if (typeof sceneArr[$key] === 'string' && sceneArr[$key].indexOf('=') >= 0) {
        let parameObj = sceneArr[$key].split('=');
        sceneObj[parameObj[0]] = parameObj[1];
      } else {
        continue;
      }
    }
    return sceneObj;
  },
}