/**
 * Created by yuanjianxin on 2018/6/7.
 */

const HttpUtil=require('yue-http-util');

module.exports={

    async sendMessage(url,data){
        url=url+'/sendMessage';
        let method="post";
        await HttpUtil.instance.sendRequest(method,url,data,{});
    },

    async broadcast(url,message){
        let method="post";
        url=url+"/broadcast";
        await HttpUtil.instance.sendRequest(method,url,{message},{})
    }
};