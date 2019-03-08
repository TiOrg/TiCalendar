import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import CButton from '../../common/button';

import storage from '../../common/Storage';

// import { Input, Button } from 'react-native-elements'

import * as elements from 'react-native-elements';

import { 
    TextInput,
    Title,
    Button,
    Divider
 } from 'react-native-paper'

import * as LoginAction from '../../action/LoginAction';
import { getStackOptions } from '../../common/NavigatorOpts';

// import * as color from '../../assets/css/color'




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
        this.state = { 
            message: ''
        };
    }

    componentWillMount() {
        this.checkHasLogin();
    }

    

    checkHasLogin() {
        global.storage.load({
            key: 'user',
            //autoSync: false,
        }).then(ret => {
            console.log('hello titi');
            if (ret && ret.username) {
                console.log('用户已经登录：', ret);
                console.log('userid:', ret.objectId);
                var date = LoginAction.updateLoginTime(ret.objectId);
                console.log('fuck' + date);
                this.props.navigation.dispatch(resetAction);
            }
        }).catch(err => {
            // console.warn(err.message);
            // console.warn(err.message);
        });
        // this.props.navigation.dispatch(resetAction);
    }

    // 状态更新，判断是否登录并作出处理
    shouldComponentUpdate(nextProps, nextState) {
        // 登录完成,切成功登录
        if (nextProps.status === '登录成功' && nextProps.isSuccess) {
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
        if (!this.username) {
            this.updateState('message', '请输入用户名');
            return;
        }
        if (!this.password) {
            this.updateState('message', '请输入密码');
            return;
        }
        login(this.username, this.password);
    }

    doReg() {
        this.props.navigation.navigate('Reg');
    }


    render() {
        const { login } = this.props;
        let message = this.state && this.state.message ? this.state.message : '';
        return (
            // <SafeAreaView style={styles.container}>

                // <View style={styles.loginPage}>
                    <View style={styles.loginSection}>
                        <Title style={styles.loginTitle}>TiCalendar</Title>
                        <TextInput 
                            label='用户名'
                            mode='outlined'
                            
                            placeholder='请输入您的用户名或电子邮箱'
                            defaultValue={this.username} autoCapitalize={'none'} maxLength={30}
                            onChangeText={(text) => this.username = text} />
                        <Divider />
                        <TextInput 
                            label='密码'
                            mode='outlined'
                            placeholder='请输入您的密码' secureTextEntry={true}
                            defaultValue={this.password} autoCapitalize={'none'} maxLength={20}
                            onChangeText={(text) => this.password = text} />
                        
                        <Button 
                            // title={'登录'} 
                            onPress={() => this.doLogin()}
                            mode='contained'
                            style={{marginTop:20}}
                            >
                            登录
                        </Button>
                        
                        <Button 
                            onPress={() => this.doReg()} 
                            mode='contained'
                            style={{marginTop: 10}}
                        >
                            注册
                        </Button>
                        {/* <elements.Button
                            onPress={() => this.doLogin()}
                            title='登录'
                            style={{paddingTop: 20}}
                        >  */}

                        {/* </elements.Button>
                        <elements.Button
                            onPress={() => this.doReg()}
                            title='注册'
                            style={{paddingTop: 10}}
                        > */}

                        {/* </elements.Button> */}

                        <View style={styles.subButton}>
                            <Text style={styles.subButtonText} onPress={() => this.doReg()}>游客浏览</Text>
                            <Text style={styles.subButtonText} onPress={() => this.findAccount()}>找回密码</Text>
                        </View>
                        <Text style={styles.message}>{message}</Text>
                        <Text style={{ marginTop: 16, fontSize: 12 }}>状态: {this.props.status}</Text>
                    </View>
               // </View>

            // </SafeAreaView>
        );
    }



}

const styles = StyleSheet.create({
    loginPage: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: color.THEME_BACKGROUND
    },
    loginSection: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20
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
        // marginBottom: 8,
        paddingBottom: 20
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
    })
)(LoginPage)

// export default Main;
