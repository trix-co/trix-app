// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, View, TouchableOpacity, Platform, SafeAreaView, Text, StatusBar } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

//import Text from "./Text";
import { Theme } from "./Theme";

import type { NavigationProps } from "./Types";

type NavHeaderProps = NavigationProps<*> & {
    title: string,
    back?: boolean,
    backFn?: () => void,
};

export default class NavHeader extends React.Component<NavHeaderProps> {
    //bar = StatusBar.setBarStyle("dark-content", true);

    @autobind
    onPress() {
        const { backFn, navigation } = this.props;
        if (backFn) {
            backFn();
        } else {
            navigation.goBack();
        }
    }

    render(): React.Node {
        const { onPress } = this;
        const { title, back } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.side}>
                        {back && (
                            <TouchableOpacity {...{ onPress }}>
                                <View style={styles.back}>
                                    <Icon name="chevron-left" size={25} />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.text}>{title}</Text>
                    <View style={styles.side} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        borderColor: Theme.palette.borderColor,
        borderBottomWidth: Platform.OS === "ios" ? 0 : 1,
        zIndex: 10000,
        backgroundColor: "white",
    },
    content: {
        height: 35,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    side: {
        width: 35,
    },
    text: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        paddingTop: 3,
        color: Theme.palette.secondary,
    },
    back: {
        marginLeft: Theme.spacing.tiny,
        //paddingEnd: Theme.spacing.tiny,
    },
});
