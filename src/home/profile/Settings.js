// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Image, StatusBar } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Content } from "native-base";
import { Feather as Icon } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";

import {
    NavHeader,
    Firebase,
    Button,
    TextField,
    Theme,
    ImageUpload,
    serializeException,
    RefreshIndicator,
} from "../../components";

import EnableCameraRollPermission from "./EnableCameraRollPermission";

import type { ScreenParams } from "../../components/Types";
import type { Profile } from "../../components/Model";
import type { Picture } from "../../components/ImageUpload";

type SettingsState = {
    name: string,
    picture: Picture,
    loading: boolean,
    hasCameraRollPermission: boolean | null,
};

export default class Settings extends React.Component<
    ScreenParams<{ profile: Profile, store: ProfileStore }>,
    SettingsState
> {
    state = {
        name: "",
        picture: {
            uri: "",
            width: 0,
            height: 0,
        },
        loading: false,
        hasCameraRollPermission: null,
    };

    async componentDidMount(): Promise<void> {
        const { navigation } = this.props;
        const { profile } = navigation.state.params;
        const picture = {
            uri: profile.picture.uri,
            height: 0,
            width: 0,
        };
        this.setState({ name: profile.name, picture, loading: false, hasCameraRollPermission: null });
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraRollPermission: status === "granted" });
    }

    @autobind
    logout() {
        try {
            const { navigation } = this.props;
            const { profile, store } = navigation.state.params;
            navigation.navigate("Welcome");
            store.deregister();
            Firebase.auth.signOut();
        } catch (e) {
            console.log(e);
        }
    }

    @autobind
    async save(): Promise<void> {
        const { navigation } = this.props;
        const originalProfile = navigation.state.params.profile;
        const { name, picture } = this.state;
        const { uid } = Firebase.auth.currentUser;
        this.setState({ loading: true });
        try {
            if (name !== originalProfile.name) {
                await Firebase.firestore.collection("users").doc(uid).update({ name });
            }
            if (picture.uri !== originalProfile.picture.uri) {
                const preview = await ImageUpload.preview(picture);
                const uri = await ImageUpload.upload(picture);
                await Firebase.firestore.collection("users").doc(uid).update({ picture: { preview, uri } });
            }
            navigation.pop();
        } catch (e) {
            const message = serializeException(e);
            // eslint-disable-next-line no-alert
            alert(message);
            this.setState({ loading: false });
        }
    }

    @autobind
    async setPicture(): Promise<void> {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (result.cancelled === false) {
            const { uri, width, height } = result;
            const picture: Picture = {
                uri,
                width,
                height,
            };
            this.setState({ picture });
        }
    }

    @autobind
    setName(name: string) {
        this.setState({ name });
    }

    render(): React.Node {
        const { navigation } = this.props;
        const { name, picture, loading, hasCameraRollPermission } = this.state;
        if (hasCameraRollPermission === null) {
            return (
                <View style={styles.refreshContainer}>
                    <RefreshIndicator refreshing />
                </View>
            );
        } else if (hasCameraRollPermission === false) {
            return <EnableCameraRollPermission />;
        }
        return (
            <View style={styles.container}>
                <NavHeader title="Settings" back {...{ navigation }} />
                <Content style={styles.content}>
                    <View style={styles.avatarContainer}>
                        {/* <TouchableWithoutFeedback onPress={this.setPicture}> */}
                        <View style={styles.avatar}>
                            <Image style={styles.profilePic} source={{ uri: picture.uri }} />
                            {/* <Icon name="camera" size={25} color="white" style={styles.editIcon} /> */}
                        </View>
                        {/* </TouchableWithoutFeedback> */}
                    </View>
                    <TextField
                        placeholder="Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="go"
                        defaultValue={name}
                        onSubmitEditing={this.save}
                        onChangeText={this.setName}
                    />
                    <Button label="Save" full primary onPress={this.save} {...{ loading }} />
                    <Button label="Sign-Out" full onPress={this.logout} />
                </Content>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        marginHorizontal: Theme.spacing.base,
    },
    refreshContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarContainer: {
        alignItems: "center",
    },
    avatar: {
        marginVertical: Theme.spacing.base,
        alignItems: "center",
        height: 100,
        width: 100,
    },
    profilePic: {
        position: "absolute",
        top: 0,
        left: 0,
        height: 100,
        width: 100,
        resizeMode: "cover",
        borderRadius: 50,
    },
    editIcon: {
        position: "absolute",
        top: 50 - 12.5,
        left: 50 - 12.5,
    },
});
