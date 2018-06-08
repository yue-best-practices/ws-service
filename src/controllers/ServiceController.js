/**
 * Created by yuanjianxin on 2018/6/7.
 */
const BaseController=require('./BaseController');
const wsMappingConf=require('../configs/ws-mapping.config');
const AsyncAll=require('yue-asyncall');
module.exports=class ServiceController extends BaseController{


    /**
     * 根据用户userId 获取用户该连接的webSocket地址
     * @param ctx
     * @param next
     * @returns {Promise.<void>}
     */
    async getWebSocketUrl(ctx,next){
        let userId=ctx.params.userId;
        let number=ctx.$helper.formatNumberByString(userId.toString());
        let index=number%wsMappingConf.length;
        let wsConf=wsMappingConf[index];
        ctx.result={
            code:200,
            message:'OK',
            data:{
                wsUrl:wsConf.wsUrl
            }
        };
        await next();
    }


    async sendMessage(ctx,next){
        let userId=ctx.$body.userId;
        let message=ctx.$body.message;

        if(! (userId instanceof Array))
            userId=[userId];

        if(!(message instanceof Array))
            message=[message];

        let sendTask=new Map();
        let webSocketCount=wsMappingConf.length;
        userId.forEach(v=>{
            let number=ctx.$helper.formatNumberByString(v.toString());
            let index=number%webSocketCount;
            let wsConf=wsMappingConf[index];
            let httpUrl=wsConf.httpUrl;
            let obj=sendTask.has(httpUrl) && sendTask.get(httpUrl) || {};
            obj.userId=obj.userId || [];
            obj.userId.push(v);
            obj.message=obj.message || message;
            sendTask.set(httpUrl,obj);
        });

        let promiseList=[];

        sendTask.forEach((v,k)=>{
            promiseList.push((
                async (v,k)=>{
                    await ctx.$webSocketHandler.sendMessage(k,v);
                }
            )(v,k));
        });

        await AsyncAll(promiseList);

        ctx.result={
            code:200,
            message:"OK"
        };

        await next();

    }


    async broadcast(ctx,next){
        let httpUrlList=wsMappingConf.map(v=>v.httpUrl);

        let message=ctx.$body.message;

        let promiseList=[];

        httpUrlList.forEach(v=>{
            promiseList.push((
                async (v)=>{
                    await ctx.$webSocketHandler.broadcast(v,message);
                }
            )(v));
        });

        await AsyncAll(promiseList);

        console.log('==httpUrlList==',httpUrlList);
        ctx.result={
            code:200,
            message:"OK"
        };
        await next();
    }

};