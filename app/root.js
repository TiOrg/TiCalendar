import React from 'react';

import App from './containers/app';
// import { Provider } from 'react-redux';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Component } from 'react';

import * as color from './assets/css/color';
const store = configureStore();
store.subscribe(() => {
    //监听state变化
    console.log(store.getState());
});

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: color.FACEBOOK_BLUE,
      accent: '#f1c40f',
    }
  };

export default class Root extends Component {
    render() {
        return (
            // 实现app和store的关联，等于整个系统的组件都被包含住了
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <App />
                </PaperProvider>
                
            </Provider>
        )
    }
}
