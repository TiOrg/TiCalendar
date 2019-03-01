import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import CButton from '../../common/button';
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
        title: '退出登录',
        icon: 'exit-to-app'
    },
    {
        title: 'Trips',
        icon: 'flight-takeoff'
    },
]


class SettingPage extends Component {
    static navigationOptions = getStackOptions('设置');

    constructor(props) {
        super(props);

        this.state = { username: ''};
        global.storage.load({
            key: 'user',
        }).then(ret => {
            if (ret) {
                if (ret.displayName) {
                    this.updateState('username', ret.displayName);
                }
                else if (ret.isAnonymous) {
                    this.updateState('username', 'Unknown');
                }
                else{
                    this.updateState('username', 'error');
                }
            }
        }).catch(err => {
            console.log(err.message);
        });
        console.log(this.state.username);
    }

    updateState(key, val) {
        let state = this.state;
        state[key] = val;
        this.setState(state);
    }
    
    quitLogin() {
        const { quit } = this.props;
        quit();
        this.props.navigation.dispatch(resetAction);
    }

    render() {

        return (

            <View style={styles.card}>
                <Text style={styles.loginTitle}>当前用户: {this.state.username}</Text>
                <View>
                    {
                        list.map((item, i) => (
                            <ListItem
                                key={i}
                                title={item.title}
                                leftIcon={{ name: item.icon }}
                            />
                        ))
                    }
                </View>
                <CButton color={color.BUTTON_RED} title={'退出登录'} onPress={() => this.quitLogin()} />

            </View>
        );
    }
}
const styles = StyleSheet.create({
    loginTitle: {
        fontSize: 28,
        fontWeight: '500',
        color: color.THEME_LABEL,
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 32
    },

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
