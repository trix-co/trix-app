// @flow
import * as React from "react";
import {StyleSheet, TouchableWithoutFeedback, SafeAreaView, View} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import {Theme} from "../components";

import type {NavigationProps} from "../components/Types";

type Tab = { label: string, icon: string };

export class HomeTab extends React.Component<NavigationProps<*>> {

    static tabs: Tab[] = [
        { label: "Explore", icon: "home" },
        { label: "Share", icon: "camera" },
        { label: "Profile", icon: "user" }
    ];

    render(): React.Node {
        const {navigation} = this.props;
        const navState = navigation.state;
        const cIdx = navState.index;
        return (
            <SafeAreaView style={styles.tabs}>
                <View style={styles.container}>
                    {
                        HomeTab.tabs.map((info, i) => {
                            const color = i === cIdx ? Theme.palette.primary : Theme.palette.lightGray;
                            return (
                                <TouchableWithoutFeedback
                                    key={info.label}
                                    onPress={() => (i !== cIdx ? this.props.navigation.navigate(info.label) : null)}
                                >
                                    <View style={styles.tab}>
                                        <Icon name={info.icon} size={25} {...{ color }} />
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })
                    }
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8
    },
    container: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        height: 57
    },
    tab: {
        flexGrow: 1,
        height: 57,
        justifyContent: "center",
        alignItems: "center"
    }
});
