// @flow
import * as React from "react";
import {StyleSheet, View, Platform} from "react-native";

import {Theme} from "../components";
import {AnimatedView, simpleInterpolation, directInterpolation} from "../components/Animations";

type NoProps = {};

type ShareState = {
    visible: boolean
};

export default class Share extends React.Component<NoProps, ShareState> {

    state = {
        visible: false
    };

    hide() {
        this.setState({ visible: false });
    }

    show() {
        this.setState({ visible: true });
    }

    render(): React.Node {
        const {visible} = this.state;
        if (!visible) {
            return <View />;
        }
        const frontAnimations = {
            opacity: directInterpolation(),
            transform: [{ rotate: simpleInterpolation("0deg", "-15deg") }]
        };
        const backAnimations = {
            opacity: directInterpolation(),
            transform: [{ rotate: simpleInterpolation("0deg", "15deg") }]
        };
        return (
            <View style={styles.container}>
                <AnimatedView
                    animations={frontAnimations}
                    style={[styles.picture, styles.frontPicture]}
                />
                <AnimatedView
                    animations={backAnimations}
                    style={[styles.picture, styles.backPicture]}
                />
            </View>
        );
    }
}

const backgroundColor = "#E0F5FF";
const shadowColor = "#0091FF";
const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    picture: {
        backgroundColor,
        borderColor: Theme.palette.white,
        borderRadius: Platform.OS === "ios" ? 7 : 0
    },
    frontPicture: {
        width: 105,
        height: 130,
        borderTopWidth: 10,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 42,
        zIndex: 200,
        shadowColor,
        shadowOffset: { width: 5, height: 10 },
        shadowOpacity: 0.54,
        shadowRadius: 9,
        elevation: 4
    },
    backPicture: {
        width: 91,
        height: 113,
        borderTopWidth: 10,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 49,
        position: "relative",
        top: 20,
        left: -10
    }
});
