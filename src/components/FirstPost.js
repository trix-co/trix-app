// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, TouchableWithoutFeedback} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import Text from "./Text";
import {Theme} from "./Theme";

import type {NavigationProps} from "./Types";

export default class FirstPost extends React.Component<NavigationProps<>> {

    @autobind
    share() {
        this.props.navigation.navigate("Share");
    }

    render(): React.Node {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.share}>
                    <Icon name="plus-circle" color={Theme.palette.primary} size={25} />
                </TouchableWithoutFeedback>
                <Text style={styles.text}>
                Looks like you have not shared anything yet.
                Now is the time to make your first post!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        textAlign: "center",
        marginTop: Theme.spacing.base
    }
});
