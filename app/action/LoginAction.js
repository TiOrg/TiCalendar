'use strict';

import * as types from '../constants/LoginTypes';
import AV from '../service/AVService';
// import storage from '../common/Storage';
import React, {Component} from 'react';


// var user = {
//   mobile: '',
//   password: '',
// }

// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
export function login(mobile, password) {
    console.log('登录方法');

    // user.mobile = mobile;
    // user.password = password;

    return dispatch => {
        dispatch(isLogining());
        // 模拟用户登录
        AV.User.logIn(mobile, password).then(function (loggedInUser) {
          console.log(loggedInUser);
          // current_user = AV.User.current();
          dispatch(loginSuccess(true,loggedInUser));

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

function loginSuccess(isSuccess,user) {
    console.log('success');

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
