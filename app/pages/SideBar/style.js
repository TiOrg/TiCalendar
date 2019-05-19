const React = require("react-native");
const { Platform, Dimensions } = React;


import * as color from '../../assets/css/color';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 3.5,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 140,
    resizeMode: "cover"
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  },
  logoText: {
    fontSize: Platform.OS === "ios" ? 41 : 39,
    fontWeight: "400",
    textAlign: "center",
    color: color.FACEBOOK_BLUE,
    // marginTop: Platform.OS === "android" ? -3 : undefined,
    marginTop: 100,
    marginBottom: Platform.OS === "ios" ? 90 : 90
  }
};
