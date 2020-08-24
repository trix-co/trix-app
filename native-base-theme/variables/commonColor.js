// @flow
import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";
import { Theme } from "../../src/components/Theme";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;

const white = "white";
const black = "rgb(29, 29, 38)";
const gray =  "#bbbbbe";
const lightGray = "#f8f8f8";

export default {
  platformStyle,
  platform,
    // AndroidRipple
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",

    // Badge
  badgeBg: "#ED1727",
  badgeColor: "#fff",
    // New Variable
  badgePadding: (platform === "ios") ? 3 : 0,

    // Button
  btnFontFamily: Theme.typography.large.fontFamily,
  btnDisabledBg: "transparent",
  btnDisabledClr: "#f1f1f1",

    // CheckBox
  CheckboxRadius: (platform === "ios") ? 13 : 0,
  CheckboxBorderWidth: (platform === "ios") ? 1 : 2,
  CheckboxPaddingLeft: (platform === "ios") ? 4 : 2,
  CheckboxPaddingBottom: (platform === "ios") ? 0 : 5,
  CheckboxIconSize: (platform === "ios") ? 21 : 14,
  CheckboxIconMarginTop: (platform === "ios") ? undefined : 1,
  CheckboxFontSize: (platform === "ios") ? (23 / 0.9) : 18,
  DefaultFontSize: 17,
  checkboxBgColor: "#039BE5",
  checkboxSize: 20,
  checkboxTickColor: "#fff",

  // Segment
  segmentBackgroundColor: "#3F51B5",
  segmentActiveBackgroundColor: "#fff",
  segmentTextColor: "#fff",
  segmentActiveTextColor: "#3F51B5",
  segmentBorderColor: "#fff",
  segmentBorderColorMain: "#3F51B5",

    // New Variable
  get defaultTextColor(): string {
    return this.textColor;
  },

  get btnPrimaryBg(): string {
    return this.brandPrimary;
  },
  get btnPrimaryColor(): string {
    return this.inverseTextColor;
  },
  get btnInfoBg(): string {
    return this.brandInfo;
  },
  get btnInfoColor(): string {
    return this.inverseTextColor;
  },
  get btnSuccessBg(): string {
    return this.brandSuccess;
  },
  get btnSuccessColor(): string {
    return this.inverseTextColor;
  },
  get btnDangerBg(): string {
    return this.brandDanger;
  },
  get btnDangerColor(): string {
    return this.inverseTextColor;
  },
  get btnWarningBg(): string {
    return this.brandWarning;
  },
  get btnWarningColor(): string {
    return this.inverseTextColor;
  },
  get btnTextSize(): number {
    return Theme.typography.large.fontSize;
  },
  get btnTextSizeLarge(): number {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall(): number {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge(): number {
    return 3;
  },

  buttonPadding: 6,

  get iconSizeLarge(): number {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall(): number {
    return this.iconFontSize * 0.6;
  },

    // Card
    cardDefaultBg: "#fff",

    // Color
    brandPrimary: Theme.palette.primary,
    brandInfo: Theme.palette.info,
    brandSecondary: Theme.palette.secondary,
    brandSuccess: Theme.palette.success,
    brandDanger: Theme.palette.danger,
    brandWarning: Theme.palette.warning,
    brandSidebar: Theme.palette.sidebar,
    white,
    black,
    gray,
    lightGray,

    // Font
    fontFamilyThin: Theme.typography.light,

    fontFamily: Theme.typography.normal,
    fontSizeBase: Theme.typography.regular.fontSize,
    lineHeight: Theme.typography.regular.lineHeight,

    fontSizeH1: 44,
    lineHeightH1: 56,

    fontSizeH2: 32,
    lineHeightH2: 36,

    fontSizeH3: 24,
    lineHeightH3: 28,
    fontFamilyH3: Theme.typography.light,

    // Footer
    footerHeight: 55,
    get footerDefaultBg(): string {
        return this.brandInfo;
    },

    // FooterTab
    tabBarTextColor: "white",
    tabBarTextSize: (platform === "ios") ? 14 : 11,
    activeTab: (platform === "ios") ? "#007aff" : "#fff",
    sTabBarActiveTextColor: "#007aff",
    tabBarActiveTextColor: "#fff",
    tabActiveBgColor: (platform === "ios") ? "#1569f4" : undefined,

    // Tab
    tabDefaultBg: "white",
    topTabBarTextColor: "#b3c7f9",
    topTabBarActiveTextColor: "#fff",
    topTabActiveBgColor: (platform === "ios") ? "#1569f4" : undefined,
    topTabBarBorderColor: "#fff",
    get topTabBarActiveBorderColor(): string { return this.brandInfo; },

  // Header
  toolbarBtnColor: black,
  toolbarDefaultBg: "white",
  toolbarHeight: (platform === "ios") ? 64 : 56,
  toolbarIconSize: (platform === "ios") ? 20 : 22,
  toolbarSearchIconSize: (platform === "ios") ? 20 : 23,
  toolbarInputColor: (platform === "ios") ? "#CECDD2" : "#fff",
  searchBarHeight: (platform === "ios") ? 30 : 40,
  toolbarInverseBg: "#222",
  toolbarTextColor: black,
  iosStatusbar: "dark-content",
  toolbarDefaultBorder: "#2874F0",

  get statusBarColor(): string {
    return color(this.toolbarDefaultBg).darken(0.2).hex();
  },

// Icon
  iconFamily: "Ionicons",
  iconFontSize: (platform === "ios") ? 30 : 28,
  iconMargin: 7,
  iconHeaderSize: (platform === "ios") ? 33 : 24,

    // InputGroup
  inputFontSize: 17,
  inputBorderColor: "#D9D5DC",
  inputSuccessBorderColor: "#2b8339",
  inputErrorBorderColor: "#ed2f2f",

  get inputColor(): string {
    return this.textColor;
  },
  get inputColorPlaceholder(): string {
    return gray;
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon(): number {
    return this.inputPaddingLeft * 8;
  },

  btnLineHeight: 24,
  iconLineHeight: (platform === "ios") ? 37 : 30,

    // List
  listBorderColor: "#c9c9c9",
  listDividerBg: lightGray,
  listItemHeight: 45,
  listBtnUnderlayColor: "#DDD",

    // Card
  cardBorderColor: "#ccc",

    // Changed Variable
  listItemPadding: 0,

  listNoteColor: "#808080",
  listNoteSize: 13,

    // Progress Bar
  defaultProgressColor: "#E4202D",
  inverseProgressColor: "#1A191B",

    // Radio Button
  radioBtnSize: (platform === "ios") ? 25 : 23,
  radioSelectedColorAndroid: "#5067FF",

    // New Variable
  radioBtnLineHeight: (platform === "ios") ? 29 : 24,

  radioColor: "#7e7e7e",

  get radioSelectedColor(): string {
    return color(this.radioColor).darken(0.2).hex();
  },

    // Spinner
  defaultSpinnerColor: "#45D56E",
  inverseSpinnerColor: "#1A191B",

    // Tabs
  tabBgColor: "#F8F8F8",
  tabFontSize: 15,
  tabTextColor: "#222222",

    // Text
  textColor: black,
  inverseTextColor: "#fff",
  noteFontSize: 14,

    // Title
  titleFontfamily: Theme.typography.bold,
  titleFontSize: 17,
  subTitleFontSize: 12,
  subtitleColor: "#FFF",

    // New Variable
  titleFontColor: black,

    // Other
  borderRadiusBase: 3,
  borderWidth: (1/PixelRatio.getPixelSizeForLayoutSize(1)),
  contentPadding: 10,

  get darkenHeader(): string {
    return color(this.tabBgColor).darken(0.03).hex();
  },

  dropdownBg: "#000",
  dropdownLinkColor: "#414142",
  inputLineHeight: 24,
  jumbotronBg: "#C9C9CE",
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,

    // New Variable
  inputGroupRoundedBorderRadius: 30,
};
