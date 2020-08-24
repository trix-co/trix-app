// @flow
import * as _ from "lodash";
import * as React from "react";
import {Animated, StyleSheet, Easing, Platform} from "react-native";

import type {BaseProps} from "../components/Types";

type AtomicType = string | number;
type AtomicTypes = AtomicType[];
type InterpolationConfigType = {
    inputRange: AtomicTypes,
    outputRange: AtomicTypes
};

type TransformKey = "perspective" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "scale" | "scaleX" | "scaleY" |
    "translateX" | "translateY" | "skewX" | "skewY";

type AnimatedViewProps = BaseProps & {
    animations: {
        [string]: InterpolationConfigType,
        transform?: { [TransformKey]: InterpolationConfigType }[]
    },
    delay: number,
    duration: number,
    easing: number => number,
    children?: React.ChildrenArray<React.Element<*>>
};

type AnimatedViewState = {
    animation: Animated.Value
};

export const simpleInterpolation = (start: AtomicType, finish: AtomicType): InterpolationConfigType =>
    ({ inputRange: [0, 1], outputRange: [start, finish] });
export const directInverseInterpolation = (): InterpolationConfigType => simpleInterpolation(1, 0);
export const directInterpolation = (): InterpolationConfigType => simpleInterpolation(0, 1);

export class AnimatedView extends React.Component<AnimatedViewProps, AnimatedViewState> {

    static defaultProps = {
        animations: {
            opacity: { inputRange: [0, 1], outputRange: [0, 1] },
            transform: [{ translateY: { inputRange: [0, 1], outputRange: [20, 0] } }]
        },
        delay: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease)
    }

    state = {
        animation: new Animated.Value(0)
    }

    componentDidMount() {
        const {delay, easing, duration} = this.props;
        const {animation} = this.state;
        Animated.timing(
            animation,
            {
                toValue: 1,
                duration,
                delay,
                easing,
                useNativeDriver: Platform.OS === "ios"
            }
        ).start();
    }

    render(): React.Node {
        const {children, animations} = this.props;
        const {animation} = this.state;
        const style = StyleSheet.flatten(this.props.style) || {};
        const newStyle = _.pickBy(style, (value, key) => key !== "transform");
        const animatedStyle = {};
        const transformStyle = { transform: [] };
        _.forEach(animations, (interpolation, prop) => {
            if (prop !== "transform") {
                animatedStyle[prop] = animation.interpolate(interpolation);
            } else {
                interpolation.forEach(transformation => {
                    _.forEach(transformation, (i, key) => {
                        transformStyle.transform.push({ [key]: animation.interpolate(i) });
                    });
                });
            }
        });
        if (style.transform) {
            transformStyle.transform = [...transformStyle.transform, ...style.transform];
        }
        return (
            <Animated.View style={[newStyle, animatedStyle, transformStyle]}>{children}</Animated.View>
        );
    }
}
