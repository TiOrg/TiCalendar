'use strict';
import * as types from '../constants/SchoolTypes';

const initialState = {
    school_status: '未绑定学生信息',
    bind_is_success: false,
};

export default function bindSchool(state = initialState, action) {
    // console.log('bind school action:', action);
    // console.log('bind school state:', state);
    switch (action.type) {
        case types.SCHOOL_BINDING:
            return {
                ...state,
                school_status: '正在绑定学生信息...',
                bind_is_success: false,
            };
            break;
        case types.SCHOOL_BIND_DONE:
            return {
                ...state,
                school_status: '学生信息绑定完成',
                bind_is_success: true,
            };
            break;
        case types.SCHOOL_BIND_ERROR:
            return {
                ...state,
                school_status: '学生信息绑定出错',
                bind_is_success: true,
            };
            break;
        case types.SCHOOL_UNBIND:
            return {
                ...state,
                school_status: '未绑定学生信息',
                bind_is_success: true,
            };
            break;
        default:
            return state;
    }
}
