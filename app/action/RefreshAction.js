/*@flow*/
'use strict';

import AV from '../service/AVService';
// import storage from '../common/Storage';


export function pullEvents() {

    var eventsQuery = new AV.Query('Events');

    global.storage.load({
        key: 'user',
    }).then(ret=>{
        eventsQuery.equalTo('school', ret.school);
        // eventsQuery.greaterThanOrEqualTo('updatedAt', ret.lastLogin);

        eventsQuery.find().then(results=> {
            storage.getIdsForKey('event').then(ids => {

                // var events = [];
                let i = Math.max(ids) + 1;
                results.forEach(result=>{
                    console.log(result.attributes);
                    // events.push(result.attributes);
    
                    global.storage.save({
                        key: 'event',
                        id : toString(i),
                        data: result.attributes
                    })
                    i = i + 1;
                });
              });
            
            }, function (error) {
                console.warn(error);
            });
    }).catch(err=>{
        console.warn(err);
        switch (err.name) {
            case 'NotFoundError':
                alert('You shall login first!');;
                break;
            case 'ExpiredError':
                // TODO
                break;
            }
        return 'error';
    }); 
}

// // 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
// export function login(username, password) {
//     console.log('登录方法');

//     // user.mobile = mobile;
//     // user.password = password;

//     return dispatch => {
//         dispatch(isLogining());
//         // 模拟用户登录
//         AV.User.logIn(username, password).then(function (loggedInUser) {
//             console.log(loggedInUser);
//             // current_user = AV.User.current();
//             dispatch(loginSuccess(true, loggedInUser));
//         }, function (error) {
//             dispatch(loginError(false));
//             console.log(error);
//         });
//         // if (mobile === '' + user.mobile && password === user.pwd) {
//         //     dispatch(loginSuccess(true, user));
//         // } else {
//         //     dispatch(loginError(false));
//         // }
//         /*let result = fetch('https://localhost:8088/login')
//          .then((res) => {
//          dispatch(loginSuccess(true, user));
//          }).catch((e) => {
//          dispatch(loginError(false));
//          })*/
//     }
// }

// function isLogining() {
//     return {
//         type: types.LOGIN_IN_DOING
//     }
// }

// function isQuiting() {
//     return {
//         type: types.LOGIN_OUT
//     }
// }

// function loginSuccess(isSuccess, user) {
//     console.log('success');

//     global.storage.save({
//         key: 'user',
//         data: user
//     });
//     return {
//         type: types.LOGIN_IN_DONE,
//         user: user,
//     }
// }

// function loginError(isSuccess) {
//     console.log('error');
//     return {
//         type: types.LOGIN_IN_ERROR,
//     }
// }
