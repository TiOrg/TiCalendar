'use strict';
import * as types from '../constants/SchoolTypes';

const initialState = {
    status: '未绑定学生信息',
    isSuccess: false,
    user: null,
};

export default function bindSchool(state = initialState, action) {
    switch (action.type) {
        case types.SCHOOL_BINDING:
            return {
                ...state,
                status: '正在绑定学生信息...',
                isSuccess: false,
                user: action.user,
            };
            break;
        case types.SCHOOL_BIND_DONE:
            return {
                ...state,
                status: '学生信息绑定完成',
                isSuccess: true,
                user: action.user,
            };
            break;
        case types.SCHOOL_BIND_ERROR:
            return {
                ...state,
                status: '学生信息绑定出错',
                isSuccess: true,
                user: null,
            };
            break;
        case types.SCHOOL_UNBIND:
            return {
                ...state,
                status: '未绑定学生信息',
                isSuccess: true,
                user: null,
            };
            break;
        default:
            return state;
    }
}
