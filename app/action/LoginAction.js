/*@flow*/
'use strict';

import * as types from '../constants/LoginTypes';
import firebase from '../../FireBase';



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
export function loginAnonymously() {
    console.log('Login Anonymously doing');

    return dispatch => {
        firebase.auth().signInAnonymously().then(()=>{
            dispatch(loginSuccess(firebase.auth().currentUser));
            console.log('login success');
        }).catch(function(error) {
            // Handle Errors here.
            var errorMessage = error.message;
            alert(errorMessage);
          });
    }
}
// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
export function login(email, password) {
    console.log('登录方法');
    
    return dispatch => {
        dispatch(isLogining());
        // 模拟用户登录
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            dispatch(loginSuccess(firebase.auth().currentUser));
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/invalid-email') {
                
                alert('请输入合法的email地址');
            } else if (errorCode === 'auth/wrong-password') {
                alert('密码错误');
            } else {
                alert(errorMessage);
            }
            dispatch(loginError(errorMessage));
        });
        
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

function loginSuccess(user) {
    console.log('success');
    global.storage.save({
        key: 'user',
        data: user
    });
    return {
        type: types.LOGIN_IN_DONE,
        user: user
    }
}

function loginError(errorMsg) {
    console.log('error');
    return {
        type: types.LOGIN_IN_ERROR,
        status: errorMsg
    }
}
