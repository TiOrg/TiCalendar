import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import {
  SafeAreaView,
  NavigationActions,
  StackActions
} from 'react-navigation';
import { connect } from 'react-redux'; // 引入connect函数
import * as registerAction from '../../action/RegAction';// 导入action方法
import { THEME_BACKGROUND, THEME_TEXT, THEME_LABEL } from '../../assets/css/color';
import { getStackOptions } from '../../common/NavigatorOpts';
import CButton from '../../common/button';

// 清空导航记录，跳转到首页
// const resetAction = NavigationActions.reset({
//     index: 0,
//     actions: [
//         NavigationActions.navigate({routeName: 'Login'})
//     ]
// });

const resetAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Login' }),
    // NavigationActions.navigate({ routeName: 'settings' })
  ]
});
// navigation.dispatch(resetAction);

class RegPage extends Component {

  static navigationOptions = getStackOptions('注册');
  username = '';
  password = '';
  password2 = '';
  email = '';

  constructor(props) {
    super(props);
    this.state = { 
      user: null,
      isSuccess: false
    };
  }

  goBack() {
    this.props.navigation.goBack();
  }

  // 状态更新
  shouldComponentUpdate(nextProps) {
    // 注册成功,切到登录
    if (nextProps.isSuccess) {
      this.props.navigation.dispatch(resetAction);
      return false;
    }
    return true;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.regPage}>
          <Text style={styles.loginTitle}>TiCalendar</Text>

          <TextInput style={styles.regInput} placeholder='电子邮箱' keyboardType={'email-address'}
            autoCapitalize={'none'} maxLength={30}
            onChangeText={(text) => this.email = text} />

          <TextInput style={styles.regInput} placeholder='用户名'
            autoCapitalize={'none'} maxLength={30}
            onChangeText={(text) => this.username = text} />

          <TextInput style={styles.regInput} placeholder='密码' secureTextEntry={true}
            autoCapitalize={'none'} maxLength={30}
            onChangeText={(text) => this.password = text} />

          <TextInput style={{marginBottom: 30}} placeholder='确认密码' secureTextEntry={true}
            autoCapitalize={'none'} maxLength={30}
            onChangeText={(text) => this.password2 = text} />

          <CButton style={styles.regInput} title={'提交'} onPress={() => this.doReg()} />
        </View>

      </SafeAreaView>
    );
  }

  doReg() {
    const { reg } = this.props;
    
    if (!this.email || this.email.length < 4) {
      alert('请输入电子邮箱');
      return;
    }
    if (!this.username) {
      alert('请输入用户名');
      return;
    }
    if (!this.password) {
      alert('请输入登录密码');
      return;
    }
    if (this.password.length < 4) {
      alert('密码需大于等于5位');
      return;
    }
    if (!this.password2) {
      alert('请输入确认密码');
      return;
    }

    if (this.password !== this.password2) {
      alert('前后两次密码不一致');
      return;
    }
    reg(this.username, this.password, this.email);
  }
}

const styles = StyleSheet.create({
  loginTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: THEME_LABEL,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  regPage: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: THEME_BACKGROUND
  },
  regInput: {
    marginBottom: 8
  },
  message: {
    marginTop: 20,
    color: THEME_TEXT,
    fontSize: 12
  }


});

export default connect(
  (state) => ({
    user: state.reg.user,
    isSuccess: state.reg.isSuccess
  }),
  (dispatch) => ({
    reg: (u, p, e) => dispatch(registerAction.reg(u, p, e)),
  })
)(RegPage)

// export default Main;
