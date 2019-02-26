
import {Dimensions, Platform, PixelRatio} from 'react-native'

export let screenW = Dimensions.get('window').width;
export let screenH = Dimensions.get('window').height;
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

const X_MAX_R_WIDTH = 414;
const X_MAX_R_HEIGHT = 896;

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((screenH === X_HEIGHT && screenW === X_WIDTH) ||
            (screenH === X_WIDTH && screenW === X_HEIGHT))
    )
}

/**
 * 判断是否为iphoneXR/XSMAX
 * @returns {boolean}
 */
export function isIphoneXsmax() {
    return (
        Platform.OS === 'ios' &&
        ((screenH === X_MAX_R_HEIGHT && screenW === X_MAX_R_WIDTH) ||
            (screenH === X_MAX_R_WIDTH && screenW === X_MAX_R_HEIGHT))
    )
}

// var Parse = require('parse/react-native');

/**
 * 根据是否是iPhoneX返回不同的样式
 * @param iphoneXStyle
 * @param iphoneXsmaxStyle
 * @param iosStyle
 * @param androidStyle
 * @returns {*}
 */

export function ifIphoneX(iphoneXStyle, iphoneXsmaxStyle, iosStyle, androidStyle) {
    if (isIphoneX()) {
        return iphoneXStyle;
    } else if(isIphoneXsmax()) {
        return iphoneXsmaxStyle;
    } else if (Platform.OS === 'ios') {
        return iosStyle
    } else {
        if (androidStyle) return androidStyle;
        return iosStyle
    }
}


export default {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  onePixel: 1 / PixelRatio.get(),
  STATUSBAR_HEIGHT: (isIphoneX() || isIphoneXsmax() ? 44 :
  Platform.OS === 'ios' ? 20 : 0),
  APPBAR_HEIGHT: (Platform.OS === 'ios' ? 44 : 56),
}
