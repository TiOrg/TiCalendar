# TiCalendar 📆

TiCalendar是一个智能日历应用，致力于提取网络关键信息并智能生成日历事件。

目前，TiCalendar致力于为高校学生提供便捷的日程信息获取功能，用户输入学生教务信息后，应用可以自动获取教务网站上的通知信息并获取到本地进行储存。目前，我们的应用支持同济大学学生使用。

### iOS端
 ![LoginPage](./screenshots/LoginPage.png) ![CalendarPage](./screenshots/CalendarPage.png)![Binding](./screenshots/Binding.png)

### Android端
![Android_login](./screenshots/Android_login.png) ![Android_page](./screenshots/Android_page.png) ![Android_page](./screenshots/Android_event.png)

## 项目适用平台

iOS 9.0+  Android 5.0+

参与代码编写：Zealoft simon0628



## 下载源码并安装应用

项目基于React Native进行编写，React Native开发环境的具体搭建请参考[React Native官方网站](https://facebook.github.io/react-native/)

开发环境搭建完成后，首先将代码克隆到本地，并借助npm工具进行安装
```shell
git clone git@github.com:TiOrg/TiCalendar.git
cd TiCalendar
npm install
```



## 项目的整体结构

### 1.文件框架结构
所有的JavaScript代码文件存放在根目录下的app目录中。其中UI的主要设计部分在pages目录，登录注册等按钮逻辑在action目录中，其余涉及到react以及redux的部分核心代码可以在store目录找到。此处主要考虑UI设计的改善，故关注pages目录即可。pages目录中的核心UI是LoginPage、MainPage和CalendarPage三个目录中的相关文件，分别对应登录页、两种视图方式的主页面。主页面的Drawer视图在SideBar子目录中，WelcomPage目前无意义。


## 项目的包依赖

​	请参考<https://github.com/TiOrg/TiCalendar/network/dependencies>
