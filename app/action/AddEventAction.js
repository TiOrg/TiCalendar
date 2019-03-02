
import AV from '../service/AVService';

export function add(id, eventName, startTime, endTime) {
    console.log('保存事件方法');

    var success = false;
    var startDate = new Date(Date.parse(startTime.replace(/-/g,   "/")));
    var endDate = new Date(Date.parse(endTime.replace(/-/g,   "/")));
    var Event = AV.Object.extend('Events');
    var event = new Event();
    event.set('EventName', eventName);
    // console.log('startdate: ' + startDate);
    event.set('StartDate', startDate);
    // console.log('enddate: ' + endDate);
    event.set('EndDate', endDate);
    event.set('EventID', id);
    event.save().then(function(event) {
        console.log('New object created with objectId: ' + event.id);
        global.storage.save({
            key: 'event',
            id: id,
            data: {
                // id: id,
                eventName: eventName,
                startTime: startTime,
                endTime: endTime
            },
    
            expires: null
        });
        console.log('saved locally:' + eventName);
    }, function(error) {
        // 异常处理
        console.error('Failed to create new object, with error message: ' + error.message);
    });
}

export function load(userid) {
    console.log('读取本地存储的事件方法');

    storage.load({
        key: 'event',
        id: userid

    })
    .then(ret => {
        // 如果找到数据，则在then方法中返回
        console.log('找到了所需数据');
        console.log('eventname:',ret.eventName);
    })
    .catch(err => {
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


}

export function GetAllData(userid) {
    storage.getAllDataForKey('event').then(event => {
        console.log(event);
    });
}