'use strict';

import * as types from '../constants/RegTypes';
import AV from '../service/AVService';
import React, {Component} from 'react';

export function reg(mobile, password) {
    console.log('注册方法');
    // 新建 AVUser 对象实例
    var user = new AV.User();
    // 设置用户名
    user.setUsername(mobile);
    // 设置密码
    user.setPassword(password);
    // 设置邮箱
    user.setEmail('tom@leancloud.cn');
    user.signUp().then(function (loggedInUser) {
      console.log(loggedInUser);
  }, function (error) {
  });
    return dispatch => {
        dispatch(isReging());
        // 模拟用户注册
        if (true) {
            dispatch(regSuccess(true));
        } else {
            dispatch(regError(false));
        }
        /*let result = fetch('https://localhost:8088/reg')
         .then((res) => {
         dispatch(regSuccess(true, user));
         }).catch((e) => {
         dispatch(regError(false));
         })*/
    }
}

function isReging() {
    return {
        type: types.REG_DOING
    }
}

function regSuccess(isSuccess, user) {
    console.warn('success');
    return {
        type: types.REG_DONE,
        user: user,
    }
}

function regError(isSuccess) {
    console.log('error');
    return {
        type: types.REG_ERROR,
    }
}
