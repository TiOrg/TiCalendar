import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { Drawer } from 'native-base';

export default class MyDrawer extends Component {
  render() {
    closeDrawer = () => {
      this.drawer._root.close()
    };
    openDrawer = () => {
     this.drawer._root.open()
   };
   return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        // content={<SideBar navigator={this.navigator} />}
        content={<Text>hahaha</Text>}
        onClose={() => this.closeDrawer()} >
      // Main View
      </Drawer>
    );
  }
}
