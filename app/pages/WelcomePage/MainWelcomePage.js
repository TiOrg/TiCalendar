import React, { Component } from "react";
import { 
Image,
Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert, 
} from "react-native";
import {
  Button
} from "react-native-paper";

import {
    NavigationActions,
    StackActions,
    StackNavigator
  } from 'react-navigation';
  import { connect } from 'react-redux'; // 引入connect函数
  import storage from '../../common/Storage';
  import { getStackOptions } from '../../common/NavigatorOpts';

const drawerCover = require("../../assets/image/drawer-cover.png");
const drawerImage = require("../../assets/image/logo-kitchen-sink.png");

const toLoginPage = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Login' })
    ]
  });

const toMainPage = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Main' })
    ]
});

export default class MainWelcomePage extends Component {
    // static navigationOptions = getStackOptions('设置');
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.checkHasLogin();
    }

    checkHasLogin() {
        global.storage.load({
            key: 'user',
            //autoSync: false,
        }).then(ret => {
            // console.log('hello titi');
            if (ret && ret.username) {
                console.log('用户已经登录：', ret);
                console.log('userid:', ret.objectId);
                LoginAction.updateLoginTime(ret.objectId);
                this.props.navigation.dispatch(toMainPage);
            }
            else {
                console.log('用户未登录');
                this.props.navigation.dispatch(toLoginPage);
            }
        }).catch(err => {
            // console.warn(err.message);
            // console.warn(err.message);
        });
        // this.props.navigation.dispatch(resetAction);
    }

  render() {
    return (
        <View>

        </View>
    );
  }
}