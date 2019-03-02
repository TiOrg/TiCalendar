import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  DeviceInfo,
  AsyncStorage,
  Alert,
} from 'react-native';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig
} from 'react-native-calendars';
import SideBar from '../SideBar/index';
import Dialog, { 
  ScaleAnimation,
  DialogTitle,
  DialogFooter,
  DialogButton,
  DialogContent 
} from 'react-native-popup-dialog';

import { Input } from 'react-native-elements';

import * as color from '../../assets/css/color';
import * as EventAction from '../../action/AddEventAction';
// import stringToDate from '../../common/StringToDate';
// import * as GetUserInfo from '../../action/GetUserInfo';
import ScrollableTabView from 'react-native-scrollable-tab-view';
// import {Header} from 'react-native-elements';
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

import DatePicker from 'react-native-datepicker';



// import DatePicker from '../CalendarPage/DatePickerPage';

const uuidv1 = require('uuid/v1');


Drawer.defaultProps.styles.mainOverlay.elevation = 0;


LocaleConfig.locales['zh-CN'] = {
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
};

LocaleConfig.defaultLocale = 'zh-CN';

export default class CalendarPage extends Component {
  
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
    this.getUserId();
  }
  closeDrawer() {
    this._drawer._root.close()
  }
  openDrawer() {
    this._drawer._root.open()
  }

  getUserId() {
    storage.load({
        key: 'user'
    })
    .then(ret => {
        // console.log('user:', ret);
        // id = ret.objectId;
        // console.log('id:',ret.objectId);
        this.setState({userid: ret.objectId});
    })
    .catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        switch (err.name) {
        case 'NotFoundError':
            // TODO;
            break;
        case 'ExpiredError':
            // TODO
            break;
        }
    });
  }

  clearInputState() {
    this.setState({startDate: ''});
    this.setState({endDate: ''});
    this.setState({eventNameText: ''});
  }
  static navigationOptions = {
    title: 'Details',
  };
  



  render() {
    return (

      // <View style={styles.card}>
      <Container>
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
              <Title style={{ fontSize: 20, color: (Platform.OS === 'ios') ? 
                color.FACEBOOK_BLUE : color.WHITE }}>TiCalendar</Title>
            </Body>
            <Right>
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
                        this.setState({visible: false});
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
                        if(eventName === '') {
                          Alert.alert('错误提示','事件名称不能为空',[{text:"好"}]);
                        }
                        else if(startTime === '') {
                          Alert.alert('错误提示','请选择事件开始时间',[{text:"好"}]);
                        }
                        else if(startTime === '') {
                          Alert.alert('错误提示','请选择事件结束时间',[{text:"好"}]);
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
                dialogTitle={<DialogTitle title="手动添加事件"/>}
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
                    style={{paddingTop: 10}}
                    labelStyle={{fontSize: 20}}
                    placeholder=""
                    onChangeText={(text) => this.setState({eventNameText: text})}
                  />
                  <View style={styles.label_view}>
                    <Text style={styles.label}>
                      开始时间：
                    </Text>
                  </View>
                  <DatePicker style={{
                    paddingTop: 10,
                    width: 300}}
                    placeholder="点击此处或图标以选择时间"
                    format="YYYY-MM-DD HH:MM"
                    date={this.state.startDate}
                    mode="datetime"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
                    onDateChange={(date) => {this.setState({startDate: date})}}
                  />
                  <View style={styles.label_view}>
                    <Text style={styles.label}>
                      结束时间：
                    </Text>
                  </View>
                  <DatePicker style={{
                    paddingTop: 10,
                    width: 300}}
                    placeholder="点击此处或图标以选择时间"
                    format="YYYY-MM-DD HH:MM"
                    date={this.state.endDate}
                    mode="datetime"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
                    onDateChange={(date) => {this.setState({endDate: date})}}
                  />
                  
                </DialogContent>
              </Dialog>
                <Icon name='md-add' style={{ color: (Platform.OS === 'ios') ? 
                color.FACEBOOK_BLUE : color.WHITE }} />
              </Button>
            </Right>
          </Header>
          <Agenda
            items={this.state.items}
            loadItemsForMonth={this.loadItems.bind(this)}
            selected={this.getToday.bind(this)}
            renderItem={this.renderItem.bind(this)}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            rowHasChanged={this.rowHasChanged.bind(this)}
            theme={{
              // agendaDayTextColor: 'yellow',
              // agendaDayNumColor: 'green',
              // agendaTodayColor: 'red',
              // agendaKnobColor: FACEBOOK_BLUE
            }}
          />
        </Drawer>
      </Container>
      // </View>
    );
  }
  getToday() {
    var systemDate = new Date();
    var year = systemDate.getFullYear();
    var month = systemDate.getMonth() + 1;
    var day = systemDate.getDate();
    if (day < 10) { // 如果日小于10，前面拼接0
    }
    if (month < 10) { // 如果月小于10，前面拼接0
      month = '0' + month;
    }
    return [year, month, day].join('-');
  }


  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,

              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, { height: item.height }]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
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
    // padding: 15,
    // shadowColor: '#fff',
    // shadowOffset: { width: 2, height: 2, },
    // shadowOpacity: 0,
    // shadowRadius: 3,
  },

  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },

  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },

  label: {
    fontSize: 20,
    color: '#455a64',
  },
  label_view: {
    paddingLeft: 5,
    paddingTop: 10
  }
})
