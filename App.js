// @flow
/* eslint-disable no-console, func-names */
<script src="http://localhost:8097"></script>;
import * as React from "react";
import { StatusBar, Platform, YellowBox } from "react-native";
import { StyleProvider } from "native-base";
import {
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator,
    createBottomTabNavigator,
} from "react-navigation";
import { AppLoading } from "expo";
import { useStrict } from "mobx";
import { Provider, inject } from "mobx-react/native";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";

import { Images, Firebase, FeedStore } from "./src/components";
import type { ScreenProps } from "./src/components/Types";

import { Welcome } from "./src/welcome";
import { Walkthrough } from "./src/walkthrough";
import { SignUpName, SignUpEmail, SignUpPassword, Login, LoginValidate } from "./src/sign-up";
import { Profile, Explore, Share, SharePicture, HomeTab, Comments, Settings, ProfileStore, PhotoLib } from "./src/home";

import getTheme from "./native-base-theme/components";
import variables from "./native-base-theme/variables/commonColor";

console.disableYellowBox = true;
YellowBox.ignoreWarnings(["Warning: Async Storage has been extracted from react-native core"]);

// $FlowFixMe
const SFProTextMedium = require("./assets/fonts/SF-Pro-Text-Medium.otf");
// $FlowFixMe
const SFProTextHeavy = require("./assets/fonts/SF-Pro-Text-Heavy.otf");
// $FlowFixMe
const SFProTextBold = require("./assets/fonts/SF-Pro-Text-Bold.otf");
// $FlowFixMe
const SFProTextSemibold = require("./assets/fonts/SF-Pro-Text-Semibold.otf");
// $FlowFixMe
const SFProTextRegular = require("./assets/fonts/SF-Pro-Text-Regular.otf");
// $FlowFixMe
const SFProTextLight = require("./assets/fonts/SF-Pro-Text-Light.otf");
// $FlowFixMe

const UbuntuBold = require("./assets/fonts/Ubuntu-Bold.ttf");
// $FlowFixMe
const UbuntuBoldItalic = require("./assets/fonts/Ubuntu-BoldItalic.ttf");
// $FlowFixMe
const Ubuntu = require("./assets/fonts/Ubuntu-Regular.ttf");
// $FlowFixMe
const UbuntuMedium = require("./assets/fonts/Ubuntu-Medium.ttf");
// $FlowFixMe
const UbuntuLight = require("./assets/fonts/Ubuntu-Light.ttf");

useStrict(true);

const originalSend = XMLHttpRequest.prototype.send;
// https://github.com/firebase/firebase-js-sdk/issues/283
// $FlowFixMe
XMLHttpRequest.prototype.send = function (body: string) {
    if (body === "") {
        originalSend.call(this);
    } else {
        originalSend.call(this, body);
    }
};

// https://github.com/firebase/firebase-js-sdk/issues/97
if (!console.ignoredYellowBox) {
    // $FlowFixMe
    console.ignoredYellowBox = [];
}
// $FlowFixMe
console.ignoredYellowBox.push("Setting a timer");

@inject("profileStore", "feedStore", "userFeedStore")
class Loading extends React.Component<ScreenProps<>> {
    async componentDidMount(): Promise<void> {
        const { navigation, profileStore, feedStore, userFeedStore } = this.props;
        await Loading.loadStaticResources();
        Firebase.init();
        Firebase.auth.onAuthStateChanged((user) => {
            const isUserAuthenticated = !!user;
            if (isUserAuthenticated) {
                const { uid } = Firebase.auth.currentUser;
                const feedQuery = Firebase.firestore.collection("feed").orderBy("timestamp", "desc");
                const userFeedQuery = Firebase.firestore
                    .collection("feed")
                    .where("uid", "==", uid)
                    .orderBy("timestamp", "desc");
                profileStore.init();
                feedStore.init(feedQuery);
                userFeedStore.init(userFeedQuery);
                navigation.navigate("Home");
            } else {
                navigation.navigate("Welcome");
            }
        });
    }

    static async loadStaticResources(): Promise<void> {
        try {
            const images = Images.downloadAsync();
            const fonts = Font.loadAsync({
                "Ubuntu-Bold": UbuntuBold,
                "Ubuntu-BoldItalic": UbuntuBoldItalic,
                "Ubuntu-Regular": Ubuntu,
                "Ubuntu-Medium": UbuntuMedium,
                "Ubuntu-Light": UbuntuLight,
                "SFProText-Medium": SFProTextMedium,
                "SFProText-Heavy": SFProTextHeavy,
                "SFProText-Bold": SFProTextBold,
                "SFProText-Semibold": SFProTextSemibold,
                "SFProText-Regular": SFProTextRegular,
                "SFProText-Light": SFProTextLight,
            });
            const icons = Font.loadAsync(Feather.font);
            await Promise.all([...images, fonts, icons]);
        } catch (error) {
            console.error(error);
        }
    }

    render(): React.Node {
        return <AppLoading />;
    }
}

// eslint-disable-next-line react/no-multi-comp
export default class App extends React.Component<{}> {
    profileStore = new ProfileStore();
    feedStore = new FeedStore();
    userFeedStore = new FeedStore();

    componentDidMount() {
        //StatusBar.setBarStyle("light-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("white");
        }
    }

    render(): React.Node {
        const { feedStore, profileStore, userFeedStore } = this;
        return (
            <StyleProvider style={getTheme(variables)}>
                <Provider {...{ feedStore, profileStore, userFeedStore }}>
                    <AppNavigator onNavigationStateChange={() => undefined} />
                </Provider>
            </StyleProvider>
        );
    }
}

const StackNavigatorOptions = {
    headerMode: "none",
    cardStyle: {
        backgroundColor: "white",
    },
};

const ExploreNavigator = createStackNavigator(
    {
        Explore: { screen: Explore },
        Comments: { screen: Comments },
    },
    StackNavigatorOptions
);

const ProfileNavigator = createStackNavigator(
    {
        Profile: { screen: Profile },
        Settings: { screen: Settings },
        Comments: { screen: Comments },
    },
    StackNavigatorOptions
);

const ShareNavigator = createStackNavigator(
    {
        Share: { screen: Share },
        SharePicture: { screen: SharePicture },
    },
    StackNavigatorOptions
);

const HomeTabs = createBottomTabNavigator(
    {
        Explore: { screen: ExploreNavigator },
        PhotoLib: { screen: PhotoLib },
        Share: { screen: ShareNavigator },
        Profile: { screen: ProfileNavigator },
    },
    {
        animationEnabled: true,
        tabBarComponent: HomeTab,
        tabBarPosition: "bottom",
        swipeEnabled: false,
    }
);

const HomeNavigator = createSwitchNavigator(
    {
        Walkthrough: { screen: Walkthrough },
        Home: { screen: HomeTabs },
    },
    StackNavigatorOptions
);

const SignUpNavigator = createStackNavigator(
    {
        SignUp: { screen: SignUpName },
        SignUpEmail: { screen: SignUpEmail },
        SignUpPassword: { screen: SignUpPassword },
    },
    StackNavigatorOptions
);

const LoginNavigator = createStackNavigator(
    {
        Login: { screen: Login },
        LoginValidate: { screen: LoginValidate },
    },
    StackNavigatorOptions
);

const AppNavigator = createAppContainer(
    createSwitchNavigator(
        {
            Loading: { screen: Loading },
            Welcome: { screen: Welcome },
            Login: { screen: LoginNavigator },
            SignUp: { screen: SignUpNavigator },
            Home: { screen: HomeNavigator },
        },
        StackNavigatorOptions
    )
);

export { AppNavigator };
