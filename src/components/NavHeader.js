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

    @autobind
    onAdd() {
        const { addFn } = this.props;
        //console.log("got em");
        if (addFn) {
            // console.log("yep!");
            addFn();
        }
    }

    render(): React.Node {
        const { onPress, onAdd } = this;
        const { title, back, upload } = this.props;
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
                    <View>
                        {upload && (
                            <TouchableWithoutFeedback
                                onPress={onAdd}
                                hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 20,
                                    right: 100,
                                }}
                            >
                                <View style={styles.add}>
                                    <Icon name="plus" size={25} style={{ color: Theme.palette.secondary }} />
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
        zIndex: -1,
        backgroundColor: "white",
        //flexDirection: "row",
        //justifyContent: "space-between",
        //alignContent: "space-between",
    },
    content: {
        height: 35,
        flexDirection: "row",
        justifyContent: "space-between",
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
    add: {
        paddingTop: "2%",
        marginRight: "7%",
    },
});
