var cacheChatLogs = {
  count: 100,//最大保存聊天记录条数
  save: function (uid, chat) {
    var chatLogs = this.getLogs(uid);
    var chats;
    try{
     chats =  wx.getStorageSync("chatLogs");
     if(chats){
       chats = JSON.parse(chats);
     }else if(chats==""){
       chats = {};
     }
    }catch (e){
      var chats = {};     
    }
    chatLogs = chats[uid] || [];
    if (chatLogs.length >= this.count) {
      chatLogs.shift();
      chatLogs.push(chat);
      chats[uid] = chatLogs;
      wx.setStorageSync("chatLogs", JSON.stringify(chats));
      return true;
    } else {
      chatLogs.push(chat);
      chats[uid] = chatLogs;
      wx.setStorageSync("chatLogs", JSON.stringify(chats));
      return true;
    }
    return false;
  },
  getLogs: function (uid) {
    var chats;
    try{
      chats = wx.getStorageSync("chatLogs");
      if (chats){
        chats = JSON.parse(chats);
      } else if (chats == "") {
        chats = {};
      }
    }catch(e){
      chats = {};
    }
    return chats[uid] || false;
  }
}

module.exports = cacheChatLogs;


// 聊天记录保存格式
/*
{
  "10056":[
    {
      fromUser:"56894",
      toUser:"56434",
      text:"abcdefg"
    },
     {
      fromUser:"56894",
      toUser:"56434",
      text:"abcdefg"
    }
  ],
  "10067":[
    {
      fromUser:"56894",
      toUser:"56434",
      text:"abcdefg"
    }
  ]
}
*/