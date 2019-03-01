/** @format */

import {AppRegistry} from 'react-native';
import './app/common/Storage';
import Root from './app/root.js';
import {name as appName} from './app.json';
// import firebase from "./FireBase";

AppRegistry.registerComponent(appName, () => Root);
