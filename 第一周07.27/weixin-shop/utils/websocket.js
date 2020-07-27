module.exports = function() {
    this.socketTimeId;
    this.connectNum = 0;
    var that = this;
    this.closeConnect = false; //是否为手动关闭连接
    this.socketConnectType = false;
    //创建websocket连接
    this.connect = function() {
        wx.connectSocket({
            url: 'wss://newsocket.cnweisou.net',
            data: {
                x: '',
                y: ''
            },
            header: {
                'content-type': 'application/json'
            },
            method: "GET",
            complete: function(res) {
                console.log('---inmol-----')
                console.log(res)
            }
        });
    }
    //连接打开后的事件
    this.onOpen = function(callback) {
        wx.onSocketOpen(function(res) {
            clearInterval(that.socketTimeId);
            that.connectNum = 0;
            that.socketConnectType = true;
            // console.log('WebSocket连接已打开！');
            callback();
        });
    }
    //关闭连接
    this.close = function() {
        that.closeConnect = true;
        wx.closeSocket();
        // console.log("关闭连接！");
    }
    //连接服务器
    this.connect();
    //创建连接打开事件
    this.onOpen(function() {});
    //连接关闭后的事件
    wx.onSocketClose(function(res) {
        // console.log(res);
        // console.log('WebSocket 已关闭！');
        that.socketConnectType = false;
        if (that.closeConnect) {
            return false;
        }
        // 断线重连
        that.socketTimeId = setInterval(function() {
            that.connectNum++;
            if (that.connectNum >= 20) {
                clearInterval(that.socketTimeId);
                return false;
            } else {
                // console.log("重连次数: " + that.connectNum);
                that.connect();
            }
        }, 3000);
    });
    this.send = function(data) {
        var data = data;
        let status = 1;
        // console.log("发送信息");
        // console.log(data);
        wx.sendSocketMessage({
            data: JSON.stringify(data),
            success: function(e) {
                console.log("信息发送成功");
                console.log(e);
                status=1;
            },
            fail(e) {
                  console.log("信息发送失败");
                console.log(e);
                status=2
            }
        })
        return status;
    }
    this.onMessage = function(callback) {
        wx.onSocketMessage(function(res) {
            console.log("收到服务器消息");
            console.log(res);
         

            var message;

            if (res.data == 'action call  not found') {
                return ;
            } else {
                message = JSON.parse(res.data);
                  console.log(message);
                callback(message);
            }
        })

    }
    this.socketType = function() {
        if (!that.socketConnectType) {
            wx.showModal({
                title: '提示',
                content: '升级中',
                showCancel: false,
                success: function() {
                    wx.navigateBack({
                        delta: 1
                    });
                }
            })
        }
    }
    wx.onNetworkStatusChange(function(res) {
        if (res.isConnected) {
            that.connect();
            that.closeConnect = true;
        } else {
            that.close();
        }
    });
}