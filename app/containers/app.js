import { StackNavigator, TabNavigator } from 'react-navigation';

// import MainContainer from '../containers/MainContainer';

import MainPage from '../pages/MainPage/MainPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegPage from '../pages/LoginPage/RegPage';

// const TabContainer = TabNavigator(
//   {
//     Main: { screen: MainContainer }
//   },
//   {
//     lazy: true,
//     tabBarPosition: 'bottom',
//     tabBarOptions: {
//       activeTintColor: '#3e9ce9',
//       inactiveTintColor: '#999999',
//       showIcon: true,
//       style: {
//         backgroundColor: '#fff'
//       },
//       indicatorStyle: {
//         opacity: 0
//       },
//       tabStyle: {
//         padding: 0
//       }
//     }
//   }
// );


const App = StackNavigator({
    Login: {screen: LoginPage}, // 登录页
    Reg: {screen: RegPage}, // 注册页
    Main: { // 主页面
        screen: MainPage, // tab导航配置
        navigationOptions: ({navigation}) => ({
            header: null // 去头部
        })
    }
}, {
    initialRouteName: 'Reg', // 默认登录页
    headerMode: 'screen'
});
export default App;
