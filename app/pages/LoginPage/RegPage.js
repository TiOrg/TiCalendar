import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import FacebookTabBar from '../MainPage/FacebookTabBar';
import CalendarPage from '../MainPage/CalendarPage';
import ScrollableTabView from 'react-native-scrollable-tab-view';
export default class MainPage extends Component{

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.card}>
          <Text> Test </Text>
        </View>

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
