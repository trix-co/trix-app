// @flow
import * as React from "react";
import {StyleSheet, View, Animated, Easing} from "react-native";

import {directInverseInterpolation, directInterpolation, simpleInterpolation} from "../Animations";
import {Theme} from "../Theme";
import Text from "../Text";

type OdometerProps = {
    count: number,
    color: string
};

type OdometerState = {
    count: number
};

export default class Odometer extends React.Component<OdometerProps, OdometerState> {

    state = {
        count: 0
    };

    static getDerivedStateFromProps({ count }: OdometerProps): OdometerState {
        return { count };
    }

    increment() {
        const count = this.state.count + 1;
        this.setState({ count });
    }

    decrement() {
        const count = this.state.count - 1;
        this.setState({ count });
    }

    render(): React.Node {
        const {color} = this.props;
        const numbers = `${this.state.count}`.split("").map(char => parseInt(char, 10));
        return (
            <View style={styles.row}>
                {
                    numbers.map((digit, key) => <Digit {...{ key, digit, color }} />)
                }
            </View>
        );
    }
}

type DigitProps = {
    // FIXME: once this fix is published: https://github.com/yannickcr/eslint-plugin-react/issues/1751
    // eslint-disable-next-line react/no-unused-prop-types
    digit: number,
    color: string
};

type DigitState = {
    digit: number,
    lastDigit: number,
    animation: Animated.Value,
    goesUp: 1 | -1
};

// eslint-disable-next-line react/no-multi-comp
class Digit extends React.PureComponent<DigitProps, DigitState> {

    state = {
        digit: 0,
        lastDigit: 0,
        animation: new Animated.Value(1),
        goesUp: 1
    }

    static getDerivedStateFromProps({ digit }: DigitProps, { digit: lastDigit }: DigitState): ?DigitState {
        const animation = new Animated.Value(0);
        if (digit === lastDigit) {
            return null;
        }
        const goesUp = lastDigit > digit ? -1 : 1;
        Animated.timing(
            animation,
            {
                duration: 600,
                toValue: 1,
                easing: Easing.bezier(0.175, 0.885, 0.32, 1.275)
            }
        ).start();
        return { lastDigit, digit, animation, goesUp };
    }

    render(): React.Node {
        const {color} = this.props;
        const {digit, lastDigit, animation, goesUp} = this.state;
        const height = Theme.typography.regular.fontSize;
        const opacity = animation.interpolate(directInverseInterpolation());
        const translateY = animation.interpolate(simpleInterpolation(0, goesUp * height));
        const newOpacity = animation.interpolate(directInterpolation());
        const newTranslateY = animation.interpolate(simpleInterpolation(goesUp * -height, 0));
        const lastDigitStyle = [styles.text, {color}, { opacity, transform: [{ translateY }]}];
        const digitStyle = [styles.text, {color}, { opacity: newOpacity, transform: [{ translateY: newTranslateY }]}];
        return (
            <View style={styles.container}>
                <AnimatedText style={lastDigitStyle}>{`${lastDigit}`}</AnimatedText>
                <AnimatedText style={digitStyle}>{`${digit}`}</AnimatedText>
            </View>
        );
    }
}

const AnimatedText = Animated.createAnimatedComponent(Text);
const styles = StyleSheet.create({
    row: {
        flexDirection: "row"
    },
    container: {
        width: 8,
        height: Theme.typography.regular.fontSize
    },
    text: {
        position: "absolute",
        top: 0,
        fontFamily: Theme.typography.semibold,
        lineHeight: Theme.typography.regular.fontSize
    }
});
