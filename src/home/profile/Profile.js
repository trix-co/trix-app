// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import _ from "lodash";
import * as React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Linking,
    TouchableHighlight,
    StatusBar,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { inject, observer } from "mobx-react/native";
import Constants from "expo-constants";
import { NavigationEvents } from "react-navigation";

import ProfileStore from "../ProfileStore";

import { Text, Avatar, Theme, Images, Feed, PhotoStore } from "../../components";
import type { FeedEntry } from "../../components/Model";
import type { ScreenProps } from "../../components/Types";

type InjectedProps = {
    profileStore: ProfileStore,
    photoStore: PhotoStore,
};

@inject("profileStore", "photoStore")
@observer
export default class ProfileComp extends React.Component<ScreenProps<> & InjectedProps> {
    componentDidMount() {
        StatusBar.setBarStyle("light-content");
        this.loadFeed();
    }

    loadFeed = () => {
        StatusBar.setBarStyle("light-content");
        this.props.photoStore.checkForNewEntriesInFeed();
    };

    dismount = () => {
        StatusBar.setBarStyle("dark-content");
    };

    @autobind
    settings() {
        const { profile } = this.props.profileStore;
        this.props.navigation.navigate("Settings", { profile });
    }

    @autobind
    loadMore() {
        this.props.photoStore.loadFeed();
    }

    @autobind
    // eslint-disable-next-line class-methods-use-this
    keyExtractor(item: FeedEntry): string {
        return item.post.id;
    }

    render(): React.Node {
        const { navigation, photoStore, profileStore } = this.props;
        const { profile } = profileStore;
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const fdMillis = moment(firstDay, "YYYY-MM-DD HH:mm:ss").valueOf() / 1000;
        const imagesProcessedThisMonth = _.filter(photoStore.feed, ({ timestamp }) => timestamp > fdMillis);
        const url = `sms:4157549196‬${Platform.OS === "ios" ? "&" : "?"}body=${"A suggestion for the Trix app:"}`;
        //console.log("NumImages:", imagesProcessedThisMonth.length);
        //console.log("NumImagesTotal:", photoStore.feed.length);
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this.loadFeed} onWillBlur={this.dismount} />
                <View style={styles.header}>
                    <Image style={styles.cover} source={Images.cover} />
                    <TouchableOpacity onPress={this.settings} style={styles.settings}>
                        <View>
                            <Icon name="settings" size={25} color="white" />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.title}>
                        <Text type="header2" style={styles.name}>
                            {profile.name}
                        </Text>
                    </View>
                    <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                </View>
                <View style={styles.processedImages}>
                    <Text>
                        <Text style={styles.processedText}>Photos protected this month: </Text>
                        <Text style={styles.processedTextBold}>{imagesProcessedThisMonth.length}</Text>
                    </Text>
                    <Text style={{ paddingTop: 20 }}>
                        <Text style={styles.processedText}>Account type: </Text>
                        <Text style={styles.processedTextBold}>Free</Text>
                    </Text>
                    <View style={{ paddingTop: 30, flexDirection: "row", flexWrap: 1 }}>
                        <Text style={styles.emailText}>
                            We're working on more features to help you protect your digital identity. Want to see
                            something built?
                        </Text>
                        <TouchableOpacity onPress={() => Linking.openURL(url)} activeOpacity={1}>
                            <Text style={styles.emailTextLink}>Send us a text.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const avatarSize = 100;
const { width } = Dimensions.get("window");
const { statusBarHeight } = Constants;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: width,
    },
    header: {
        marginBottom: avatarSize * 0.5 + Theme.spacing.small,
    },
    cover: {
        width,
        height: width * 0.75,
    },
    avatar: {
        position: "absolute",
        right: Theme.spacing.small,
        bottom: -avatarSize * 0.5,
    },
    settings: {
        position: "absolute",
        top: statusBarHeight + Theme.spacing.small,
        right: Theme.spacing.base,
        backgroundColor: "transparent",
        zIndex: 10000,
    },
    title: {
        position: "absolute",
        left: Theme.spacing.small,
        bottom: 50 + Theme.spacing.small,
    },
    outline: {
        color: "rgba(255, 255, 255, 0.8)",
    },
    name: {
        color: "white",
    },
    processedImages: {
        paddingTop: 30,
        marginLeft: 20,
        marginRight: 20,
        flex: 1,
        fontSize: 40,
    },
    processedText: {
        fontSize: 18,
    },
    processedTextBold: {
        fontSize: 18,
        fontWeight: "bold",
        color: Theme.palette.primary,
    },
    emailText: {
        fontSize: 14,
    },
    emailTextLink: {
        paddingTop: 20,
        textDecorationLine: "underline",
        color: Theme.palette.primary,
        fontSize: 14,
    },
});
