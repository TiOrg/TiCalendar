import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import CButton from '../../common/button';


import {
  SafeAreaView,
  NavigationActions
} from 'react-navigation';
import {connect} from 'react-redux'; // 引入connect函数

import {
  THEME_BACKGROUND,
  THEME_LABEL,
  THEME_TEXT
} from '../../assets/css/color';
export default class LoginPage extends Component{

  constructor(props) {
      super(props);
      this.state = {message: ''};
  }


  render() {
    const {login} = this.props;
    let message = this.state && this.state.message ? this.state.message : '';
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.loginPage}>
            <View style={styles.loginSection}>
                <Text style={styles.loginTitle}>TiCalendar</Text>
                <TextInput style={styles.loginInput} placeholder='手机号码' keyboardType={'numeric'}
                           defaultValue={this.mobile} autoCapitalize={'none'} maxLength={11}
                           onChangeText={(text) => this.mobile = text}/>
                <TextInput style={styles.loginInput} placeholder='password' secureTextEntry={true}
                           defaultValue={this.password} autoCapitalize={'none'} maxLength={20}
                           onChangeText={(text) => this.password = text}/>
                <CButton style={styles.loginInput} title={'登录'} onPress={() => this.doLogin()}/>
                <View style={styles.subButton}>
                    <Text style={styles.subButtonText} onPress={() => this.doReg()}>免费注册</Text>
                    <Text style={styles.subButtonText} onPress={() => this.findAccount()}>找回密码</Text>
                </View>
                <Text style={styles.message}>{message}</Text>
                <Text style={{marginTop: 16, fontSize: 12}}>状态: {this.props.status}</Text>
            </View>
        </View>

      </SafeAreaView>
    );
  }



}

const styles = StyleSheet.create({
  loginPage: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: THEME_BACKGROUND
    },
    loginSection: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: '500',
        color: THEME_LABEL,
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 32
    },
    subButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8
    },
    subButtonText: {
        color: THEME_TEXT,
        fontSize: 14
    },
    loginInput: {
        marginBottom: 8
    },
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    message: {
        marginTop: 16,
        color: THEME_TEXT,
        fontSize: 14
    }


});

// export default Main;
