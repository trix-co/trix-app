// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, TextInput, Image, Dimensions, View, Alert } from "react-native";
import { Content } from "native-base";
import Urls from "../../../api_urls.json";

import {
    NavHeader,
    Button,
    Theme,
    RefreshIndicator,
    Firebase,
    ImageUpload,
    serializeException,
    Text,
} from "../../components";

import type { ScreenParams } from "../../components/Types";
import type { Post } from "../../components/Model";
import type { Picture } from "../../components/ImageUpload";

type SharePictureState = {
    loading: boolean,
    caption: string,
};

export default class SharePicture extends React.Component<ScreenParams<Picture>, SharePictureState> {
    id: string;
    preview: string;
    url: string;
    width: number;
    height: number;

    state = {
        loading: false,
        caption: "",
    };

    @autobind
    async enque(post: NativePicture): Promise<void> {
        try {
            const resp = await fetch(Urls["QUEUE_API_URL"], {
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
    async upload(): Promise<void> {
        try {
            const { navigation } = this.props;
            const picture = navigation.state.params;
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
    async onPress(): Promise<void> {
        const { navigation } = this.props;
        const { caption } = this.state;
        this.setState({ loading: true });
        try {
            await this.upload();
            const { uid } = Firebase.auth.currentUser;
            const post: NativePicture = {
                id: this.id,
                width: 1600,
                height: 1600 * (navigation.state.params.height / navigation.state.params.width),
                uid,
                timestamp: parseInt(moment().format("X"), 10),
                imageUrl: this.url,
                preview: this.preview,
            };
            //await Firebase.firestore.collection("nativepics").doc(this.id).set(post);
            await this.enque(post);
            navigation.pop(1);
            navigation.navigate("Share");
        } catch (e) {
            const message = serializeException(e);
            Alert.alert(message);
            this.setState({ loading: false });
        }
    }

    @autobind
    onChangeText(caption: string) {
        this.setState({ caption });
    }

    render(): React.Node {
        const { onPress, onChangeText } = this;
        const { navigation } = this.props;
        const { loading } = this.state;
        const source = navigation.state.params;
        if (loading) {
            return (
                <View style={styles.loading}>
                    <RefreshIndicator />
                    <Text style={styles.saving}>Saving...</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <NavHeader back title="Share" {...{ navigation }} />
                <Content>
                    <Image {...{ source }} style={styles.picture} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write Caption"
                        underlineColorAndroid="transparent"
                        onSubmitEditing={onPress}
                        {...{ onChangeText }}
                    />
                    <Button primary full label="Share Picture" style={styles.btn} {...{ onPress }} />
                </Content>
            </View>
        );
    }
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    loading: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flexGrow: 1,
    },
    picture: {
        width,
        height: width,
    },
    textInput: {
        flexGrow: 1,
        padding: Theme.spacing.base,
        ...Theme.typography.regular,
    },
    btn: {
        margin: Theme.spacing.base,
    },
    saving: {
        marginBottom: Theme.spacing.base,
    },
});
