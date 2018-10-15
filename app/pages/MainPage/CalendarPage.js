import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';


<View style={styles.card}>
  <Agenda
    items={this.state.items}
    loadItemsForMonth={this.loadItems.bind(this)}
    selected={'2017-05-16'}
    renderItem={this.renderItem.bind(this)}
    renderEmptyDate={this.renderEmptyDate.bind(this)}
    rowHasChanged={this.rowHasChanged.bind(this)}
  />
</View>

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0)',
    // margin: 5,
    height: 550,
    padding: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0,
    shadowRadius: 3,
  },
})
