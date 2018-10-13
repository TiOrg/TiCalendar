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

import FacebookTabBar from './FacebookTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';


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

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu and fuck you',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  render() {
    return (



      <SafeAreaView style={styles.container}>
        {/* <Text style={styles.text}>Calendar with selectable date and arrows</Text> */}

        <ScrollableTabView
    style={{marginTop: 20, }}
    initialPage={1}
    renderTabBar={() => <FacebookTabBar />}
    tabBarPosition='bottom'
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
 }
});
