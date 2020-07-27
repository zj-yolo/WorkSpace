var server = require('../../../utils/server');
Page({
    data: {},
    onLoad: function(options) {
        var that = this;
        server.getJSON("/Store/getStoreClass", function(res) {
            var store_class = res.data;
            for (var i = 0; i < store_class.length; i++) {
                if (i == 0) {
                    store_class[i].select = 1;
                    that.getStoreList(store_class[i].sc_id);
                } else {
                    store_class[i].select = 0;
                }
            }
            that.setData({ store_class: store_class });
        });
    },
    getStoreList: function(sc_id) {
        var that = this;
        server.getJSON("/Store/getStores", { cid: sc_id }, function(res) {
            var stores = res.data;

            that.setData({ stores: stores });
        });
    },

    goods: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: 'goods?id=' + id,

        })
    },
    take: function(e) {
        var phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    onClickClass: function(e) {
        var class_id = e.currentTarget.dataset.id;
        var store_class = this.data.store_class;
        for (var i = 0; i < store_class.length; i++) {
            if (store_class[i].sc_id == class_id) {
                store_class[i].select = 1;
                this.getStoreList(store_class[i].sc_id);
            } else {
                store_class[i].select = 0;
            }
        }
        this.setData({ store_class: store_class });
    }
})