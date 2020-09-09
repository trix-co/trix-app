import React from "react";
import moment from "moment";
//import { Image } from "react-native-expo-image-cache";
import {
    Dimensions,
    Image,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    View,
    ScrollView,
    StatusBar,
    Text,
} from "react-native";

import { Feather as Icon, FontAwesome } from "@expo/vector-icons";

import ImageGallery, { openImageGallery } from "./gallery";
import type { Profile } from "../../components/Model";
import CachedImage from "../components/CachedImage";
import { inject, observer } from "mobx-react/native";
import {
    RefreshIndicator,
    Theme,
    NavHeader,
    Firebase,
    serializeException,
    SpinningIndicator,
    PhotoStore,
    FeedStore,
    ImageUpload,
} from "../components";
import { NavigationEvents } from "react-navigation";
import { EnableCameraRollPermission } from "./profile";
import * as ImagePicker from "expo-image-picker";
import autobind from "autobind-decorator";
import AWS from "aws-sdk";
const timer = require("react-native-timer");

type LibState = {
    name: string,
    picture: Picture,
    loading: boolean,
    hasCameraRollPermission: boolean | null,
};

type InjectedProps = {
    photoStore: PhotoStore,
    feedStore: FeedStore,
};

@inject("photoStore")
@observer
class ListItem extends React.Component<InjectedProps> {
    _openInImageGallery = () => {
        const feed = this.props.photoStore.feed;
        let { item } = this.props;
        this._view.measure((rx, ry, w, h, x, y) => {
            openImageGallery({
                animationMeasurements: { w, h, x, y },
                list: feed,
                item,
            });
        });
    };

    render() {
        let { item } = this.props;
        //sconsole.log(this.props.feedStore.feed);
        return (
            <TouchableWithoutFeedback onPress={this._openInImageGallery}>
                <CachedImage
                    ref={(view) => {
                        try {
                            this._view = view._view;
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    source={{ uri: item.imageUrl }}
                    style={styles.thumbnail}
                />
            </TouchableWithoutFeedback>
        );
    }
}

@inject("photoStore")
@observer
class ImageGrid extends React.Component<InjectedProps> {
    constructor(props) {
        super(props);

        this.state = {
            isEmpty: true,
        };
    }

    componentDidMount() {
        this.loadFeed();
        this.loadFeedEveryMinute();
    }

    loadFeedEveryMinute = () => {
        timer.setInterval(this, "loadFeedEveryMin", () => this.loadFeed(), 30000);
    };

    loadFeed = () => {
        this.props.photoStore
            .checkForNewEntriesInFeed()
            .then(this.setState({ isEmpty: this.props.photoStore.feed.length === 0 }));
    };

    render() {
        const feed = this.props.photoStore.feed;
        return (
            <View style={styles.imagegrid}>
                <NavigationEvents onWillFocus={this.loadFeed} />
                <NavHeader title="Photos" />
                {this.state.isEmpty ? (
                    <View style={styles.emptystate}>
                        <FontAwesome name="file-picture-o" style={{ color: Theme.palette.secondary }} size={75} />
                        <Text style={styles.emptystateText}>
                            Snap or import a photo to protect it from facial recognition.
                        </Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.layout} minimumZoomScale={1} maximumZoomScale={5}>
                        {feed.map((item) => (
                            <ListItem key={item.imageUrl} item={item} />
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    }
}

export class PhotoLib extends React.Component<ScreenParams<{ profile: Profile }>, LibState> {
    id: string;
    preview: string;
    url: string;
    width: number;
    height: number;
    state = {
        hasCameraPermission: null,
        loading: false,
        ratio: undefined,
        showMsg: false,
    };

    @autobind
    async enque(post: NativePicture): c {
        try {
            const resp = await fetch("https://ee5s4vrbxh.execute-api.us-west-2.amazonaws.com/api", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(post),
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            Alert.alert(e);
        }
    }

    @autobind
    async upload(picture): Promise<void> {
        try {
            const { navigation } = this.props;
            this.id = ImageUpload.uid();
            this.preview = await ImageUpload.preview(picture);
            this.url = await ImageUpload.upload(picture);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            Alert.alert(e);
        }
    }
    @autobind
    async uploadFromOS(): Promise<void> {
        console.log("that worked!");
        const { hasCameraRollPermission } = this.state;
        if (hasCameraRollPermission === null) {
            return (
                <View style={styles.refreshContainer}>
                    <RefreshIndicator refreshing />
                </View>
            );
        } else if (hasCameraRollPermission === false) {
            return <EnableCameraRollPermission />;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
        });
        if (result.cancelled === false) {
            this.setState({ loading: true });
            const { uri, width, height } = result;
            console.log("heyyo", uri);
            const picture: Picture = {
                uri,
                width,
                height,
            };
            const { uid } = Firebase.auth.currentUser;

            try {
                await this.upload(picture);
                const post: NativePicture = {
                    id: this.id,
                    width: 1600,
                    height: 1600 * (picture.height / picture.width),
                    uid,
                    timestamp: parseInt(moment().format("X"), 10),
                    imageUrl: this.url,
                    preview: this.preview,
                };
                await this.enque(post);
                this.setState({ loading: false });
                await this.showMsg();
            } catch (e) {
                this.setState({ loading: false });
                console.log("something went wrong!", e);
                // eslint-disable-next-line no-alert
                alert(serializeException(e));
            }
        }
    }

    @autobind
    async showMsg(): Promise<void> {
        console.log("Show message!!");
        this.setState({ showMsg: true }, () =>
            timer.setTimeout(this, "hideMsg", () => this.setState({ showMsg: false }), 1000)
        );
    }

    render() {
        const { hasCameraPermission, loading, ratio, showMsg } = this.state;

        return (
            <View style={styles.container}>
                <ImageGrid />
                <TouchableWithoutFeedback
                    onPress={this.uploadFromOS}
                    hitSlop={{
                        top: 4,
                        bottom: 5,
                        left: 25,
                        right: 20,
                    }}
                >
                    <View style={styles.icon}>
                        <Icon name="plus" style={styles.actual_icon} size={25} />
                    </View>
                </TouchableWithoutFeedback>
                <ImageGallery />
                <Modal transparent visible={loading} onRequestClose={this.toggle}>
                    <View style={styles.modal}>
                        <SpinningIndicator />
                    </View>
                </Modal>
                <Modal transparent visible={showMsg} onRequestClose={this.toggle}>
                    <View style={styles.modal}>
                        <Icon name="check" style={styles.check} size={75} />
                    </View>
                </Modal>
            </View>
        );
    }
}

const DEVICE_WIDTH = Dimensions.get("window").width;
var THUMBNAILS_PER_ROW = 2;
var THUMBNAIL_SPACING = 0.5;
var THUMBNAIL_SIZE = (DEVICE_WIDTH - THUMBNAIL_SPACING * (THUMBNAILS_PER_ROW * 2 + 2)) / THUMBNAILS_PER_ROW;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    thumbnail: {
        margin: THUMBNAIL_SPACING,
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
    },
    heading: {
        fontSize: 18,
    },
    imagegrid: {
        flex: 1,
    },
    layout: {
        margin: THUMBNAIL_SPACING,
        flexGrow: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    icon: {
        position: "absolute",
        top: Platform.OS === "android" ? 34 : 46,
        right: 30,
    },
    actual_icon: {
        color: Theme.palette.secondary,
    },
    check: {
        backgroundColor: "transparent",
        color: Theme.palette.primary,
    },
    modal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    emptystate: {
        flex: 1,
        margin: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    emptystateText: {
        paddingTop: 10,
        fontSize: 22,
        color: Theme.palette.secondary,
    },
});

// const list = [
//     {
//         description: "Image 1",
//         imageUrl: "https://trix-public.s3-us-west-2.amazonaws.com/trkcxeorzuiz_output_bbox.jpg",
//         width: 480,
//         height: 720,
//     },
//     {
//         description: "Image 2",
//         imageUrl: "http://placehold.it/640x640&text=Image%202",
//         width: 640,
//         height: 640,
//     },
//     {
//         description: "Image 3",
//         imageUrl: "http://placehold.it/640x640&text=Image%203",
//         width: 640,
//         height: 640,
//     },
// ];
