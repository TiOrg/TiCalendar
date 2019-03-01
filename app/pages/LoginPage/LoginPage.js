import React, { Component } from 'react';
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
import { getStackOptions } from '../../common/NavigatorOpts';




import {
    SafeAreaView,
    NavigationActions,
    StackActions
} from 'react-navigation';
import { connect } from 'react-redux'; // 引入connect函数

import * as color from '../../assets/css/color';

// 清空导航记录，跳转到首页
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Main' })
    ]
});



class LoginPage extends Component {
    static navigationOptions = getStackOptions('登录');

    constructor(props) {
        super(props);
        this.state = { message: '' };
    }

    componentWillMount() {
        this.checkHasLogin();
    }

    checkHasLogin() {
        console.log('loading');
        global.storage.load({
            key: 'user',
            //autoSync: false,
        }).then(ret => {
            if (ret) {
                if (ret.displayName) {
                    console.log('用户已经登录：', ret.displayName);
                }
                else if (ret.isAnonymous) {
                    console.log('unknown用户已经登录');
                }
                this.props.navigation.dispatch(resetAction);
            }
        }).catch(err => {
            console.log(err.message);
        });
        // this.props.navigation.dispatch(resetAction);
    }

    // 状态更新，判断是否登录并作出处理
    shouldComponentUpdate(nextProps) {
        // 登录完成,切成功登录
        if (nextProps.isSuccess) {
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
        const { login } = this.props;
        console.log('login props');
        console.log(this.props);
        if (!this.email) {
            this.updateState('message', '请输入用户名');
            return;
        }
        if (!this.password) {
            this.updateState('message', '请输入密码');
            return;
        }
        login(this.email, this.password);
    }

    doLoginAnonymously() {
        console.log('Login Anonymously');
        const { loginAnonymously } = this.props;
        loginAnonymously();
    }

    doReg() {
        this.props.navigation.navigate('Reg');
    }


    render() {
        let message = this.state && this.state.message ? this.state.message : '';
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loginPage}>
                    <Text style={styles.loginTitle}>TiCalendar</Text>
                    <TextInput style={styles.loginInput} placeholder='电子邮箱'
                        defaultValue={this.email} autoCapitalize={'none'} maxLength={30}
                        onChangeText={(text) => this.email = text} />
                    <TextInput style={styles.loginInput} placeholder='密码' secureTextEntry={true}
                        defaultValue={this.password} autoCapitalize={'none'} maxLength={20}
                        onChangeText={(text) => this.password = text} />

                    <CButton title={'登录'} onPress={() => this.doLogin()} />
                    <Text style={{ marginTop: 5, fontSize: 2 }}> </Text>
                    <CButton color={'#80cbc4'} title={'注册'} onPress={() => this.doReg()} />

                    <View style={styles.subButton}>
                        <Text style={styles.subButtonText} onPress={() => this.doLoginAnonymously()}>游客浏览</Text>
                        <Text style={styles.subButtonText} onPress={() => this.findAccount()}>找回密码</Text>
                    </View>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={{ marginTop: 16, fontSize: 12 }}>状态: {this.props.status}</Text>
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
        padding: 60,
        paddingTop: 120,
        backgroundColor: color.THEME_BACKGROUND
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: '500',
        color: color.THEME_LABEL,
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
        color: color.THEME_TEXT,
        fontSize: 14
    },
    loginInput: {
        marginBottom: 8,
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    message: {
        marginTop: 16,
        color: color.THEME_TEXT,
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
        login: (u, p) => dispatch(LoginAction.login(u, p)),
        loginAnonymously: () => dispatch(LoginAction.loginAnonymously()),
    })
)(LoginPage)

// export default Main;
