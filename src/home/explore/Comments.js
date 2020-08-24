// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {
    StyleSheet, FlatList, KeyboardAvoidingView, TextInput, View, Platform, TouchableOpacity
} from "react-native";
import {observer} from "mobx-react/native";

import CommentComp from "./Comment";
import CommentsStore from "./CommentStore";

import {Text, NavHeader, Theme, Firebase} from "../../components";
import type {ScreenParams} from "../../components/Types";
import type {Comment} from "../../components/Model";

@observer
export default class CommentsComp extends React.Component<ScreenParams<{ post: string }>> {

    commentsStore: CommentsStore = new CommentsStore();

    async componentDidMount(): Promise<void> {
        const {post} = this.props.navigation.state.params;
        this.commentsStore.init(post);
    }

    @autobind
    async send(): Promise<void> {
        const {post} = this.props.navigation.state.params;
        const {comment} = this.commentsStore;
        const {uid} = Firebase.auth.currentUser;
        const newComment: Comment = {
            text: comment,
            id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1),
            uid,
            timestamp: parseInt(moment().format("X"), 10)
        };
        if (comment.trim() === "") {
            return;
        }
        this.commentsStore.addComment(post, newComment);
    }

    @autobind
    onChangeText(text: string) {
        this.commentsStore.comment = text;
    }

    @autobind
    backFn() {
        this.props.navigation.goBack();
    }

    render(): React.Node {
        const {onChangeText, backFn, commentsStore} = this;
        const {navigation} = this.props;
        const {comments, comment} = commentsStore;
        return (
            <View style={styles.container}>
                <NavHeader title="Comments" back {...{navigation, backFn}} />
                <FlatList
                    inverted
                    data={comments}
                    keyExtractor={item => item.comment.id}
                    renderItem={({ item }) => <CommentComp comment={item.comment} profile={item.profile} />}
                />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={styles.footer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Write a comment"
                            value={comment}
                            autoFocus
                            returnKeyType="send"
                            onSubmitEditing={this.send}
                            underlineColorAndroid="transparent"
                            {...{onChangeText}}
                        />
                        <TouchableOpacity primary transparent onPress={this.send}>
                            <Text style={styles.btnText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
        borderTopWidth: 1,
        borderColor: Theme.palette.borderColor,
        paddingLeft: Theme.spacing.small,
        paddingRight: Theme.spacing.small,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        height: Theme.typography.regular.lineHeight + (Theme.spacing.base * 2),
        flex: 1
    },
    btnText: {
        color: Theme.palette.primary
    }
});
