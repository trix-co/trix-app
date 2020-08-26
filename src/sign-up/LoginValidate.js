import * as React from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import * as firebase from "firebase";
import { Content } from "native-base";
import { useNavigation } from "react-navigation-hooks";

import { TextField, Firebase, Button, Text, Container, Theme } from "../components";

import SignUpStore from "./SignUpStore";

// Initialize Firebase JS SDK
// https://firebase.google.com/docs/web/setup
/*try {
  firebase.initializeApp({
    ...
  });
} catch (err) {
  // ignore app already initialized error in snack
}*/

export default function Phone() {
    const navigation = useNavigation();
    const [verificationCode, setVerificationCode] = React.useState();
    const firebaseConfig = Firebase.app.options;
    //console.log(Firebase.app.options);
    //console.log(Firebase.apps.length);
    const [message, showMessage] = React.useState(
        !firebaseConfig || Platform.OS === "web"
            ? {
                  text: "Error: invalid firebase config",
              }
            : undefined
    );

    return (
        <Container gutter={1}>
            <Content style={styles.content}>
                <View style={styles.innerContainer}>
                    <Text type="large">Sent via text</Text>
                    <Text type="header2" gutterBottom>
                        Verification
                    </Text>
                    <TextField
                        //style={{ marginVertical: 10, fontSize: 17 }}
                        placeholder="123456"
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                        autoCorrect={false}
                        maxLength={6}
                        //returnKeyType="go"
                        onChangeText={(verificationCode) => setVerificationCode(verificationCode)}
                    />
                    <Button
                        label="Next"
                        //disabled={!phoneNumber}
                        full
                        primary
                        onPress={async () => {
                            try {
                                const credential = firebase.auth.PhoneAuthProvider.credential(
                                    SignUpStore.verificationId,
                                    verificationCode
                                );
                                const user = await firebase.auth().signInWithCredential(credential);
                                console.log("Phone sign-up successful 👍");
                                navigation.navigate("Home");
                            } catch (err) {
                                alert(`Error: ${err.message}`);
                            }
                        }}
                    />
                    <View>
                        <Button label="Back" full onPress={() => navigation.navigate("Login")} />
                    </View>
                </View>
            </Content>
        </Container>
    );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
    content: {
        padding: Theme.spacing.base,
    },
    innerContainer: {
        height: height - Theme.spacing.base * 2,
        justifyContent: "center",
    },
});
