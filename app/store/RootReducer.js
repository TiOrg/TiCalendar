'use strict';

import {combineReducers} from 'redux';
import loginIn from './LoginReducer';
import reg from './RegReducer';
import React, {Component} from 'react';

const rootReducer = combineReducers({
    loginIn: loginIn, // 登录类型状态
    reg: reg // 注册类型状态
});

export default rootReducer;
