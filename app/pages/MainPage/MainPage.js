import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';


import { Input } from 'react-native-elements';

import FacebookTabBar from './FacebookTabBar';
import CalendarPage from './CalendarPage';
import AgendaPage from './AgendaPage';
import SettingPage from './SettingPage';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Drawer
} from 'native-base';
import * as color from '../../assets/css/color';

import SideBar from '../SideBar/index';

import DatePicker from 'react-native-datepicker';

import * as RefreshAction from '../../action/RefreshAction'

import Dialog, { 
  ScaleAnimation,
  DialogTitle,
  DialogFooter,
  DialogButton,
  DialogContent 
} from 'react-native-popup-dialog';

const uuidv1 = require('uuid/v1');

// import DatePicker from 'react-native-datepicker';
import * as EventAction from '../../action/AddEventAction';

Drawer.defaultProps.styles.mainOverlay.elevation = 0;


export default class MainPage extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      userid: 0x0,
      visible: false,
      items: {},      // 当天的事件
      startDate: '',   // 
      endDate: '',
      eventNameText: '',
    };
  }
  componentWillMount() {
    this.getAllAgenda();
}

  clearInputState() {
    this.setState({ startDate: '' });
    this.setState({ endDate: '' });
    this.setState({ eventNameText: '' });
  }
  


  async getAllAgenda() {
    //pull
    // alert('pulling all agenda from database...');
    // 从云端拉取所有events数据存储到storage
    var events = await RefreshAction.pullEvents(); 

    // console.log('get events:');
    // console.log(events);

    events.forEach(event => {
      const strTime = event.dateTime.toISOString().split('T')[0];
      this.state.items[strTime] = [];

  });

  events.forEach(event => {
    const strTime = event.dateTime.toISOString().split('T')[0];
    this.state.items[strTime].push({
      name: event.content,
      height: 50
      });
    });

  console.log('items:')
  console.log(this.state.items);

  const newItems = {};
  Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
  this.setState({
    items: newItems
  });
  
    // 将所有数据显示在日历上
    // TODO
  }

  closeDrawer() {
    this._drawer._root.close()
  }
  openDrawer() {
    this._drawer._root.open()
  }



  render() {
    const { navigate, dispatch } = this.props.navigation;
    return (
      // <SafeAreaView style={styles.container}>
        <Drawer
          ref={(ref) => { this._drawer = ref; }}
          content={<SideBar navigator={this.navigator} />}
          onClose={() => this.closeDrawer()} >
          
            
            <Header>
              <Left>
                <Button
                  transparent
                  onPress={() => this.openDrawer()}
                >
                  <Icon name="md-menu" style={{ color: (Platform.OS === 'ios') ? 
                  color.FACEBOOK_BLUE : color.WHITE }} />
                </Button>
              </Left>
              <Body>
                <Title style={{
                  fontSize: 20, color: (Platform.OS === 'ios') ?
                    color.FACEBOOK_BLUE : color.WHITE
                }}>TiCalendar</Title>
              </Body>
              <Right>
                <Button
                  transparent
                  onPress={() => {
                    this.getAllAgenda();
                  }} >
                  <Icon name='md-refresh' style={{
                    color: (Platform.OS === 'ios') ?
                      color.FACEBOOK_BLUE : color.WHITE
                  }} />
                </Button>

                <Button
                  transparent
                  onPress={() => {
                    this.setState({ visible: true });
                  }}
                >
                  <Dialog
                    // height={0.5}
                    visible={this.state.visible}
                    footer={
                      <DialogFooter>
                        <DialogButton
                          text="取消"
                          onPress={() => {
                            this.clearInputState();
                            this.setState({ visible: false });
                          }}
                        />
                        <DialogButton
                          text="添加"
                          onPress={() => {
                            // 按下添加按钮后的功能
                            // 首先验证输入是否完整
                            // console.log('获取所有数据');
                            // storage.getAllDataForKey('event').then(events => {
                            //   console.log(events);
                            // })
                            // storage.clearMap();
                            let eventName = this.state.eventNameText;
                            let startTime = this.state.startDate;
                            let endTime = this.state.endDate;
                            if (eventName === '') {
                              Alert.alert('错误提示', '事件名称不能为空', [{ text: "好" }]);
                            }
                            else if (startTime === '') {
                              Alert.alert('错误提示', '请选择事件开始时间', [{ text: "好" }]);
                            }
                            else if (startTime === '') {
                              Alert.alert('错误提示', '请选择事件结束时间', [{ text: "好" }]);
                            }
                            else {
                              // 输入合法，准备保存事件信息
                              // 生成本地唯一的uuid，保证事件数据不被覆盖
                              let id = uuidv1();
                              EventAction.add(id, eventName, startTime, endTime);
                              // EventAction.load(id);
                              this.clearInputState();
                              this.setState({ visible: false });
                            }
                          }}
                        />
                      </DialogFooter>
                    }
                    dialogTitle={<DialogTitle title="手动添加事件" />}
                    dialogAnimation={new ScaleAnimation({
                      toValue: 0,
                      useNativeDriver: true,
                    })}
                    onTouchOutside={() => {
                      this.setState({ visible: false });
                    }}
                  >
                    <DialogContent>
                      <View style={styles.label_view}>
                        <Text style={styles.label}>
                          事件名称：
                      </Text>
                      </View>
                      <Input
                        style={{ paddingTop: 10 }}
                        labelStyle={{ fontSize: 20 }}
                        placeholder=""
                        onChangeText={(text) => this.setState({ eventNameText: text })}
                      />
                      <View style={styles.label_view}>
                        <Text style={styles.label}>
                          开始时间：
                        </Text>
                      </View>
                      <DatePicker style={{
                        paddingTop: 10,
                        width: 300
                      }}
                        placeholder="点击此处或图标以选择时间"
                        format="YYYY-MM-DD HH:MM"
                        date={this.state.startDate}
                        mode="datetime"
                        confirmBtnText="确认"
                        cancelBtnText="取消"
                        onDateChange={(date) => { this.setState({ startDate: date }) }}
                      />
                      <View style={styles.label_view}>
                        <Text style={styles.label}>
                          结束时间：
                        </Text>
                      </View>
                      <DatePicker style={{
                        paddingTop: 10,
                        width: 300
                      }}
                        placeholder="点击此处或图标以选择时间"
                        format="YYYY-MM-DD HH:MM"
                        date={this.state.endDate}
                        mode="datetime"
                        confirmBtnText="确认"
                        cancelBtnText="取消"
                        onDateChange={(date) => { this.setState({ endDate: date }) }}
                      />

                    </DialogContent>
                  </Dialog>
                  <Icon name='md-add' style={{
                    color: (Platform.OS === 'ios') ?
                      color.FACEBOOK_BLUE : color.WHITE
                  }} />
                </Button>
              </Right>
            </Header>
            <ScrollableTabView
            // style={{marginTop: 20, }}
            initialPage={1}
            renderTabBar={() => <FacebookTabBar />}
            tabBarPosition='bottom'>
            <View tabLabel="ios-paper" style={styles.tabView}>
              <CalendarPage />
            </View>

            {/* <ScrollView tabLabel="ios-people" style={styles.tabView}>
              <View style={styles.card}>
                <Text>Friends</Text>
              </View>
            </ScrollView>

            <ScrollView tabLabel="ios-chatboxes" style={styles.tabView}>
              <View style={styles.card}>
                <Text>Messenger</Text>
              </View>
            </ScrollView> */}

            <View tabLabel="ios-notifications" style={styles.tabView}>
              <AgendaPage items = {this.state.items} onChange={val => this.setState({items: val})}/>
            </View>

            <ScrollView tabLabel="ios-list" style={styles.tabView}>
              <SettingPage  />
            </ScrollView>

          </ScrollableTabView>
        </Drawer>
      // </SafeAreaView>
    );
  }



}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },

  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0)',
    // margin: 5,
    height: 500,
    // flex: 1,
    padding: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0,
    shadowRadius: 3,
  },

  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  label: {
    fontSize: 20,
    color: '#455a64',
  },
  label_view: {
    paddingLeft: 5,
    paddingTop: 10
  }
});

// export default Main;
