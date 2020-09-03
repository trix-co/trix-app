import React from "react";
import PropTypes from "prop-types";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View, StatusBar, Share } from "react-native";
import { connect } from "react-redux";
import autobind from "autobind-decorator";
import * as Sharing from "expo-sharing";
import Colors from "./Colors";
import Layout from "./Layout";
import Theme from "../../components/Theme";
import { shallowEquals } from "./ShallowEquals";
import { Feather as Icon } from "@expo/vector-icons";
import CachedImage from "../../components/CachedImage";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

@connect((data) => ImageGalleryHeaderBar.getDataProps(data))
export default class ImageGalleryHeaderBar extends React.Component {
    @autobind
    async shareImage(): Promise<void> {
        try {
            let item = this.props.item;
            sharing = await Sharing.isAvailableAsync();
            console.log(sharing);
            const values = [];
            for (var val of item.values()) {
                values.push(val);
            }
            const remoteURI = values[0];
            const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, remoteURI);
            const localURI = `${FileSystem.cacheDirectory}${hashed}`;
            if (Platform.OS === "android") {
                const share = await Sharing.shareAsync(remoteURI);
            } else {
                Share.share({ url: remoteURI, title: "test lol" });
            }
        } catch (e) {
            console.error(e);
        }
    }

    static propTypes = {
        activeItemNumber: PropTypes.number,
        listLength: PropTypes.number,
        animatedOpacity: PropTypes.object.isRequired,
        onPressDone: PropTypes.func.isRequired,
        renderRight: PropTypes.func,
    };

    static getDataProps(data) {
        let { imageGallery } = data;
        let list = imageGallery.get("list");
        let item = imageGallery.get("item");

        let activeItemNumber;
        let listLength;

        if (list && item) {
            activeItemNumber = list.get("items").indexOf(item) + 1;
            listLength = list.get("items").count();
        }

        return { activeItemNumber, listLength, list, item };
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEquals(this.props, nextProps);
    }

    render() {
        //bar = StatusBar.setBarStyle("light-content", true);

        let { animatedOpacity, activeItemNumber, listLength, onPressDone, style } = this.props;

        let rightAction;
        if (this.props.renderRight) {
            rightAction = this.props.renderRight(onPressDone);
        } else {
            rightAction = (
                <TouchableOpacity
                    onPress={onPressDone}
                    hitSlop={{
                        top: 4,
                        bottom: 5,
                        left: 25,
                        right: 20,
                    }}
                >
                    <Icon name="chevron-left" size={25} />
                </TouchableOpacity>
            );
        }

        return (
            <Animated.View style={[style, styles.animatedStyle]}>
                <Text style={styles.headeBarTitleText}>Photos</Text>
                <TouchableOpacity
                    onPress={this.shareImage}
                    hitSlop={{
                        top: 4,
                        bottom: 5,
                        left: 25,
                        right: 20,
                    }}
                >
                    <Icon name="upload" size={25} color="#0f5257" />
                </TouchableOpacity>

                <View style={styles.back}>{rightAction}</View>
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    animatedStyle: {
        opacity: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 34,
    },
    headeBarTitleText: {
        color: Colors.barTitle,
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        paddingTop: 2,
        color: "#0f5257",
    },
    headerBarButtonText: {
        color: "#0f5257",
    },
    headerBarRightAction: {
        //position: "absolute",
        //top: Layout.statusBarHeight,
        //bottom: 0,
        //right: 15,
        //alignItems: "center",
        //justifyContent: "center",
    },
    back: {
        paddingTop: 34,
        marginLeft: 8,
        position: "absolute",
        //paddingEnd: Theme.spacing.tiny,
    },
});
