import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig
} from '../../utils/CalendarUtils/index';
import SideBar from '../SideBar/index';
import Dialog, { 
  SlideAnimation, 
  ScaleAnimation,
  DialogTitle,
  DialogFooter,
  DialogButton,
  DialogContent 
} from 'react-native-popup-dialog';

import { Input } from 'react-native-elements';

import * as color from '../../assets/css/color';
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

import DatePicker from 'react-native-datepicker'

// import DatePicker from '../CalendarPage/DatePickerPage';

// import {}

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
  closeDrawer() {
    this._drawer._root.close()
  }
  openDrawer() {
    this._drawer._root.open()
  }
  static navigationOptions = {
    title: 'Details',
  };
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      date:""
    };
  }

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
                        this.setState({ visible: false });
                      }}
                    />
                    <DialogButton 
                      text="添加"
                      onPress={() => {}}
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
                  <Input
                    placeholder="    事件名称"
                  />
                  <DatePicker style={{paddingTop: 10}}
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    date={this.state.date}
                    mode="date"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
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
})
