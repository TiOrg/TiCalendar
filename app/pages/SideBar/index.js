import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import {
  Button
} from "react-native-paper";
import styles from "./style";

const drawerCover = require("../../assets/image/drawer-cover.png");
const drawerImage = require("../../assets/image/logo-kitchen-sink.png");
const datas = [
  {
    name: "设置",
    route: "Setting",
    icon: "md-menu",
    bg: "#C5F442"
  }, 
  {
    name: "学校信息绑定",
    route: "School",
    icon: "school",
    bg: "#C5F442"
  }
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
          <Image source={drawerCover} style={styles.drawerCover} />
          <Image square style={styles.drawerImage} source={drawerImage} />

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
          <Button
              onPress={() => this.quitLogin()}
              color='#d50000'
              mode='contained'
              compact={true}
              style={{
                margin:20
              }}
          >
              退出登录
          </Button>
        </Content>
        
      </Container>
    );
  }
}

export default SideBar;
