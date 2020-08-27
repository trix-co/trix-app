// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    Platform,
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Feather as Icon } from "@expo/vector-icons";

import EnableCameraPermission from "./EnableCameraPermission";
import FlashIcon from "./FlashIcon";

import { RefreshIndicator, Theme, NavHeader, SpinningIndicator, serializeException } from "../../components";
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
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        flashMode: Camera.Constants.FlashMode.off,
        autoFocus: Camera.Constants.AutoFocus.on,
        loading: false,
        ratio: undefined,
    };

    async componentDidMount(): Promise<void> {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted",
        });
    }

    onCameraReady = async () => {
        if (Platform.OS === "android") {
            const DESIRED_RATIO = "1:1";
            const ratios = await this.camera.current.getSupportedRatiosAsync();
            const ratio = ratios.find((r) => r === DESIRED_RATIO) || ratios[ratios.length - 1];
            this.setState({ ratio });
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
    async snap(): Promise<void> {
        const { navigation } = this.props;
        try {
            this.setState({ loading: true });
            const picture = await this.camera.current.takePictureAsync({ base64: false, skipProcessing: true });
            this.setState({ loading: false });
            navigation.navigate("SharePicture", picture);
        } catch (e) {
            this.setState({ loading: false });
            // eslint-disable-next-line no-alert
            alert(serializeException(e));
        }
    }

    render(): React.Node {
        const { onCameraReady } = this;
        const { navigation } = this.props;
        const { hasCameraPermission, type, flashMode, loading, ratio, autoFocus } = this.state;
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
                <NavHeader title="Share" {...{ navigation }} />
                <Camera
                    ref={this.camera}
                    style={{ width, height: cameraHeight, flexGrow: 1 }}
                    {...{ type, flashMode, onCameraReady, ratio, autoFocus }}
                >
                    <View style={styles.cameraBtns}>
                        <TouchableWithoutFeedback onPress={this.toggleCamera}>
                            <View>
                                <Icon name="rotate-ccw" style={styles.rotate} size={25} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity onPress={this.snap}>
                            <View style={styles.btn} />
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={this.toggleFlash}>
                            <View>
                                <FlashIcon on={flashMode === Camera.Constants.FlashMode.on} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Camera>
                <Modal transparent visible={loading} onRequestClose={this.toggle}>
                    <View style={styles.modal}>
                        <SpinningIndicator />
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
    footer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    btn: {
        height: ratio < 0.75 ? 50 : 30,
        width: ratio < 0.75 ? 50 : 30,
        borderRadius: ratio < 0.75 ? 25 : 15,
        borderWidth: ratio < 0.75 ? 8 : 4,
        borderColor: Theme.palette.primary,
    },
    modal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});
