import React from "react";
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
import { ScreenProps } from "../components/Types";
import type { Profile } from "../../components/Model";
import { RefreshIndicator, Theme, NavHeader, SpinningIndicator, serializeException } from "../components";

type LibState = {
    name: string,
    picture: Picture,
    loading: boolean,
    hasCameraRollPermission: boolean | null,
};

class ListItem extends React.Component {
    _openInImageGallery = () => {
        let { item } = this.props;

        this._view.measure((rx, ry, w, h, x, y) => {
            openImageGallery({
                animationMeasurements: { w, h, x, y },
                list,
                item,
            });
        });
    };

    render() {
        let { item } = this.props;

        return (
            <TouchableWithoutFeedback onPress={this._openInImageGallery}>
                <Image
                    ref={(view) => {
                        this._view = view;
                    }}
                    source={{ uri: item.imageUrl }}
                    style={styles.thumbnail}
                />
            </TouchableWithoutFeedback>
        );
    }
}

class ImageGrid extends React.Component {
    render() {
        return (
            <View style={styles.imagegrid}>
                <NavHeader title="Photos" />
                <ScrollView contentContainerStyle={styles.layout}>
                    {list.map((item) => (
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

const list = [
    {
        description: "Image 1",
        imageUrl: "https://trix-public.s3-us-west-2.amazonaws.com/trkcxeorzuiz_output_bbox.jpg",
        width: 480,
        height: 720,
    },
    {
        description: "Image 2",
        imageUrl: "http://placehold.it/640x640&text=Image%202",
        width: 640,
        height: 640,
    },
    {
        description: "Image 3",
        imageUrl: "http://placehold.it/640x640&text=Image%203",
        width: 640,
        height: 640,
    },
];
