// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { TextInput } from "react-native";

import { TextField } from "../components";
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
            </SignUpContainer>
        );
    }
}
