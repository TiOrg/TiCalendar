'use strict';
import * as types from '../constants/RegTypes';
const initialState = {
    isSuccess: false,
    user: null
};

export default function reg(state = initialState, action) {
    switch (action.type) {
        case types.REG_DONE:
            return {
                ...state,
                isSuccess: true,
                user: action.user,
            };
            break;
        case types.REG_ERROR:
            return {
                ...state,
                isSuccess: false,
                user: null,
            };
            break;
        default:
            console.log(state);
            return state;
    }
}
