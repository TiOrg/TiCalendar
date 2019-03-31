/*@flow*/
'use strict';

import AV from '../service/AVService';
// import storage from '../common/Storage';


export async function pullEvents() {

    // var school = 'unknown';
    // var user;

    // var lastUpdate = new Date();

    // await global.storage.load({
    //     key: 'user',
    // }).then(ret => {
    //     console.log('ret = ');
    //     console.log(ret);

    //     school = ret.school;
    //     if (ret.lastUpdate != undefined) {
    //         lastUpdate = ret.lastUpdate;
    //     }
    //     user = ret;

    // }).catch(err => {
    //     console.warn(err);
    //     switch (err.name) {
    //         case 'NotFoundError':
    //             alert('请先登录');;
    //             break;
    //         case 'ExpiredError':
    //             // TODO
    //             break;
    //     }
    //     return 'error';
    // });

    var stu_info;
    await global.storage.load({
        key: 'schoolinfo',
    }).then(ret => {
        console.log(ret);
        stu_info = ret;
        
    }).catch(err => {
        console.warn(err);
        switch (err.name) {
            case 'NotFoundError':
                throw 'UserNotLogin';
                break;
            case 'ExpiredError':
            throw 'UnknownError';
                break;
        }
        
    });

    await AV.Cloud.run('refresh_events', {
        username: stu_info.studentid,
        password: stu_info.studentpswd,
    }).then(function (data) {
        
        if(data == 'LoginError'){
            throw 'LoginError';
        }
        else if(data == 'ParseError'){
            throw 'UnknownError';
        }

    }, function (error) {
        throw 'CloudFailed';
    });

    var eventsQuery = new AV.Query('Events');

    // eventsQuery.equalTo('school', ret.school);
    // eventsQuery.greaterThanOrEqualTo('updatedAt', new Date(lastUpdate));

    var events = [];
    await eventsQuery.find().then(results => {

        // console.log(results);
        results.forEach(result => {
            events.push(result.attributes);
        });

    }, function (error) {
        console.warn(error);
        throw 'CloudFailed'
    });

    // console.log(events);

    let i = 0;

    global.storage.getIdsForKey('event').then(ids => {

        // console.log(ids);
        // if(Math.max(ids)!= NaN){
        //     console.log('max:' + Math.max(ids))
        //     i = Math.max(ids) + 1;
        // }
        storage.clearMapForKey('event');

        events.forEach(event => {
            i = i + 1;
            // console.log(event.attributes);
            // events.push(event.attributes);

            global.storage.save({
                key: 'event',
                id: i,
                data: event
            }).then(() => {
                // console.log('i = ' + i);
                // console.log('saving:');
                // console.log(event);
            });
        });

        console.log('save events successfully');
    });

    // 对更新时间的存储--本地
    // user['lastUpdate'] = new Date();
    // global.storage.save({
    //     key: 'user',
    //     data: user
    // }).then(ret => {
    //     console.log('save lastupdate success');
    // });

    // // 对更新时间的存储--云端
    // var refreshDate = new Date();
    // var query = new AV.Query('_User');

    // query.get(user.userid).then(function (user) {
    //     user.set('lastUpdate', refreshDate);
    //     user.save();
    //     global.storage.save({
    //         key: 'user',
    //         data: user
    //     });
    //     // return loginDate;
    // },function(error) {
    //     // 异常处理
    //     console.log('当前用户登录时间更新失败！');
    // }) 

    return events;
}

export async function getLocalEvents() {
    var events;
    await global.storage.getAllDataForKey('event').then(ret => {
        events = ret;
    }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        switch (err.name) {
            case 'NotFoundError':
                // TODO;
                break;
            case 'ExpiredError':
                // TODO
                break;
        }
    });
    return events;
}