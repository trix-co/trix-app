// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import * as firebase from "firebase";
import * as Haptics from "expo-haptics";
import Urls from "../../../api_urls.json";
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    Platform,
    StatusBar,
    Text,
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Feather as Icon } from "@expo/vector-icons";
import * as Amplitude from "expo-analytics-amplitude";
import EnableCameraPermission from "./EnableCameraPermission";
import FlashIcon from "./FlashIcon";
const timer = require("react-native-timer");
import { NavigationEvents } from "react-navigation";

import {
    RefreshIndicator,
    Theme,
    NavHeader,
    SpinningIndicator,
    serializeException,
    ImageUpload,
    Firebase,
} from "../../components";
import type { ScreenProps } from "../../components/Types";

type ShareState = {
    hasCameraPermission: boolean | null,
    type: number,
    flashMode: number,
    loading: boolean,
    ratio: string | void,
};

export default class Share extends React.Component<ScreenProps<>, ShareState> {
    // $FlowFixMe
    camera = React.createRef();
    id: string;
    preview: string;
    url: string;
    width: number;
    height: number;

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        flashMode: Camera.Constants.FlashMode.off,
        autoFocus: Camera.Constants.AutoFocus.on,
        loading: false,
        loaded: true,
        ratio: undefined,
        showMsg: false,
        flashScreen: false,
    };

    @autobind
    async showMsg(): Promise<void> {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        this.setState({ showMsg: true }, () =>
            timer.setTimeout(this, "hideMsg", () => this.setState({ showMsg: false }), 1000)
        );
    }

    async componentDidMount(): Promise<void> {
        if (Platform.OS === "ios") {
            StatusBar.setBarStyle("dark-content");
        }
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted",
        });
    }

    onCameraReady = async () => {
        if (Platform.OS === "android") {
            const DESIRED_RATIO = "5:3";
            const ratios = await this.camera.current.getSupportedRatiosAsync();
            //console.log("hooligan", ratios);
            const ratio = ratios.find((r) => r === DESIRED_RATIO) || ratios[ratios.length - 1];
            this.setState({ ratio });
        }
    };

    loadCamera = async () => {
        if (Platform.OS === "android") {
            this.setState({ loaded: true });
        }
    };

    unloadCamera = async () => {
        if (Platform.OS === "android") {
            this.setState({ loaded: false });
        }
    };

    @autobind
    toggle() {
        this.setState({ loading: false });
    }

    @autobind
    toggleFlash() {
        const { flashMode } = this.state;
        const { on, off } = Camera.Constants.FlashMode;
        this.setState({ flashMode: flashMode === on ? off : on });
    }

    @autobind
    toggleCamera() {
        const { type } = this.state;
        const { front, back } = Camera.Constants.Type;
        this.setState({ type: type === back ? front : back });
    }

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
            //console.log(JSON.stringify(resp));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(serializeException(e));
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
            console.log(serializeException(e));
        }
    }

    @autobind
    async snap(): Promise<void> {
        const { navigation } = this.props;
        try {
            //this.camera.current.pausePreview();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            const picture = await this.camera.current.takePictureAsync({ base64: false, skipProcessing: false });
            await this.showMsg();
            //this.setState({ loading: true });
            //this.camera.current.resumePreview();
            await this.upload(picture);
            const { uid } = Firebase.auth.currentUser;
            const post: NativePicture = {
                id: this.id,
                width: 1600,
                height: 1600 * (picture.height / picture.width),
                uid,
                timestamp: parseInt(moment().format("X"), 10),
                imageUrl: this.url,
                preview: this.preview,
                tombstone: false,
            };
            //console.log(post);
            //await Firebase.firestore.collection("nativepics").doc(this.id).set(post);
            const increment = firebase.firestore.FieldValue.increment(1);
            const userRef = Firebase.firestore.collection("users").doc(uid);
            const resp = await userRef.update({ unprocessedCount: increment });
            await this.enque(post);
            //console.log("camma", this.state.type);

            if (Platform.OS === "android") {
                Amplitude.logEventWithProperties("photoTaken", {
                    type: this.state.type == 0 ? "back" : "front",
                });
            } else {
                Amplitude.logEventWithProperties("photoTaken", {
                    type: this.state.type == 1 ? "back" : "front",
                });
            }

            //this.setState({ loading: false });
        } catch (e) {
            this.setState({ loading: false });
            console.log("something went wrong!", e);
            // eslint-disable-next-line no-alert
            //alert(serializeException(e));
        }
    }

    render(): React.Node {
        const { onCameraReady } = this;
        const { navigation } = this.props;
        const { hasCameraPermission, type, flashMode, loading, ratio, autoFocus, showMsg, flashScreen } = this.state;
        let cameraHeight = width;
        if (ratio) {
            const [w, h] = ratio.split(":").map((n) => parseInt(n, 10));
            cameraHeight *= h / w;
        }
        if (hasCameraPermission === null) {
            return (
                <View style={styles.refreshContainer}>
                    <RefreshIndicator refreshing />
                </View>
            );
        } else if (hasCameraPermission === false) {
            return <EnableCameraPermission />;
        }
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this.loadCamera} onDidBlur={this.unloadCamera} />
                <NavHeader title="Camera" {...{ navigation }} />

                {this.state.loaded && (
                    <Camera
                        ref={this.camera}
                        style={{ flexGrow: 1 }}
                        {...{ type, flashMode, onCameraReady, ratio, autoFocus }}
                    >
                        <View style={styles.cameraBtns}>
                            <TouchableWithoutFeedback onPress={this.toggleFlash}>
                                <View>
                                    <FlashIcon on={flashMode === Camera.Constants.FlashMode.on} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableOpacity onPress={this.snap}>
                                <View style={styles.btn} />
                            </TouchableOpacity>
                            <TouchableWithoutFeedback onPress={this.toggleCamera}>
                                <View>
                                    <Icon name="rotate-ccw" style={styles.rotate} size={25} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </Camera>
                )}
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

const { width, height } = Dimensions.get("window");
const ratio = width / height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    refreshContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cameraBtns: {
        //position: "absolute",
        //bottom: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        //width,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: Theme.spacing.base,
    },
    rotate: {
        backgroundColor: "transparent",
        color: "white",
    },
    check: {
        backgroundColor: "transparent",
        color: Theme.palette.primary,
    },
    footer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    btn: {
        height: ratio < 0.75 ? 60 : 40,
        width: ratio < 0.75 ? 60 : 40,
        borderRadius: ratio < 0.75 ? 25 : 15,
        borderWidth: ratio < 0.75 ? 10 : 5,
        borderColor: Theme.palette.primary,
    },
    modal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});
