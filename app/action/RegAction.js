'use strict';

import * as types from '../constants/RegTypes';
import firebase from '../../FireBase';

export function reg(username, password, email) {

    return dispatch => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            var user = firebase.auth().currentUser;
            user.sendEmailVerification()
                .then(() => {
                    alert('注册成功，已发送验证邮件');                   
                });
            user.updateProfile({
                    displayName: username,
                  }).then(function() {
                    // Update successful.
                  }).catch(function(error) {
                    // An error happened.
                  });
            dispatch(regSuccess(user));
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            dispatch(regError());
        });
    }
}

function regSuccess(user) {
    console.log('success');
    return {
        type: types.REG_DONE,
        user: user,
    }
}

function regError() {
    console.log('error');
    return {
        type: types.REG_ERROR,
    }
}
