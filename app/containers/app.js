import { StackNavigator, TabNavigator } from 'react-navigation';
import MainPage from '../pages/MainPage/MainPage';
// import SettingPage from '../pages/MainPage/SettingPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegPage from '../pages/LoginPage/RegPage';

const App = StackNavigator({
    Login: {screen: LoginPage}, // 登录页
    Reg: {screen: RegPage}, // 注册页
    // SettingPafe: {screen: SettingPage},
    Main: { // 主页面
        screen: MainPage, // tab导航配置
        navigationOptions: ({navigation}) => ({
            //header: null // 去头部
        })
    }
}, {
    initialRouteName: 'Login', // 默认登录页
    headerMode: 'screen'
});
export default App;
