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
                    <Text type="large">Sign up</Text>
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
                                //console.log(SignUpStore.verificationId);
                                //console.log(SignUpStore.phoneNumber);
                                navigation.navigate("SignUpPassword");
                            } catch (err) {
                                console.log(err);
                                alert("Invalid phone number entered.");
                            }
                        }}
                    />
                    <View>
                        <Button label="Back" full onPress={() => navigation.navigate("SignUp")} />
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
// import React from "react";
// import { StyleSheet, View, Button, TextInput } from "react-native";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
// import { TextField, Theme, Firebase } from "../components";
// import type { NavigationProps } from "../components/Types";

// import SignUpStore from "./SignUpStore";
// import SignUpContainer from "./SignUpContainer";

// //////

// type phoneState = {
//     phone: string,
// };

// export default class phone extends React.Component<NavigationProps<*>, phoneState> {
//     state = {
//         phone: "",
//         confirmResult: null,
//         verificationCode: "",
//         userId: "",
//     };

//     validatePhoneNumber = () => {
//         var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
//         return true;
//         return regexp.test(this.state.phone);
//     };

//     handleSendCode = () => {
//         // Request to send OTP
//         if (this.validatePhoneNumber()) {
//             Firebase.auth
//                 .signInWithPhoneNumber(this.state.phone)
//                 .then((confirmResult) => {
//                     this.setState({ confirmResult });
//                 })
//                 .catch((error) => {
//                     alert(error.message);

//                     console.log(error);
//                 });
//         } else {
//             alert("Invalid Phone Number");
//         }
//     };

//     changePhoneNumber = () => {
//         this.setState({ confirmResult: null, verificationCode: "" });
//     };

//     handleVerifyCode = () => {
//         // Request for OTP verification
//         const { confirmResult, verificationCode } = this.state;
//         if (verificationCode.length == 6) {
//             confirmResult
//                 .confirm(verificationCode)
//                 .then((user) => {
//                     this.setState({ userId: user.uid });
//                     alert(`Verified! ${user.uid}`);
//                 })
//                 .catch((error) => {
//                     alert(error.message);
//                     console.log(error);
//                 });
//         } else {
//             alert("Please enter a 6 digit OTP code.");
//         }
//     };

//     renderConfirmationCodeView = () => {
//         return (
//             <View style={styles.verificationView}>
//                 <TextInput
//                     style={styles.textInput}
//                     placeholder="Verification code"
//                     placeholderTextColor="#eee"
//                     value={this.state.verificationCode}
//                     keyboardType="numeric"
//                     onChangeText={(verificationCode) => {
//                         this.setState({ verificationCode });
//                     }}
//                     maxLength={6}
//                 />
//                 <TouchableOpacity style={[styles.themeButton, { marginTop: 20 }]} onPress={this.handleVerifyCode}>
//                     <Text style={styles.themeButtonTitle}>Verify Code</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     @autobind
//     setphone(phone: string) {
//         this.setState({ phone });
//     }

//     @autobind
//     next() {
//         const { phone } = this.state;
//         if (phone === "") {
//             // eslint-disable-next-line
//             alert("Please provide a phone number.");
//         } else {
//             SignUpStore.phoneNumber = phone;
//             this.PhoneSignIn();
//             //this.props.navigation.navigate("SignUpPassword");
//         }
//     }

//     onTextChange(text) {
//         //console.log("Text has changed!");
//         var cleaned = ("" + text).replace(/\D/g, "");
//         var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
//         if (match) {
//             var intlCode = match[1] ? "+1 " : "",
//                 number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");

//             this.setState({
//                 phone: number,
//             });

//             return;
//         }

//         this.setState({
//             phone: text,
//         });
//     }

//     render(): React.Node {
//         const { navigation } = this.props;
//         return (
//             <SignUpContainer
//                 title="Phone number"
//                 subtitle="Your Login (we won't share)"
//                 next={this.next}
//                 {...{ navigation }}
//             >
//                 <TextField
//                     placeholder="(###) ###-####"
//                     onChangeText={(text) => this.onTextChange(text)}
//                     value={this.state.phone}
//                     textContentType="telephoneNumber"
//                     dataDetectorTypes="phoneNumber"
//                     keyboardType="phone-pad"
//                     maxLength={14}
//                     contrast
//                     autoCapitalize="none"
//                     autoCompleteType="tel"
//                     autoCorrect={false}
//                     returnKeyType="go"
//                     onSubmitEditing={this.next}
//                 />
//                 {/* <View style={styles.row}>
//                     <Switch />
//                     <Text style={styles.text}>Sign up for the newsletter</Text>
//                 </View> */}
//             </SignUpContainer>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     text: {
//         flexWrap: "wrap",
//         marginLeft: Theme.spacing.small,
//         flex: 1,
//     },
//     row: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginVertical: Theme.spacing.tiny,
//     },
//     verificationView: {
//         width: "100%",
//         alignItems: "center",
//         marginTop: 50,
//     },
// });
