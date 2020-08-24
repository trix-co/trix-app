// @flow
import * as React from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";

import { Theme } from "./Theme";

import type { BaseProps } from "./Types";

type ContainerProps = BaseProps & {
    children: React.ChildrenArray<React.Element<*>>,
    gutter: number,
};

export default class Container extends React.PureComponent<ContainerProps> {
    static defaultProps = {
        gutter: 0,
    };

    render(): React.Node {
        const { gutter, children, style } = this.props;
        const containerStyle = [style, styles.container, { padding: gutter * Theme.spacing.base }];
        return (
            <View style={styles.root}>
                <View style={containerStyle}>{children}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
    },
});
