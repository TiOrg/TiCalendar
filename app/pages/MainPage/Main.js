import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import FacebookTabBar from './FacebookTabBar';
import CalendarPage from './CalendarPage';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {combineReducers} from 'redux';
export default class App extends Component{

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <ScrollableTabView
          // style={{marginTop: 20, }}
          initialPage={0}
          renderTabBar={() => <FacebookTabBar />}
          tabBarPosition='bottom'>

            <View tabLabel="ios-paper" style={styles.tabView}>
              <CalendarPage />
            </View>

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


});

// export default Main;
