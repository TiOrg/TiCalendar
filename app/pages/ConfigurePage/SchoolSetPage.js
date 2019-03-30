import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { 
    Text,
    TextInput,
    Title,
    Button,
    Divider
 } from 'react-native-paper';

 import Dialog, { 
    ScaleAnimation,
    DialogTitle,
    DialogFooter,
    DialogButton,
    DialogContent 
  } from 'react-native-popup-dialog';

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
import * as types from '../../constants/SchoolTypes'
// import console = require('console');

const resetAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Login' })
  ]
});

function dealInput() {
    let school_info = {
        studentid : this.studentid,
        studentpswd: this.studentpasswd
    };
    console.log('input dealing');
    // this.setState({ BindPageVisible: false });
    return dispatch => {
        dispatch(schoolBinded(school_info));
    }
    
    // schoolBinded(school_info);
    // 
    // let studentid = this.studentid;
    // let studentpswd = this.studentpasswd;
    
  }


class SchoolSetPage extends Component {
 
  static navigationOptions = getStackOptions('学生信息绑定');

  constructor(props) {
    super(props);
    this.state = { 
        message: '',
        BindPageVisible: false, 
        school: '',
        studentid: '',
        studentpasswd: '',
    };
  }

  clearInputState() {
    this.setState({studentid:'', studentpasswd:''});
  }

  

  getDialog() {
      return (
          <View>
              <Dialog
                height={0.32}
                width={0.6}
                visible={this.state.BindPageVisible}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="取消"
                            onPress={() => {
                            this.clearInputState();
                            this.setState({ BindPageVisible: false });
                            }}
                        />
                        <DialogButton
                            text="添加"
                            onPress={() => {
                                dealInput();
                                this.setState({ BindPageVisible: false });
                            }}
                        />
                    </DialogFooter>
                }
                dialogTitle={<DialogTitle title="学生信息绑定" />}
                dialogAnimation={new ScaleAnimation({
                    toValue: 0,
                    useNativeDriver: true,
                })}
                onTouchOutside={() => {
                    this.setState({ BindPageVisible: false });
                }}
                >
                <DialogContent>
                    <TextInput
                    labelStyle={{ fontSize: 20 }}
                    placeholder="请输入学号："
                    label="学号："
                    onChangeText={(text) => this.setState({ studentid: text })}
                    />
                    <TextInput
                    labelStyle={{ fontSize: 20 }}
                    placeholder="请输入密码："
                    secureTextEntry={true}
                    label="密码："
                    onChangeText={(text) => this.setState({ studentpasswd: text })}
                    />

                </DialogContent>
            </Dialog>
          </View>
        
      );
  }

  generateUnbind() {
      if(this.props.status === '未绑定学生信息') {
          return (
            <View>
                {
                    this.getDialog()
                }
                <Text style={{margin: 10}}>
                您当前的学校绑定情况为：{this.props.status}
                </Text>
                <Divider />
                <Button
                    onPress={() => {
                        console.log('绑定学生信息');
                        this.setState({BindPageVisible: true});
                    }}
                    mode='contained'
                    style={{marginTop:20}}
                >
                    绑定学生信息
                </Button>
                <Divider />
                <Button
                    onPress={() => console.log('退出登录')}
                    color='#d50000'
                    mode='contained'
                    style={{marginTop:10}}
                >
                    退出登录
                </Button>
            </View>
            
            
          );
      }
    //   else if(this)
  }

  quitLogin() {
    const { quit } = this.props;
    quit();
    this.props.navigation.dispatch(resetAction);
  }



  render() {

    return (

      <View style={styles.card}>
        
        {
            this.generateUnbind()
        }
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
  label: {
    fontSize: 20,
    color: '#455a64',
  },
  label_view: {
    paddingLeft: 5,
    paddingTop: 10
  },

})

function schoolBinded(school_info) {
    global.storage.save({
        key: 'schoolinfo',
        data: school_info
    });
    console.log('school binded.');
    return (
        type: types.SCHOOL_BIND_DONE
    )
}

export default connect(
  (state) => ({
    status: state.bindSchool.status,
  }),
  (dispatch) => ({
    schoolBinded: (s) => dispatch(schoolBinded(s)),
  })
)(SchoolSetPage)
