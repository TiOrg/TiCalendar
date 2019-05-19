import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import {
  Divider
} from "react-native-paper";
import {
  Button
} from "react-native-paper";
import styles from "./style";

import Icon from 'react-native-vector-icons/FontAwesome';



const drawerCover = require("../../assets/image/white.png");
const drawerImage = require("../../assets/image/T.png");
const datas = [
  {
    name: "设置",
    route: "Setting",
    icon: "bars",
    bg: "#C5F442"
  }, 
  {
    name: "学校信息绑定",
    route: "School",
    icon: "graduation-cap",
    bg: "#C5F442"
  },
  {
    name: "我的收藏",
    route: "Setting",
    icon: "heart",
    bg: "#C5F442"
  },{
    name: "关于",
    route: "Setting",
    icon: "info-circle",
    bg: "#C5F442"
  },
  {
    name: "退出登录",
    route: "Setting",
    icon: "sign-out",
    bg: "#C5F442"
  },
];


class SideBar extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          {/* <Image source={drawerCover} style={styles.drawerCover} /> */}
          {/* <Image square style={styles.drawerImage} source={drawerImage} /> */}
          <Text style={styles.logoText} >
        TiCalendar
          </Text>
          <Divider />
          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.props.navigator(data.route)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
        </Content>
        
      </Container>
    );
  }
}

export default SideBar;