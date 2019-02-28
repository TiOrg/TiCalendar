/** @format */

import {AppRegistry} from 'react-native';
import './app/common/Storage';
import Root from './app/root.js';
import {name as appName} from './app.json';
import firebase from "firebase";

AppRegistry.registerComponent(appName, () => Root);

// To make firebase work properly
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

// Init firebase
var config = {
    apiKey: "AIzaSyDmyDeGu5fRwcjjKyhPmQnJ9FTPX-K5sRM",
    authDomain: "ticalendar-tiorg.firebaseapp.com",
    databaseURL: "https://ticalendar-tiorg.firebaseio.com",
    projectId: "ticalendar-tiorg",
    storageBucket: "ticalendar-tiorg.appspot.com",
    messagingSenderId: "302818385065"
  };
firebase.initializeApp(config);

var database = firebase.database();
