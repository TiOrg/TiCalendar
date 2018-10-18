import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import CButton from '../../common/button';

import storage from '../../common/Storage';

import * as LoginAction from '../../action/LoginAction';
import {getStackOptions} from '../../common/NavigatorOpts';




import {
  SafeAreaView,
  NavigationActions,
  StackActions
} from 'react-navigation';
import {connect} from 'react-redux'; // 引入connect函数

import {
  THEME_BACKGROUND,
  THEME_LABEL,
  THEME_TEXT
} from '../../assets/css/color';

// 清空导航记录，跳转到首页
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'Main'})
    ]
});



class LoginPage extends Component{
  static navigationOptions = getStackOptions('登录');

  constructor(props) {
      super(props);
      this.state = {message: ''};
  }

  componentWillMount() {
        this.checkHasLogin();
    }

    checkHasLogin() {
        global.storage.load({
            key: 'user',
            //autoSync: false,
        }).then(ret => {
            if (ret && ret.username) {
                console.log('用户已经登录：',ret.username);
                this.props.navigation.dispatch(resetAction);
            }
        }).catch(err => {
            // console.warn(err.message);
            console.warn(err.message);
        });
        // this.props.navigation.dispatch(resetAction);
    }

    // 状态更新，判断是否登录并作出处理
    shouldComponentUpdate(nextProps, nextState) {
        // 登录完成,切成功登录
        if (nextProps.status === '登陆成功' && nextProps.isSuccess) {
            this.checkHasLogin();
            return false;
        }
        return true;
    }

    updateState(key, val) {
        let state = this.state;
        state[key] = val;
        this.setState(state);
    }

    doLogin() {
        const {login} = this.props;
        if (!this.mobile) {
            this.updateState('message', '请输入手机号码');
            return;
        }
        if (!this.password) {
            this.updateState('message', '请输入密码');
            return;
        }
        login(this.mobile, this.password);
    }

    doReg() {
        this.props.navigation.navigate('Reg');
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
                    <Text style={styles.subButtonText} onPress={() => this.doReg()}>注册</Text>
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

export default connect(
    (state) => ({
        status: state.loginIn.status,
        isSuccess: state.loginIn.isSuccess,
        user: state.loginIn.user,
    }),
    (dispatch) => ({
        login: (m, p) => dispatch(LoginAction.login(m, p)),
    })
)(LoginPage)

// export default Main;
