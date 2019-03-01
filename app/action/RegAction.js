'use strict';

import * as types from '../constants/RegTypes';
import firebase from '../../FireBase';
import React, { Component } from 'react';

export function reg(username, password, email) {
    alert(email);
    alert(password);

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        alert(error);
        // dispatch(regError(false));
        // ...
      });
      
      alert('log success');

    return dispatch => {
        // dispatch(isReging());
        // 模拟用户注册
        dispatch(regSuccess(true));

        /*let result = fetch('https://localhost:8088/reg')
         .then((res) => {
         dispatch(regSuccess(true, user));
         }).catch((e) => {
         dispatch(regError(false));
         })*/
    }
}

// function isReging() {
//     return {
//         type: types.REG_DOING
//     }
// }

function regSuccess(isSuccess, user) {
    console.log('success');
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
