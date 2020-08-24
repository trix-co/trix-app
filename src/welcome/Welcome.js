// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, Dimensions, Image, View, Text } from "react-native";
//import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Button, Container, Theme, AnimatedView, Firebase, serializeException } from "../components";
import type { ScreenProps } from "../components/Types";

export default class Welcome extends React.Component<ScreenProps<>> {
    @autobind
    signUp() {
        this.props.navigation.navigate("SignUp");
    }

    @autobind
    login() {
        this.props.navigation.navigate("Login");
    }

    render(): React.Node {
        return (
            <Container gutter={2} style={styles.root}>
                <View style={{ flex: 0.6 }} />
                <Image source={require("../../assets/trix_logo.png")} style={styles.logo} />
                <View style={styles.txtContainer}>
                    <Text style={styles.txt}>
                        <Text>trix is a </Text>
                        <Text style={{ fontWeight: "bold" }}>photo-sharing app </Text>
                        <Text>on a mission to </Text>
                        <Text style={{ fontWeight: "bold" }}>secure the digital identity and privacy of its users</Text>
                    </Text>
                </View>
                <AnimatedView style={styles.container} delay={400} duration={300}>
                    <Button label="Sign Up" onPress={this.signUp} full primary />
                    <Text onPress={this.login} style={styles.signIn}>
                        <Text style={{ color: "#0d2129" }}>Have an account? </Text>{" "}
                        <Text style={{ color: "#48bf84" }}>Sign in.</Text>
                    </Text>
                </AnimatedView>
                <View></View>
            </Container>
        );
    }
}

const loginAnonymously = async (): Promise<void> => {
    try {
        await Firebase.auth.signInAnonymously();
    } catch (e) {
        // eslint-disable-next-line no-alert
        alert(serializeException(e));
    }
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    root: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    container: {
        alignSelf: "stretch",
    },
    logo: {
        height: 115,
        resizeMode: "contain",
        marginTop: Theme.spacing.base * 2,
        marginBottom: Theme.spacing.base,
    },
    txt: {
        textAlign: "center",
        fontSize: 18,
        color: "#0d2129",

        //fontFamily: "Ubuntu-Regular",
    },
    signIn: {
        //color: "#0f5257",
        textAlign: "center",
        fontSize: 14,
        marginTop: Theme.spacing.base,
        fontWeight: "bold",
        //fontFamily: "Ubuntu-Medium",
    },
    txtContainer: {
        flexDirection: "row",
        flex: 1,
        flexWrap: "wrap",
        flexShrink: 1,
        alignSelf: "stretch",
    },
});
