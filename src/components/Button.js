// @flow
import * as React from "react";
import { StyleSheet } from "react-native";
import { Button as NBButton, Text, Spinner } from "native-base";

import { Theme } from "./Theme";

import type { BaseProps } from "./Types";

type ButtonProps = BaseProps & {
    label: string,
    primary?: boolean,
    transparent?: boolean,
    disabled?: boolean,
    full?: boolean,
    onPress: () => mixed,
    loading?: boolean,
};

export default class Button extends React.PureComponent<ButtonProps> {
    render(): React.Node {
        const { label, full, primary, disabled, transparent, onPress, style, loading } = this.props;
        const computedStyle = [styles.base];
        if (primary && !transparent) {
            computedStyle.push(styles.primary);
        }
        computedStyle.push(style);
        return (
            <NBButton
                {...{
                    full,
                    primary,
                    onPress,
                    style: computedStyle,
                    transparent: !primary || transparent,
                    disabled,
                }}
            >
                {!!loading && <Spinner color="white" />}
                {!loading && (
                    <Text
                        style={[
                            primary ? Theme.typography.large : Theme.typography.regular,
                            // eslint-disable-next-line
                            {
                                // eslint-disable-next-line
                                color: disabled
                                    ? "transparent"
                                    : primary
                                    ? transparent
                                        ? Theme.palette.primary
                                        : "white"
                                    : Theme.typography.color,
                                fontSize: primary ? 16 : Theme.typography.regular.fontSize,
                                fontFamily: Theme.typography.semibold,
                            },
                        ]}
                    >
                        {label}
                    </Text>
                )}
            </NBButton>
        );
    }
}

const styles = StyleSheet.create({
    base: {},
    primary: {
        shadowColor: "#0f5257",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
});
