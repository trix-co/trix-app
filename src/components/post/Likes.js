// @flow
import * as React from "react";
import {StyleSheet, TouchableWithoutFeedback, View, Animated, Easing} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import Odometer from "./Odometer";

import {Theme} from "../Theme";
import Firebase from "../Firebase";

type LikesProps = {
    color: string,
    likes: string[],
    post: string
};

type LikesState = {
    animation: Animated.Value,
    isLiked: boolean,
    count: number
};

export default class Likes extends React.Component<LikesProps, LikesState> {

    constructor(props: LikesProps) {
        super(props);
        const {likes} = props;
        const {uid} = Firebase.auth.currentUser;
        const isLiked = likes.indexOf(uid) !== -1;
        this.state = {
            animation: new Animated.Value(0),
            isLiked,
            count: likes.length
        };
    }

    toggle = () => {
        const {post} = this.props;
        const {isLiked, count, animation} = this.state;
        const {uid} = Firebase.auth.currentUser;
        if (!isLiked) {
            this.setState({ isLiked: !isLiked, count: count + 1 });
            Animated.timing(
                animation,
                {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.ease
                }
            ).start();
        } else {
            this.setState({ isLiked: !isLiked, count: count - 1 });
        }
        const postRef = Firebase.firestore.collection("feed").doc(post);
        Firebase.firestore.runTransaction(async transaction => {
            const postDoc = await transaction.get(postRef);
            const {likes} = postDoc.data();
            const idx = likes.indexOf(uid);
            if (idx === -1) {
                likes.push(uid);
            } else {
                likes.splice(idx, 1);
            }
            transaction.update(postRef, { likes });
        });
    }

    render(): React.Node {
        const {color} = this.props;
        const {animation, isLiked, count} = this.state;
        const computedStyle = [styles.icon];
        if (animation) {
            const fontSize = animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [iconSize, bigIconSize, iconSize]
            });
            computedStyle.push({ fontSize });
        }
        if (isLiked) {
            computedStyle.push(styles.likedIcon);
        }
        return (
            <TouchableWithoutFeedback onPress={this.toggle}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <AnimatedIcon name="thumbs-up" color={color} style={computedStyle} />
                    </View>
                    <Odometer count={count} {...{ color }} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const iconSize = 18;
const bigIconSize = 24;
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    iconContainer: {
        width: bigIconSize,
        height: bigIconSize,
        justifyContent: "center"
    },
    icon: {
        fontSize: iconSize
    },
    likedIcon: {
        color: Theme.palette.primary
    }
});
