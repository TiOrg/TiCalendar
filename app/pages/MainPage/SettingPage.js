import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CButton from '../../common/button';
import {
  SafeAreaView,
  NavigationActions,
  StackActions,
  StackNavigator
} from 'react-navigation';
import {connect} from 'react-redux'; // 引入connect函数
import storage from '../../common/Storage';
import * as registerAction from '../../action/RegAction';// 导入action方法

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'Main'})
    ]
});

class SettingPage extends Component {
  constructor(props) {
      super(props);
      this.state = {message: ''};
  }

  quitLogin() {
    //const ({ navigate }) = this.props.navigation;
    this.props.navigate('Login');
    global.storage.load({
            key: 'user',
            //autoSync: false,
        }).then(ret => {
            if (ret && ret.username) {
              console.log('client login success.');
                console.log('用户已经登录：',ret.username);
                this.props.dispatch(resetAction);
            }
        }).catch(err => {
            // console.warn(err.message);
            console.warn(err.message);
        });
    global.storage.remove({
      key:'user'
    });
  }

  render() {
    return (
      <View style={styles.card}>
        <CButton style={styles.quitbutton} title={'退出登录'} onPress={() => this.quitLogin()}/>

      </View>
    );
  }



}
export default connect(
    (state) => ({
        status: state.loginIn.status,
        isSuccess: state.loginIn.isSuccess,
        user: state.loginIn.user,
    }),
    (dispatch) => ({
        login: (m, p) => dispatch(LoginAction.login(m, p)),
    })
)(SettingPage)




const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0)',
    // margin: 5,
    // height: 550,
    flex: 1,
    padding: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0,
    shadowRadius: 3,
  },

    quitbutton: {
        marginBottom: 8
    },
})
