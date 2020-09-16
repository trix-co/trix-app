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
    const [loading, setLoading] = React.useState();

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
                        {...{ navigation, loading }}
                        onPress={async () => {
                            try {
                                setLoading(true);
                                const credential = firebase.auth.PhoneAuthProvider.credential(
                                    SignUpStore.verificationId,
                                    verificationCode
                                );
                                const user = await firebase.auth().signInWithCredential(credential);
                                const profile: Profile = {
                                    name: SignUpStore.displayName,
                                    unprocessedCount: 0,
                                    outline: "Walkthrough Incomplete",
                                    picture: {
                                        // eslint-disable-next-line max-len
                                        uri:
                                            "https://trix.sfo2.cdn.digitaloceanspaces.com/unprocessed/991f1a16-5f53-11bb-5469-33addc769cb6.jpg",
                                        preview:
                                            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAABaADAAQAAAABAAAABQAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgABQAFAwERAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/bAEMBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/dAAQAAf/aAAwDAQACEQMRAD8A/uQ+Gvh/xfofiv4uX/iDxovifTvEnjKHV/D+lHTNYs18JWaadHp/9kW82o+K/ENtPbNaWmmsy6Vp3hyzbUY9S1JrBptUdLUA/9k=",
                                    },
                                };
                                await Firebase.firestore.collection("users").doc(user.user.uid).set(profile);
                                //console.log("Phone sign-up successful 👍");
                                setLoading(false);
                            } catch (err) {
                                setLoading(false);
                                alert(`Error: code not accepted as valid. Please try again.`);
                            }
                        }}
                    />
                    <View>
                        <Button label="Back" full onPress={() => navigation.navigate("SignUpEmail")} />
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

// @flow
// import autobind from "autobind-decorator";
// import * as React from "react";

// import { TextField, Firebase } from "../components";

// import SignUpStore from "./SignUpStore";
// import SignUpContainer from "./SignUpContainer";

// import type { NavigationProps } from "../components/Types";
// import type { Profile } from "../components/Model";

// type PasswordState = {
//     password: string,
//     loading: boolean,
// };

// export default class Password extends React.Component<NavigationProps<*>, PasswordState> {
//     state = {
//         password: "",
//         loading: false,
//     };

//     @autobind
//     setPassword(password: string) {
//         this.setState({ password });
//     }

//     @autobind
//     async next(): Promise<void> {
//         const { password } = this.state;
//         const { email, displayName } = SignUpStore;
//         try {
//             if (password === "") {
//                 throw new Error("Please input your verification token.");
//             }
//             this.setState({ loading: true });
//             const user = await Firebase.auth.createUserWithEmailAndPassword(email, password);
//             const profile: Profile = {
//                 name: SignUpStore.displayName,
//                 outline: "React Native",
//                 picture: {
//                     // eslint-disable-next-line max-len
//                     uri:
//                         "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/fiber%2Fprofile%2FJ0k2SZiI9V9KoYZK7Enru5e8CbqFxdzjkHCmzd2yZ1dyR22Vcjc0PXDPslhgH1JSEOKMMOnDcubGv8s4ZxA.jpg?alt=media&token=6d5a2309-cf94-4b8e-a405-65f8c5c6c87c",
//                     preview: "data:image/gif;base64,R0lGODlhAQABAPAAAKyhmP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
//                 },
//             };
//             await Firebase.firestore.collection("users").doc(user.user.uid).set(profile);
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
//                 title="Verification"
//                 subtitle="sent via text"
//                 next={this.next}
//                 {...{ navigation, loading }}
//             >
//                 <TextField
//                     secureTextEntry
//                     placeholder="123456"
//                     contrast
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     maxLength={6}
//                     returnKeyType="go"
//                     onSubmitEditing={async () => {
//                         try {
//                             const credential = Firebase.auth.PhoneAuthProvider.credential(
//                                 SignUpStore.verificationId,
//                                 verificationCode
//                             );
//                             await Firebase.auth.signInWithCredential(credential);
//                             console.log("Phone authentication successful 👍");
//                         } catch (err) {
//                             alert(`Error: ${err.message}`);
//                         }
//                     }}
//                     onChangeText={this.setPassword}
//                 />
//             </SignUpContainer>
//         );
//     }
// }
