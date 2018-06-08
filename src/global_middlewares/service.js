/**
 * Created by yuanjianxin on 2018/4/26.
 */
const helper=require('../plugins/helper');
const WebSocketUtil=require('../plugins/WebSocketUtil');
module.exports = () => {

    return async(ctx, next) => {

        ctx.$helper=helper;
        ctx.$webSocketHandler=WebSocketUtil;

        await next();

    }
};