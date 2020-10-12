import React from "react";
import PropTypes from "prop-types";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View, StatusBar, Share, Alert } from "react-native";
import { connect } from "react-redux";
import autobind from "autobind-decorator";
import * as Sharing from "expo-sharing";
import Colors from "./Colors";
import Layout from "./Layout";
import Firebase from "../../components/Firebase";
import { shallowEquals } from "./ShallowEquals";
import { Feather as Icon } from "@expo/vector-icons";
import CachedImage from "../../components/CachedImage";
import * as Amplitude from "expo-analytics-amplitude";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { inject } from "mobx-react/native";

@inject("photoStore")
@connect((data) => ImageGalleryHeaderBar.getDataProps(data))
export default class ImageGalleryHeaderBar extends React.Component<InjectedProps> {
    @autobind
    async deleteImage(): Promise<void> {
        try {
            let item = this.props.item;
            const values = [];
            for (var val of item.values()) {
                values.push(val);
            }
            const { uid } = Firebase.auth.currentUser;
            //should be fine to use this as a key
            const remoteURI = values[0];
            const trixPix = Firebase.firestore.collection("trixpix");
            trixPix
                .where("uid", "==", uid)
                .where("imageUrl", "==", remoteURI)
                .get()
                .then((snapshots) => {
                    if (snapshots.size > 0) {
                        snapshots.forEach((item) => {
                            trixPix.doc(item.id).update({ tombstone: true });
                            //console.log("hoops", item.id);
                        });
                    } else {
                        console.log("nothing in snapshot!");
                    }
                });

            Alert.alert("Delete?", "Are you sure that you want to permanently delete this photo?", [
                { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
                {
                    text: "Delete",
                    onPress: () => {
                        Amplitude.logEventWithProperties("photoDeleted", {
                            imageURL: remoteURI,
                        });
                        console.log("Delete Pressed");
                        this.props.photoStore.updateTombstones(remoteURI);
                        this.props.refreshFcn();
                        this.props.onPressDone();
                    },
                    style: "destructive",
                },
            ]);
        } catch (e) {
            console.error(e);
        }
    }

    @autobind
    async shareImage(): Promise<void> {
        try {
            let item = this.props.item;
            const values = [];
            for (var val of item.values()) {
                values.push(val);
            }
            const remoteURI = values[0];
            const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, remoteURI);
            const localURI = `${FileSystem.cacheDirectory}${hashed}.jpg`;
            //console.log("locall", localURI);
            if (Platform.OS === "android") {
                const share = await Sharing.shareAsync(localURI);
                //console.log(share);
                Amplitude.logEvent("photoShared");
            } else {
                Share.share(
                    {
                        url: localURI,
                        title: "Image from Trix.co",
                    },
                    { UTI: "public.jpeg" }
                ).then((shr) => {
                    Amplitude.logEventWithProperties("photoShared", {
                        action: shr.action,
                        activityType: shr.activityType,
                    });
                });
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
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    <TouchableWithoutFeedback
                        style={{ paddingRight: 20 }}
                        onPress={this.deleteImage}
                        hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 20,
                            right: 100,
                        }}
                    >
                        <Icon name="trash" size={25} color="#0f5257" />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={this.shareImage}
                        hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 20,
                            right: 100,
                        }}
                    >
                        <Icon name="upload" size={25} color="#0f5257" />
                    </TouchableWithoutFeedback>
                </View>

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
        fontWeight: "bold",
        fontFamily: Platform.OS === "android" ? "SFProText-Bold" : "Segoe-UI-Bold",
        fontSize: 18,
        paddingTop: Platform.OS === "android" ? 0 : 2,
        paddingBottom: Platform.OS === "android" ? 10 : 0,
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
        paddingTop: Platform.OS === "android" ? 26 : 34,
        marginLeft: 8,
        position: "absolute",
        //paddingEnd: Theme.spacing.tiny,
    },
});
