// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {Spinner} from "native-base";

import {Theme} from "./Theme";
import type {BaseProps} from "./Types";

export default class LoadingIndicator extends React.PureComponent<BaseProps> {

    render(): React.Node {
        const {style} = this.props;
        return (
            <View style={[style, styles.container]}>
                <Spinner color={Theme.palette.primary} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
