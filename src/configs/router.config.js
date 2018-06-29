/**
 * Created by yuanjianxin on 2018/4/26.
 */

const routers=[];

const ServiceController=require('../controllers/ServiceController');

routers.push({path: '/getWebSocketUrl/:userId', method: 'get', controller: ServiceController, func: 'getWebSocketUrl'});
routers.push({path: '/sendMessage', method: 'post', controller: ServiceController, func: 'sendMessage'});
routers.push({path: '/broadcast', method: 'post', controller: ServiceController, func: 'broadcast'});
routers.push({path: '/isOnline/:userId', method: 'put', controller: ServiceController, func: 'userIsOnline'});



module.exports=routers;