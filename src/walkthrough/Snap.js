// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {AnimatedView} from "../components";

type NoProps = {};

type BubbleProps = {
    right?: boolean
};

class Bubble extends React.PureComponent<BubbleProps> {
    render(): React.Node {
        const {right} = this.props;
        return (
            <AnimatedView
                delay={right ? 300 : 0}
                style={[styles.bubble, right ? styles.rightBubble : styles.leftBubble]}
            >
                <View style={styles.circle} />
                <View style={styles.lines}>
                    <View style={styles.smallLine} />
                    <View style={styles.bigLine} />
                </View>
            </AnimatedView>
        );
    }
}

type VisibleState = {
    visible: boolean
};

// eslint-disable-next-line react/no-multi-comp
export default class Chat extends React.Component<NoProps, VisibleState> {

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
        return (
            <View style={styles.container}>
                <Bubble />
                <Bubble right />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 283
    },
    bubble: {
        backgroundColor: "white",
        width: 235,
        height: 68,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        padding: 18
    },
    leftBubble: {
        borderTopLeftRadius: 0,
        marginBottom: 20
    },
    rightBubble: {
        borderTopRightRadius: 0,
        alignSelf: "flex-end"
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#E0F5FF",
        marginRight: 11
    },
    lines: {
        height: 26,
        justifyContent: "space-between"
    },
    smallLine: {
        backgroundColor: "#E0F5FF",
        height: 8,
        width: 81
    },
    bigLine: {
        backgroundColor: "#E0F5FF",
        height: 8,
        width: 128
    }
});
