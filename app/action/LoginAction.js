/*@flow*/
'use strict';

import * as types from '../constants/LoginTypes';
import AV from '../service/AVService';
// import storage from '../common/Storage';
import React, { Component } from 'react';


export function quit() {
    console.log('退出登录方法');
    global.storage.remove({
        key: 'user',
    });
    return dispatch => {
        dispatch(isQuiting());
        console.log('quiting');
    }
}

export function updateLoginTime(userid) {
    // 更新当前用户的登录时间
    var loginDate = new Date();
    // console.log('当前用户登录时间更新成功，登录时间为', loginDate);
    var query = new AV.Query('_User');
    // console.log('当前用户登录时间更新成功，登录时间为', loginDate);

    query.get(userid).then(function (user) {
        user.set('lastLogin', loginDate);
        user.save();
        console.log('当前用户登录时间更新成功，登录时间为', loginDate);
        console.log('date: ',loginDate);
        global.storage.save({
            key: 'user',
            data: user
        });
        // return loginDate;
    },function(error) {
        // 异常处理
        console.log('当前用户登录时间更新失败！');
    }) 
    // var loginTime = loginDate.toLocaleTimeString();
    // console.log('current time: ' + loginTime);
    // console.log('current date: ' + loginDate);
}

// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
export function login(username, password) {
    console.log('登录方法');

    // user.mobile = mobile;
    // user.password = password;

    return dispatch => {
        dispatch(isLogining());
        AV.User.logIn(username, password).then(function (loggedInUser) {
            // console.log('hello AV');
            console.log(loggedInUser);
            // updateLoginTime();
            // current_user = AV.User.current();
            dispatch(loginSuccess(true, loggedInUser));
        }, function (error) {
            dispatch(loginError(false));
            console.log(error);
        });
        // if (mobile === '' + user.mobile && password === user.pwd) {
        //     dispatch(loginSuccess(true, user));
        // } else {
        //     dispatch(loginError(false));
        // }
        /*let result = fetch('https://localhost:8088/login')
         .then((res) => {
         dispatch(loginSuccess(true, user));
         }).catch((e) => {
         dispatch(loginError(false));
         })*/
    }
}

function isLogining() {
    return {
        type: types.LOGIN_IN_DOING
    }
}

function isQuiting() {
    return {
        type: types.LOGIN_OUT
    }
}

function loginSuccess(isSuccess, user) {
    console.log('success user: ' + user);

    global.storage.save({
        key: 'user',
        data: user
    });
    return {
        type: types.LOGIN_IN_DONE,
        user: user,
    }
}

function loginError(isSuccess) {
    console.log('error');
    return {
        type: types.LOGIN_IN_ERROR,
    }
}
