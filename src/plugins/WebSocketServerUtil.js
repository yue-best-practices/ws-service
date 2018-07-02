/**
 * Created by yuanjianxin on 2018/7/2.
 */
const grpc = require('grpc');
const messages = require('../../grpc/resources/WebSocketServer_pb');
const services = require('../../grpc/resources/WebSocketServer_grpc_pb');

module.exports = {

    isOnline(url, userId){
        let request = new messages.checkExistRequest();
        request.setUserid(userId);
        let client = new services.WebSocketServerClient(url, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.checkExist(request, (err, data) => {
                err ? (reject(err)) : resolve(data.getResult());
            });
        })
    },


    sendMessage(url, userId, message){
        let request = new messages.sendMsgRequest();
        request.setUserid(userId);
        request.setMessage(message);
        console.log('==sendMessage==', typeof userId, typeof message);
        let client = new services.WebSocketServerClient(url, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.sendMsg(request, (err, data) => {
                err ? (reject(err)) : resolve(data.getResult());
            })
        })
    },

    broadcast(url, message){
        let request = new messages.broadcastRequest();
        request.setMessage(message);
        let client = new services.WebSocketServerClient(url, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.broadcast(request, (err, data) => {
                err ? (reject(err)) : resolve(data.getResult());
            })
        });
    }

};