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
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ValidButton,
  Linking
} from 'react-native';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig
} from 'react-native-calendars';





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





// import DatePicker from '../CalendarPage/DatePickerPage';

const uuidv1 = require('uuid/v1');

LocaleConfig.locales['zh-CN'] = {
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};

LocaleConfig.defaultLocale = 'zh-CN';

export default class CalendarPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userid: 0x0,
      visible: false,
      items: {},      // 当天的事件
      onChange: new Function,
      startDate: '',   // 
      endDate: '',
      eventNameText: '',
    };
    this.getUserId();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ items: nextProps.items });
  }

  getUserId() {
    storage.load({
      key: 'user'
    })
      .then(ret => {
        // console.log('user:', ret);
        // id = ret.objectId;
        // console.log('id:',ret.objectId);
        this.setState({ userid: ret.objectId });
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
    this.setState({ startDate: '' });
    this.setState({ endDate: '' });
    this.setState({ eventNameText: '' });
  }
  static navigationOptions = {
    title: 'Details',
  };

  refreshState(items) {
    console.log(items);
  }




  render() {
    return (

      // <View style={styles.card}>
      <Container>
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
            agendaTodayColor: color.THEME_LABEL,
            // selectedColor: color.FACEBOOK_BLUE,
            selectedDayBackgroundColor: color.THEME,
            todayTextColor: color.THEME,
            dotColor: color.FACEBOOK_BLUE,
            agendaKnobColor: color.THEME
          }}
        />
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
      for (let i = -150; i < 150; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
        }
      }

      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      this.setState({
        items: newItems
      });
    // await storage.load({
    //   key: 'event',
    //   id: this.state.userid
    // }).then(ret => {
    //   console.log('agenda userid: ' + this.state.userid);
    //   console.log('ret: ' + ret);
    // })
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  openURL(url) {
    Linking.openURL(url)
  }

  renderItem(item) {
    return (
      // <TouchableNativeFeedback onPress={this.openURL(item.url)}>

        <View style={[styles.item]}>
          <Text style={styles.itemtitle}>{item.title}</Text>
          <Text style={styles.itemcontent}>{item.content}</Text>
        </View>
      // </TouchableNativeFeedback>

    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>无事件</Text></View>
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

  itemtitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  itemcontent: {
    fontSize: 12

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
