import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CButton from '../../common/button';
import {
  NavigationActions,
  StackActions,
  StackNavigator
} from 'react-navigation';
import {connect} from 'react-redux'; // 引入connect函数
import storage from '../../common/Storage';

import * as LoginAction from '../../action/LoginAction';


class SettingPage extends Component {
  constructor(props) {
	  super(props);
	  this.state = {message: ''};
  }

  quitLogin() {
	//const ({ navigate }) = this.props.navigation;
	this.props.navigate('Login');

	this.props.dispatch(LoginAction.quit());
	// console.log(this.props.status);
  }

  render() {
	return (
	  <View style={styles.card}>
		<CButton color={'#ef9a9a'} title={'退出登录'} onPress={() => this.quitLogin()}/>

	  </View>
	);
  }
}

export default connect(
	(dispatch) => ({
		quit: () => dispatch(LoginAction.quit()),
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

})

