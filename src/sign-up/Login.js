import * as React from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
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
    const recaptchaVerifier = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [verificationId, setVerificationId] = React.useState();
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
                    <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />
                    <Text type="large">Sign In</Text>
                    <Text type="header2" gutterBottom>
                        Phone number
                    </Text>
                    <TextField
                        //style={{ marginVertical: 10, fontSize: 17 }}
                        placeholder="999 999 9999"
                        //autoFocus
                        autoCompleteType="tel"
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        returnKeyType="go"
                        maxLength={10}
                        onChangeText={(phoneNumber) => setPhoneNumber("+1".concat(phoneNumber))}
                    />
                    <Button
                        label="Next"
                        //disabled={!phoneNumber}
                        full
                        primary
                        onPress={async () => {
                            // The FirebaseRecaptchaVerifierModal ref implements the
                            // FirebaseAuthApplicationVerifier interface and can be
                            // passed directly to `verifyPhoneNumber`.
                            try {
                                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                                const verificationId = await phoneProvider.verifyPhoneNumber(
                                    phoneNumber,
                                    recaptchaVerifier.current
                                );
                                setVerificationId(verificationId);
                                SignUpStore.verificationId = verificationId;
                                SignUpStore.phoneNumber = phoneNumber;
                                console.log(SignUpStore.verificationId);
                                console.log(SignUpStore.phoneNumber);
                                navigation.navigate("LoginValidate");
                            } catch (err) {
                                alert("Invalid phone number entered.");
                            }
                        }}
                    />
                    <View>
                        <Button label="Back" full onPress={() => navigation.navigate("Welcome")} />
                    </View>
                    {/* <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
                    <TextField
                        disabled={!verificationId}
                        //style={{ marginVertical: 10, fontSize: 17 }}
                        //autoFocus
                        editable={!!verificationId}
                        placeholder="123456"
                        onChangeText={setVerificationCode}
                        maxLength={14}
                    />
                    <Button
                        label="Finish Signup"
                        disabled={!verificationId}
                        full
                        primary
                        onPress={async () => {
                            try {
                                const credential = firebase.auth.PhoneAuthProvider.credential(
                                    verificationId,
                                    verificationCode
                                );
                                await firebase.auth().signInWithCredential(credential);
                                showMessage({ text: "Phone authentication successful 👍" });
                            } catch (err) {
                                showMessage({ text: `Error: ${err.message}`, color: "red" });
                            }
                        }}
                    /> */}
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

// // @flow
// import autobind from "autobind-decorator";
// import * as React from "react";
// import { TextInput, View } from "react-native";

// import SignUpContainer from "./SignUpContainer";

// import { TextField, Firebase } from "../components";
// import type { NavigationProps } from "../components/Types";

// type LoginState = {
//     email: string,
//     password: string,
//     loading: boolean,
// };

// export default class Login extends React.Component<NavigationProps<*>, LoginState> {
//     state: LoginState = {
//         email: "",
//         password: "",
//         loading: false,
//     };

//     password: TextInput;

//     @autobind
//     setEmail(email: string) {
//         this.setState({ email });
//     }

//     @autobind
//     setPassword(password: string) {
//         this.setState({ password });
//     }

//     @autobind
//     setPasswordRef(input: TextInput) {
//         this.password = input;
//     }

//     @autobind
//     goToPassword() {
//         this.password.focus();
//     }

//     @autobind
//     async login(): Promise<void> {
//         const { email, password } = this.state;
//         try {
//             if (email === "") {
//                 throw new Error("Please provide an email address.");
//             }
//             if (password === "") {
//                 throw new Error("Please provide a password.");
//             }
//             this.setState({ loading: true });
//             await Firebase.auth.signInWithEmailAndPassword(email, password);
//         } catch (e) {
//             // eslint-disable-next-line no-alert
//             alert(e);
//             this.setState({ loading: false });
//         }
//     }

//     render(): React.Node {
//         const { navigation } = this.props;
//         const { loading } = this.state;
//         return (
//             <SignUpContainer
//                 title="Login"
//                 subtitle="Get Started"
//                 nextLabel="Login"
//                 next={this.login}
//                 first
//                 {...{ navigation, loading }}
//             >
//                 <TextField
//                     placeholder="Email"
//                     keyboardType="email-address"
//                     contrast
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     returnKeyType="next"
//                     onSubmitEditing={this.goToPassword}
//                     onChangeText={this.setEmail}
//                 />
//                 <TextField
//                     secureTextEntry
//                     placeholder="Password"
//                     contrast
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     returnKeyType="go"
//                     textInputRef={this.setPasswordRef}
//                     onSubmitEditing={this.login}
//                     onChangeText={this.setPassword}
//                 />
//             </SignUpContainer>
//         );
//     }
// }
