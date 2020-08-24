// @flow
import * as React from "react";
import moment from "moment";
import {StyleSheet, View, Dimensions, Platform} from "react-native";

import LikesAndComments from "./LikesAndComments";

import FeedStore from "../FeedStore";
import Text from "../Text";
import Avatar from "../Avatar";
import {Theme} from "../Theme";
import SmartImage from "../SmartImage";

import type {Post, Profile} from "../Model";
import type {NavigationProps} from "../Types";

type PostProps = NavigationProps<> & {
    post: Post,
    profile: Profile,
    store: FeedStore
};

type PostState = {
    post: Post,
    profile: Profile
};

export default class PostComp extends React.Component<PostProps, PostState> {

    unsubscribeToPost: () => void;
    unsubscribeToProfile: () => void;

    constructor(props: PostProps) {
        super(props);
        const { profile, post } = this.props;
        this.state = {
            profile,
            post
        };
    }

    componentDidMount() {
        const {post, store} = this.props;
        this.unsubscribeToPost = store.subscribeToPost(post.id, newPost => this.setState({ post: newPost }));
        // eslint-disable-next-line max-len
        this.unsubscribeToProfile = store.subscribeToProfile(post.uid, newProfile => this.setState({ profile: newProfile }));
    }

    componentWillUnmount() {
        this.unsubscribeToPost();
        this.unsubscribeToProfile();
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {post, profile} = this.state;
        const {likes, comments} = post;
        const contentStyle = [styles.content];
        const nameStyle = [styles.name];
        const textStyle = [styles.text];
        const dateStyle = [];
        if (post.picture) {
            contentStyle.push(StyleSheet.absoluteFill);
            contentStyle.push({ backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 5 });
            nameStyle.push({ color: "white" });
            textStyle.push({ color: "white" });
            dateStyle.push({ color: "rgba(255, 255, 255, 0.8)" });
        }
        return (
            <View style={styles.container}>
                {
                    post.picture && (
                        <SmartImage
                            preview={post.picture.preview}
                            uri={post.picture.uri}
                            style={styles.picture}
                        />
                    )
                }
                <View style={contentStyle}>
                    <View style={styles.header}>
                        <Avatar {...profile.picture} />
                        <View style={styles.metadata}>
                            <Text style={nameStyle}>{profile.name}</Text>
                            <Text style={dateStyle}>{moment(post.timestamp, "X").fromNow()}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={textStyle} gutterBottom>{post.text}</Text>
                    </View>
                    <LikesAndComments
                        color={post.picture ? "white" : Theme.typography.color}
                        id={post.id}
                        {...{navigation, likes, comments}}
                    />
                </View>
            </View>
        );
    }
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
        borderColor: Theme.palette.borderColor,
        borderWidth: Platform.OS === "ios" ? 0 : 1,
        marginVertical: Theme.spacing.small,
        backgroundColor: "white"
    },
    content: {
        padding: Theme.spacing.small
    },
    header: {
        flexDirection: "row",
        marginBottom: Theme.spacing.small
    },
    metadata: {
        marginLeft: Theme.spacing.small
    },
    name: {
        color: "black"
    },
    text: {
        flexWrap: "wrap"
    },
    picture: {
        height: width,
        borderRadius: 5
    }
});
