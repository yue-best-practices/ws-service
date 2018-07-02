/**
 * Created by yuanjianxin on 2018/5/9.
 */
const server = require('../grpc/server');

server.start((err, data) => {
    console.error('====grpc err===', err);
    console.log('====data===', data);
});