import React from "react";
//import { Image } from "react-native-expo-image-cache";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    ScrollView,
    StatusBar,
} from "react-native";

import ImageGallery, { openImageGallery } from "./gallery";
import type { Profile } from "../../components/Model";
import CachedImage from "../components/CachedImage";
import { inject, observer } from "mobx-react/native";
import {
    RefreshIndicator,
    Theme,
    NavHeader,
    Firebase,
    SpinningIndicator,
    serializeException,
    PhotoStore,
    FeedStore,
} from "../components";
import { ProfileStore } from "./";
import { NavigationEvents } from "react-navigation";

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
                        console.log("bingo");
                        console.log(view);
                        this._view = view._view;
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
    componentDidMount() {
        this.loadFeed();
    }
    loadFeed = () => this.props.photoStore.checkForNewEntriesInFeed();
    render() {
        const feed = this.props.photoStore.feed;
        return (
            <View style={styles.imagegrid}>
                <NavigationEvents onWillFocus={this.loadFeed} />

                <NavHeader title="Photos" />
                <ScrollView contentContainerStyle={styles.layout}>
                    {feed.map((item) => (
                        <ListItem key={item.imageUrl} item={item} />
                    ))}
                </ScrollView>
            </View>
        );
    }
}

export class PhotoLib extends React.Component<ScreenParams<{ profile: Profile }>, LibState> {
    render() {
        return (
            <View style={styles.container}>
                <ImageGrid />
                <ImageGallery />
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
