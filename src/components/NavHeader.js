// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Platform, SafeAreaView, Text, Image } from "react-native";
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
                            <TouchableWithoutFeedback
                                {...{ onPress }}
                                hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 20,
                                    right: 100,
                                }}
                            >
                                <View style={styles.back}>
                                    <Icon name="chevron-left" size={25} />
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                    {/* <Text style={styles.text}>{title}</Text> */}

                    <Image
                        source={require("../../assets/trix_logo.png")}
                        style={{
                            height: 35,
                            width: 75,
                            position: "absolute",
                            resizeMode: "contain",
                            marginTop: -4,
                            marginLeft: Platform.OS === "ios" ? "5%" : "5%",
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === "ios" ? 0 : 30,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        borderColor: Theme.palette.borderColor,
        borderBottomWidth: Platform.OS === "ios" ? 0 : 0,
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
        fontFamily: "Segoe-UI-Bold",
        fontWeight: "bold",
        fontSize: 18,
        paddingTop: 3,
        color: Theme.palette.secondary,
    },
    back: {
        marginLeft: Theme.spacing.tiny,
        //paddingEnd: Theme.spacing.tiny,
    },
});
