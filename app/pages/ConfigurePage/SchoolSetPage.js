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
    Divider,
    ActivityIndicator,
    Snackbar
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
import * as color from '../../assets/css/color';
import * as types from '../../constants/SchoolTypes'
import * as SchoolActions from '../../action/SetSchoolAction'
// import console = require('console');

const resetAction = StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'School' })
  ]
});



class SchoolSetPage extends Component {
    componentWillMount() {
        this.checkHasBind();
    }
    dealInput() {
        console.log('input dealing props');
        console.log(this.props);
        const { bind } = this.props;
        bind(this.state.studentid, this.state.studentpasswd);
        let id = this.state.studentid;
        this.setState({
            BindPageVisible: false,
            localBind: true,
            studentid: id,
            BindAlertVisible: true,
        });
    }
 
    static navigationOptions = getStackOptions('学生信息绑定');

    constructor(props) {
        super(props);
        this.state = { 
            message: '',
            BindPageVisible: false, 
            school: '',
            studentid: '',
            studentpasswd: '',
            loadingDone: false,
            localBind: false,
            UnbindAlertVisible: false,
            BindAlertVisible: false,
        };
    }

    unbindStudent() {
        // 将当前绑定的学生信息取消，以重新绑定
        const { unbind } = this.props;
        this.setState({
            localBind: false,
            studentid: '',
            studentpasswd: '',
            UnbindAlertVisible: true,
        });
        unbind();
    }

    // shouldComponentUpdate(nextprops, nextstate) {
        
    //     return true;
    // }

    checkHasBind() {
        global.storage.load({
            key: 'schoolinfo',
        }).then(ret => {
            console.log('从本地存储中查询到绑定信息：', ret);
            if( ret && ret.studentid ) {
                console.log('用户已经绑定学生信息');
                console.log('学号：', ret.studentid);
                this.setState({
                    studentid: ret.studentid,
                    localBind: true
                });

                // this.props.navigation.dispatch(resetAction);
            }
            this.setState({
                loadingDone: true
            })
        }).catch(err = {

        });
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
                                this.dealInput();
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

  studentInfoArea() {
      if(this.props.school_status === '学生信息绑定完成' || this.state.localBind) {
        
        return this.generateBinded();
      }
      else {
        return this.generateUnbind();
      }
  }

  generateBinded() {
    return (
        <View>
            <Text style={{margin: 10}}>
            {/* 您当前的学校绑定情况为：{this.props.school_status} */}
            您当前绑定了学号为 { this.state.studentid } 的学生信息。
            </Text>
            <Button
                onPress={() => {
                    console.log('解除绑定')
                    this.unbindStudent()
                }}
                color='#d50000'
                mode='contained'
                style={{marginTop:10}}
            >
                解除绑定
            </Button>
        </View>
        
    );
  }

  generateUnbind() {
    return (
        <View>
            <Text style={{margin: 10}}>
            {/* 您当前的学校绑定情况为：{this.props.school_status} */}
            您当前未绑定学生信息，进行绑定后才可自动获取通知信息！
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



  render() {

    return (

      <View style={styles.card}>
        {
            this.studentInfoArea()
        }
        {
            this.getDialog()
        }
        <Snackbar
            visible={this.state.UnbindAlertVisible}
            onDismiss={() => this.setState({ UnbindAlertVisible: false})}
            action={{
                label:'我知道了',
                onPress: () => {
                    // Do something
                },
            }}
        >
        学生信息解绑完成
        </Snackbar>
        <Snackbar
            visible={this.state.BindAlertVisible}
            onDismiss={() => this.setState({ BindAlertVisible: false})}
            action={{
                label:'我知道了',
                onPress: () => {
                    // Do something
                },
            }}
        >
        学生信息绑定完成，学号{this.state.studentid}
        </Snackbar>
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

export default connect(
  (state) => ({
    school_status: state.bindSchool.school_status,
    bind_is_success: state.bindSchool.bind_is_success,
  }),
  (dispatch) => ({
    bind: (u, p) => dispatch(SchoolActions.bind(u, p)),
    unbind: () => dispatch(SchoolActions.unbind()),
  })
)(SchoolSetPage)
