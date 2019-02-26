'use strict';
import * as types from '../constants/LoginTypes';

const initialState = {
    status: '点击登录',
    isSuccess: false,
    user: null,
};

export default function loginIn(state = initialState, action) {
    switch (action.type) {
        case types.LOGIN_IN_DOING:
            return {
                ...state,
                status: '正在登录',
                isSuccess: false,
                user: null,
            };
            break;
        case types.LOGIN_IN_DONE:
            return {
                ...state,
                status: '登录成功',
                isSuccess: true,
                user: action.user,
            };
            break;
        case types.LOGIN_IN_ERROR:
            return {
                ...state,
                status: '登录出错',
                isSuccess: true,
                user: null,
            };
            break;
        case types.LOGIN_OUT:
            return {
                ...state,
                status: '点击登录',
                isSuccess: true,
                user: null,
            };
            break;
        default:
            return state;
    }
}
