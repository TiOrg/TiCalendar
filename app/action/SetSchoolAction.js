/*@flow*/
'use strict';

import * as types from '../constants/SchoolTypes';
// import storage from '../common/Storage';
import React, { Component } from 'react';


// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
export function bind(username, password) {
    console.log('绑定方法');
    let school_info = {
        studentid : username,
        studentpswd: password
    };
    console.log('let生成的school_info信息：',school_info);
    // user.mobile = mobile;
    // user.password = password;

    return dispatch => {
        dispatch(isBinding());
        global.storage.save({
            key: 'schoolinfo',
            data: school_info
        });
        dispatch(BindSuccess(school_info));
    }
}

export function unbind() {
    global.storage.remove({
        key: 'schoolinfo',
    });
    return dispatch => {
        dispatch(isUnbinding());
        console.log('unbinding');
    }
}

function isBinding() {
    return {
        type: types.SCHOOL_BINDING
    }
}

function isUnbinding() {
    return {
        type: types.SCHOOL_UNBIND
    }
}

function BindSuccess(user) {
    console.log('绑定成功的学生信息: ' + user);
    return {
        type: types.SCHOOL_BIND_DONE,
        user: user,
    }
}

function BindError() {
    console.log('error');
    return {
        type: types.LOGIN_IN_ERROR,
    }
}
