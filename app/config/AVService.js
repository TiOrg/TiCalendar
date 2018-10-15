// 存储服务
var AV = require('leancloud-storage');
var { Query, User } = AV;
// 实时消息服务
var { Realtime, TextMessage } = require('leancloud-realtime');


// 存储服务
var { Query, User } = AV;
// 实时消息服务
var { Realtime, TextMessage } = AV;


var APP_ID = '6JuwEygCViOWA6iy8Y4vEaiD-gzGzoHsz';
var APP_KEY = 'BRBM4Ykd19oDGOTQAsCSuxDF';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


var TestObject = AV.Object.extend('TestObject');
var testObject = new TestObject();
testObject.save({
  words: 'Hello World!'
}).then(function(object) {
  alert('LeanCloud Rocks!');
})


export default class AVService {
  
}
