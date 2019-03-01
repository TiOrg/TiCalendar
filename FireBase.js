import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

// To make firebase work properly
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

// Init firebase
const config = {
    apiKey: "AIzaSyDmyDeGu5fRwcjjKyhPmQnJ9FTPX-K5sRM",
    authDomain: "ticalendar-tiorg.firebaseapp.com",
    databaseURL: "https://ticalendar-tiorg.firebaseio.com",
    projectId: "ticalendar-tiorg",
    storageBucket: "ticalendar-tiorg.appspot.com",
    messagingSenderId: "302818385065"
  };
firebase.initializeApp(config);

export default firebase;