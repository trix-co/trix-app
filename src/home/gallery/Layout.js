import { Dimensions, NativeModules, PixelRatio, Platform, StyleSheet } from "react-native";

import { Header } from "react-navigation";
import { Constants } from "expo-constants";

const X_WIDTH = 375;
const X_HEIGHT = 812;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");
const isIPhoneX = Platform.OS === "ios" && D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH;

let windowDimensions = Dimensions.get("window");
let isSmallDevice = windowDimensions.width <= 320;

const notchHeight = isIPhoneX ? 15 : 0;

let Layout = {
    isSmallDevice,
    pixel: 1 / PixelRatio.get(),
    narrowSeparator: StyleSheet.hairlineWidth,
    separator: 1,
    tabBarHeight: 49,
    navigationBarDisplacement: 0,
    notchHeight,
    footerHeight: 49,
    marginHorizontal: isSmallDevice ? 10 : 15,
    statusBarHeight: 35,
    timestampWidth: 35,
    window: windowDimensions,
    height: windowDimensions.height - (Header.HEIGHT + notchHeight + 85),
    navigationBarHeight: 44,
    softButtonHeight: 48,
    navigationBarDisplacement: 25,
};

Layout.headerHeight = Platform.OS === "android" ? Header.HEIGHT + notchHeight + 10 : Header.HEIGHT + notchHeight;

export default Layout;
