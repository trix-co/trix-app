// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, SafeAreaView, StatusBar, Platform} from "react-native";
import Swiper from "react-native-swiper";

import Slide from "./Slide";
import Connect from "./Connect";
import Chat from "./Chat";
import Share from "./Share";

import {Button, Theme} from "../components";
import type {ScreenProps} from "../components/Types";

type WalkthroughState = {
    disabled: boolean
};

export default class Walkthrough extends React.Component<ScreenProps<>, WalkthroughState> {

    state = {
        disabled: false
    };

    componentDidMount() {
        StatusBar.setBarStyle("light-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("#0059FF");
        }
    }

    home() {
        const {navigation} = this.props;
        const {disabled} = this.state;
        if (disabled) {
            return;
        }
        this.setState({ disabled: true });
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("white");
        }
        navigation.navigate("Home");
    }

    @autobind
    renderPagination(index: number, total: number, context: Swiper): React.Node {
        const isFirst = index === 0;
        const isLast = index === total - 1;
        const back = () => context.scrollBy(-1);
        const next = () => (isLast ? this.home() : context.scrollBy(1));
        return (
            <SafeAreaView style={styles.footer}>
                <Button label="Back" onPress={back} disabled={isFirst} />
                <Button label={isLast ? "Start" : "Next"} onPress={next} primary transparent />
            </SafeAreaView>
        );
    }

    render(): React.Node {
        const {renderPagination} = this;
        return (
            <Swiper loop={false} {...{ renderPagination, onIndexChanged }}>
                {
                    slides.map(slide => (
                        <View key={slide.title}>
                            <Slide {...slide} />
                        </View>
                    ))
                }
            </Swiper>
        );
    }
}

/*
*/
const onIndexChanged = (index: number) => {
    slides.filter((slide, i) => index !== i).forEach(slide => slide.hide());
    slides[index].show();
};
let connect: Connect;
let chat: Chat;
let share: Share;

const slides = [
    {
        title: "Connect",
        description: "Bring your friends closer by building a network of the people you love.",
        icon: <Connect ref={ref => (ref ? connect = ref : undefined)} />,
        show: () => connect.show(),
        hide: () => connect.hide()
    },
    {
        title: "Chat",
        description: "Send messages and stay up to date with friends whenever you need to.",
        icon: <Chat ref={ref => (ref ? chat = ref : undefined)} />,
        show: () => chat.show(),
        hide: () => chat.hide()
    },
    {
        title: "Share",
        description: "Send your best selfies and show friends what you’re up to.",
        icon: <Share ref={ref => (ref ? share = ref : undefined)} />,
        show: () => share.show(),
        hide: () => share.hide()
    }
];

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: Theme.spacing.base
    }
});
