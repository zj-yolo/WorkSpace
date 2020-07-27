var server = require('../../../utils/server');
module.exports = {
    //搜藏
    collect_goods(goods_id,goods_name,status){
        server.reportedData('collect_goods',{
            goods_id,goods_name,status
        })
    },
    //分享
    share_goods(goods_id,goods_name){
        server.reportedData('share_goods',{
            goods_id,goods_name
        })
    },
    //加入购物车
    add_carts(goods_id,goods_name){
        server.reportedData('add_carts',{
            goods_id,goods_name
        })
    },
    //查看商品
    see_store_goods(goods_id,goods_name,start_time,end_time){
        server.reportedData('see_store_goods',{
            goods_id,goods_name,start_time,end_time
        })
    },
    //查看VR商品
  see_vrshow_goods(goods_id,goods_name,start_time,end_time){
    server.reportedData('see_vrshow_goods',{
            goods_id,goods_name,start_time,end_time
        })
    },

}
