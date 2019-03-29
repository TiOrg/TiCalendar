'use strict';

import { combineReducers } from 'redux';
import loginIn from './LoginReducer';
import reg from './RegReducer';
import bindSchool from './SchoolReducer';
import React, { Component } from 'react';

const rootReducer = combineReducers({
    loginIn: loginIn, // 登录类型状态
    reg: reg, // 注册类型状态
    bindSchool: bindSchool // 学生信息绑定状态
});

export default rootReducer;
