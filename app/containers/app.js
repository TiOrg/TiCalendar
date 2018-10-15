import { StackNavigator, TabNavigator } from 'react-navigation';

import MainContainer from '../containers/MainContainer';

const TabContainer = TabNavigator(
  {
    Main: { screen: MainContainer }
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#3e9ce9',
      inactiveTintColor: '#999999',
      showIcon: true,
      style: {
        backgroundColor: '#fff'
      },
      indicatorStyle: {
        opacity: 0
      },
      tabStyle: {
        padding: 0
      }
    }
  }
);


// const App = TabNavigator (
//   {
//     Home: {
//       screen: MainContainer,
//       navigationOptions: {
//         headerLeft: null
//       }
//     }
//   },
//   {
//     headerMode: 'screen',
//     navigationOptions: {
//       headerStyle: {
//         backgroundColor: '#3e9ce9'
//       },
//       headerTitleStyle: {
//         color: '#fff',
//         fontSize: 20
//       },
//       headerTintColor: '#fff'
//     }
//   }
// );

const App = MainContainer;

export default App;