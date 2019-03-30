import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { 
  TextInput,
  Title,
  Button,
  Divider
} from 'react-native-paper'

import Icon from 'react-native-vector-icons/FontAwesome';
import { List, ListItem } from 'react-native-elements';
import {
  NavigationActions,
  StackActions,
  StackNavigator
} from 'react-navigation';
import { connect } from 'react-redux'; // 引入connect函数
import storage from '../../common/Storage';
import { getStackOptions } from '../../common/NavigatorOpts';

import * as LoginAction from '../../action/LoginAction';
import * as color from '../../assets/css/color';

const resetAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Login' })
  ]
});

const list = [
  {
    title: '学校信息绑定',
    icon: 'school'
  },
  {
    title: '退出登录',
    icon: 'exit-to-app'
  },
]


class SettingPage extends Component {
  static navigationOptions = getStackOptions('设置');

  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  quitLogin() {
    const { quit } = this.props;
    quit();
    this.props.navigation.dispatch(resetAction);
  }



  render() {

    return (

      <View style={styles.card}>
        <View>
          {
            list.map((item, i) => (
              <ListItem
                key={i}
                title={item.title}
                leftIcon={{ name: item.icon }}
                onpress={() => this.quitLogin()}
              />
            ))
          }
        </View>
        {/* <CButton color={color.BUTTON_RED} title={'退出登录'} onPress={() => this.quitLogin()} /> */}
        <Button 
            // title={'登录'} 
            onPress={() => this.quitLogin()}
            mode='contained'
            style={{marginTop:20}}
            >
            退出登录
        </Button>
      </View>
    );
  }
}
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

})

export default connect(
  (state) => ({
    status: state.loginIn.status,
    isSuccess: state.loginIn.isSuccess,
    user: state.loginIn.user,
  }),
  (dispatch) => ({
    quit: () => dispatch(LoginAction.quit()),
  })
)(SettingPage)
