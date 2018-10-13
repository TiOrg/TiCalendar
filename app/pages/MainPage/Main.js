import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig
} from 'react-native-calendars';

import { SafeAreaView } from 'react-navigation';


import ScrollableTabView, { ScrollableTabBar, }  from 'react-native-scrollable-tab-view';
import FacebookTabBar from './FacebookTabBar';


// import ScreenUtil from '../ScreenUtil';



// const screenWeight = ScreenUtil.width;
// const



LocaleConfig.locales['zh-CN'] = {
  monthNames: ['一月','二月','三月','四月','五月','六月',
  '七月','八月','九月','十月','十一月','十二月'],
  monthNamesShort: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
  dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
  dayNamesShort: ['日','一','二','三','四','五','六']
};

LocaleConfig.defaultLocale = 'zh-CN';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu and fuck you',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

type Props = {};
export default class Main extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollableTabView
    style={{marginTop: 20, }}
    initialPage={1}
    renderTabBar={() => <FacebookTabBar />}
  >
    <ScrollView tabLabel="ios-paper" style={styles.tabView}>
      <View style={styles.card}>
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          markedDates={{[this.state.selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}}}
        />
      </View>
    </ScrollView>
    <ScrollView tabLabel="ios-people" style={styles.tabView}>
      <View style={styles.card}>
        <Text>Friends</Text>
      </View>
    </ScrollView>
    <ScrollView tabLabel="ios-chatboxes" style={styles.tabView}>
      <View style={styles.card}>
        <Text>Messenger</Text>
      </View>
    </ScrollView>
    <ScrollView tabLabel="ios-notifications" style={styles.tabView}>
      <View style={styles.card}>
        <Text>Notifications</Text>
      </View>
    </ScrollView>
    <ScrollView tabLabel="ios-list" style={styles.tabView}>
      <View style={styles.card}>
        <Text>Other nav</Text>
      </View>
    </ScrollView>
  </ScrollableTabView>



      </SafeAreaView>


    );
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
  }
}

const styles = StyleSheet.create({
  calendar: {
   borderTopWidth: 1,
   paddingTop: 5,
   borderBottomWidth: 1,
   borderColor: '#eee',
   height: 350
 },
 container: {
   flex: 1,
   backgroundColor: 'white'
 },
 tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
