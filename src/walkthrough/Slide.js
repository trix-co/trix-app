// @flow
import * as React from "react";
import {StyleSheet, Dimensions, View} from "react-native";
import Constants from "expo-constants";
import {LinearGradient} from "expo-linear-gradient";

import {Text, Theme} from "../components";

type SlideProps = {
    title: string,
    description: string,
    icon: React.Element<*>
};

export default class Slide extends React.PureComponent<SlideProps> {

    render(): React.Node {
        const {title, description, icon} = this.props;
        return (
            <View>
                <LinearGradient colors={["#0059FF", "#00AAFF"]} style={styles.gradient}>
                    <View style={styles.slide}>
                        <Text type="header2" style={styles.title}>{title}</Text>
                        <View style={styles.iconContainer}>{icon}</View>
                    </View>
                </LinearGradient>
                <View style={styles.description}>
                    <Text>{description}</Text>
                </View>
            </View>
        );
    }
}

const {height} = Dimensions.get("window");
const styles = StyleSheet.create({
    slide: {
        paddingHorizontal: Theme.spacing.base * 2,
        paddingBottom: Theme.spacing.base * 2,
        paddingTop: (Theme.spacing.base * 2) + Constants.statusBarHeight,
        flexGrow: 1
    },
    title: {
        color: Theme.palette.white
    },
    description: {
        position: "absolute",
        top: height * 0.62,
        left: 0,
        right: 0,
        height: height - (height * 0.62) - 45,
        paddingHorizontal: Theme.spacing.base * 2,
        justifyContent: "center"
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.62
    },
    iconContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
