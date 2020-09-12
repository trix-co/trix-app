// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, Image } from "react-native";
import Swiper from "react-native-swiper";

import Slide from "./Slide";
import Connect from "./Connect";
import Chat from "./Chat";
import Share from "./Share";
import { Feather as Icon } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { Button, Theme, Firebase } from "../components";
import type { ScreenProps } from "../components/Types";

type WalkthroughState = {
    disabled: boolean,
};

export default class Walkthrough extends React.Component<ScreenProps<>, WalkthroughState> {
    state = {
        disabled: false,
    };

    componentDidMount() {
        StatusBar.setBarStyle("light-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("#0059FF");
        }
    }

    home() {
        const { navigation } = this.props;
        const { disabled } = this.state;
        if (disabled) {
            return;
        }
        this.setState({ disabled: true });
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("white");
        }
        const outline = "Walkthrough Complete";
        const { uid } = Firebase.auth.currentUser;
        Firebase.firestore.collection("users").doc(uid).update({ outline }).then(navigation.navigate("Home"));
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
        const { renderPagination } = this;
        return (
            <Swiper loop={false} {...{ renderPagination, onIndexChanged }}>
                {slides.map((slide) => (
                    <View key={slide.title}>
                        <Slide {...slide} />
                    </View>
                ))}
            </Swiper>
        );
    }
}

/*
 */
const onIndexChanged = (index: number) => {
    slides.filter((slide, i) => index !== i).forEach((slide) => slide.hide());
    slides[index].show();
};
let connect: Connect;
let chat: Chat;
let share: Share;

const slides = [
    {
        title: "You're in",
        description:
            "Thanks for signing up for Trix! \n\nTrix's technology helps prevent facial recognition from working on your photos.",
        icon: <Image source={require("../../assets/trix_white.png")} style={{ height: 80, width: 250 }} />,
        show: () => {},
        hide: () => {},
    },
    {
        title: "Snap a photo",
        description:
            "All photos in Trix are automatically processed with our protective filter to help prevent facial recognition. \n\nThe more Trix-processed photos you upload to social apps & sites, the more effective the technology is.",
        icon: <FontAwesome name="camera-retro" style={{ color: "white" }} size={130} />,
        show: () => {},
        hide: () => {},
    },
    {
        title: "Worth the wait",
        description:
            "Trix's protective filter runs in the background after you take or upload a photo. \n\nWithin a few minutes protected photos will automatically appear in the app.",
        icon: <FontAwesome name="shield" style={{ color: "white" }} size={150} />,
        show: () => {},
        hide: () => {},
    },
];

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: Theme.spacing.base,
    },
    welcome: {
        color: "white",
    },
});
