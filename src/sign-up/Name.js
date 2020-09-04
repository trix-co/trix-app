// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { TextInput, Linking, Text } from "react-native";

import { TextField, Theme } from "../components";
import type { NavigationProps } from "../components/Types";

import SignUpStore from "./SignUpStore";
import SignUpContainer from "./SignUpContainer";

type NameState = {
    firstName: string,
    lastName: string,
};

export default class Name extends React.Component<NavigationProps<*>, NameState> {
    lastName: TextInput;

    state = {
        firstName: "",
        lastName: "",
    };

    @autobind
    setFirstName(firstName: string) {
        this.setState({ firstName });
    }

    @autobind
    setLastName(lastName: string) {
        this.setState({ lastName });
    }

    @autobind
    setLastNameRef(input: TextInput) {
        this.lastName = input;
    }

    @autobind
    goToLastName() {
        this.lastName.focus();
    }

    @autobind
    next() {
        const { firstName, lastName } = this.state;
        if (firstName === "") {
            // eslint-disable-next-line no-alert
            alert("Please provide a first name.");
        } else if (lastName === "") {
            // eslint-disable-next-line no-alert
            alert("Please provide a last name.");
        } else {
            SignUpStore.displayName = `${firstName} ${lastName}`;
            this.props.navigation.navigate("SignUpEmail");
        }
    }

    render(): React.Node {
        const { navigation } = this.props;
        return (
            <SignUpContainer title="Your name" subtitle="Sign up" next={this.next} first {...{ navigation }}>
                <TextField
                    placeholder="First"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="Next"
                    onSubmitEditing={this.goToLastName}
                    onChangeText={this.setFirstName}
                />
                <TextField
                    placeholder="Last"
                    autoCapitalize="none"
                    autoCorrect={false}
                    //returnKeyType="go"
                    textInputRef={this.setLastNameRef}
                    onSubmitEditing={this.next}
                    onChangeText={this.setLastName}
                />
                <Text>
                    By creating an account you acknowledge that you have read and agree to our{" "}
                    <Text
                        style={{ color: Theme.palette.primary }}
                        onPress={() => Linking.openURL("https://trix.co/terms")}
                    >
                        Terms of Service
                    </Text>{" "}
                    &{" "}
                    <Text
                        style={{ color: Theme.palette.primary }}
                        onPress={() => Linking.openURL("https://trix.co/privacy")}
                    >
                        Privacy Policy
                    </Text>{" "}
                    {"\n"}
                </Text>
            </SignUpContainer>
        );
    }
}
