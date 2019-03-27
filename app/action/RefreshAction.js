/*@flow*/
'use strict';

import AV from '../service/AVService';
// import storage from '../common/Storage';


export async function pullEvents() {

    var school = 'unknown';
    var user;

    var lastUpdate = new Date();

    await global.storage.load({
        key: 'user',
    }).then(ret => {
        console.log(ret)

        school = ret.school;
        if (ret.lastUpdate != undefined) {
            lastUpdate = ret.lastUpdate;
        }
        user = ret;

    }).catch(err => {
        console.warn(err);
        switch (err.name) {
            case 'NotFoundError':
                alert('请先登录');;
                break;
            case 'ExpiredError':
                // TODO
                break;
        }
        return 'error';
    });


    await AV.Cloud.run('refresh_events', {
        username: '1652224',
        password: 'Simon0628',
    }).then(function (data) {
        // alert(data);
        console.log('cloud: refresh_success');
        // 调用成功，得到成功的应答 data
    }, function (error) {
        // 处理调用失败
    });


    var eventsQuery = new AV.Query('Events');

    // eventsQuery.equalTo('school', ret.school);
    eventsQuery.greaterThanOrEqualTo('updatedAt', new Date(lastUpdate));

    var events;
    await eventsQuery.find().then(results => {

        console.log(results);
        events = results;

    }, function (error) {
        console.warn(error);
    });


    global.storage.getIdsForKey('event').then(ids => {

        // var events = [];
        let i = Math.max(ids) + 1;
        results.forEach(result => {
            console.log(result.attributes);
            // events.push(result.attributes);

            global.storage.save({
                key: 'event',
                id: toString(i),
                data: result.attributes
            })
            i = i + 1;
        });
    });

    user['lastUpdate'] = new Date();
    global.storage.save({
        key: 'user',
        data: user
    }).then(ret => {
        console.log('save lastupdate success');
    });

    alert('刷新成功');
    return events;
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
