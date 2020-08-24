// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, TouchableWithoutFeedback} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import Likes from "./Likes";

import Text from "../Text";
import {Theme} from "../Theme";

import type {NavigationProps} from "../Types";

type LikesAndCommentsProps = NavigationProps<> & {
    id: string,
    comments: number,
    likes: string[],
    color: string
};

export default class LikesAndComments extends React.Component<LikesAndCommentsProps> {

    @autobind
    goToComments() {
        const post = this.props.id;
        this.props.navigation.navigate("Comments", { post });
    }

    render(): React.Node {
        const {comments, likes, color, id} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Likes post={id} {...{color, likes}} />
                    <TouchableWithoutFeedback onPress={this.goToComments}>
                        <View style={styles.comments}>
                            <Icon name="message-circle" size={18} {...{color}} />
                            <Text style={[styles.commentCount, { color }]}>{`${comments}`}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end"
    },
    content: {
        flexDirection: "row",
        alignItems: "center"
    },
    comments: {
        marginLeft: Theme.spacing.tiny,
        flexDirection: "row"
    },
    commentCount: {
        marginLeft: Theme.spacing.tiny
    }
});
