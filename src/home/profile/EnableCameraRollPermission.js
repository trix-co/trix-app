// @flow
import * as React from "react";
import {StyleSheet, View, Linking} from "react-native";

import {Text, Button, Theme, RefreshIndicator} from "../../components";

type Props = {};
type State = {
    canOpen: boolean | null
};

export default class EnableCameraRollPermission extends React.Component<Props, State> {

    state = {
        canOpen: null
    };

    async componentDidMount(): Promise<void> {
        const canOpen = await Linking.canOpenURL("app-settings:");
        this.setState({ canOpen });
    }

    render(): React.Node {
        const {canOpen} = this.state;
        if (canOpen === null) {
            return (
                <View style={styles.container}>
                    <RefreshIndicator refreshing />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Text type="header3" gutterBottom style={styles.text}>Take Pictures with Fiber</Text>
                <Text gutterBottom style={styles.text}>
                Allow access to your camera roll to start taking photos with Fiber.
                </Text>
                {
                    canOpen === true && (
                        <Button label="Enable Camera Roll Access" primary full {...{onPress}} />
                    )
                }
                {
                    canOpen === false && (
                        <Text gutterBottom style={styles.text}>
                        Allow access to your camera roll in the app settings.
                        </Text>
                    )
                }
            </View>
        );
    }
}

const onPress = async (): Promise<void> => Linking.openURL("app-settings:");
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: Theme.spacing.base * 2
    },
    text: {
        textAlign: "center"
    }
});
