/**
 * Created by yuanjianxin on 2018/7/2.
 */
const wsMappingConf = require('../src/configs/ws-mapping.config');
const Helper = require('../src/plugins/helper');
const messages = require('./resources/WebSocketService_pb');
const webSocketCount = wsMappingConf.length;
const WebSocketServerUtil = require('../src/plugins/WebSocketServerUtil');
const AsyncAll = require('yue-asyncall');

const isJSON = (content) => {
    if (typeof content !== 'string')
        return false;
    try {
        let obj = JSON.parse(content);
        return typeof obj === 'object';
    } catch (e) {
        return false;
    }
};

const getUriByUserId = (call, callback) => {
    let response = new messages.GetUriResponse();
    let userId = call.request.getUserid();
    let number = Helper.formatNumberByString(userId.toString());
    let index = number % wsMappingConf.length;
    let wsConf = wsMappingConf[index];
    response.setWsuri(wsConf.wsUrl);
    callback(null, response);
};


const sendMsg = async(call, callback) => {
    let response = new messages.sendMsgResponse();
    let userId = call.request.getUserid();
    let message = call.request.getMessage();

    userId = isJSON(userId) && JSON.parse(userId) || [userId];
    message = isJSON(message) && JSON.parse(message) || [message];

    let sendTask = new Map();
    userId.forEach(v => {
        let number = Helper.formatNumberByString(v.toString());
        let index = number % webSocketCount;
        let wsConf = wsMappingConf[index];
        let url = wsConf.uri;
        let obj = sendTask.has(url) && sendTask.get(url) || {};
        obj.userId = obj.userId || [];
        obj.userId.push(v);
        obj.message = obj.message || message;
        sendTask.set(url, obj);
    });
    let promiseList = [];
    let result = true;
    sendTask.forEach((v, k) => {
        promiseList.push((async(v, k) => {
                try {
                    await WebSocketServerUtil.sendMessage(k, JSON.stringify(v.userId), JSON.stringify(v.message));
                } catch (e) {
                    console.error('==sendMsg Error==', e);
                    result = false;
                }
            })(v, k));
    });

    await AsyncAll(promiseList);
    response.setResult(result);
    callback(null, response);
};


const broadcast = async(call, callback) => {
    let response = new messages.broadcastResponse();
    let message = call.request.getMessage();
    let urlList = wsMappingConf.map(v => v.uri);
    let promiseList = [];
    let result = true;
    urlList.forEach(v => {
        promiseList.push((async(v) => {
                try {
                    await WebSocketServerUtil.broadcast(v, message);
                } catch (e) {
                    console.error('==BroadCast Error==', e);
                    result = false;
                }
            })(v));
    });
    await AsyncAll(promiseList);
    response.setResult(result);
    callback(null, response);
};


const checkExist = async(call, callback) => {
    let response = new messages.checkExistResponse();
    let userId = call.request.getUserid();
    let number = Helper.formatNumberByString(userId.toString());
    let index = number % webSocketCount;
    let wsConf = wsMappingConf[index];
    let result = false;
    try {
        result = await WebSocketServerUtil.isOnline(wsConf.uri, userId);
    } catch (e) {
        console.error('==CheckExist Error==', e);
    }
    response.setResult(result);
    callback(null, response);
};

module.exports = {
    getUriByUserId,
    sendMsg,
    broadcast,
    checkExist
};
