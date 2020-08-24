// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { TextInput, View } from "react-native";

import SignUpContainer from "./SignUpContainer";

import { TextField, Firebase } from "../components";
import type { NavigationProps } from "../components/Types";

type LoginState = {
    email: string,
    password: string,
    loading: boolean,
};

export default class Login extends React.Component<NavigationProps<*>, LoginState> {
    state: LoginState = {
        email: "",
        password: "",
        loading: false,
    };

    password: TextInput;

    @autobind
    setEmail(email: string) {
        this.setState({ email });
    }

    @autobind
    setPassword(password: string) {
        this.setState({ password });
    }

    @autobind
    setPasswordRef(input: TextInput) {
        this.password = input;
    }

    @autobind
    goToPassword() {
        this.password.focus();
    }

    @autobind
    async login(): Promise<void> {
        const { email, password } = this.state;
        try {
            if (email === "") {
                throw new Error("Please provide an email address.");
            }
            if (password === "") {
                throw new Error("Please provide a password.");
            }
            this.setState({ loading: true });
            await Firebase.auth.signInWithEmailAndPassword(email, password);
        } catch (e) {
            // eslint-disable-next-line no-alert
            alert(e);
            this.setState({ loading: false });
        }
    }

    render(): React.Node {
        const { navigation } = this.props;
        const { loading } = this.state;
        return (
            <SignUpContainer
                title="Login"
                subtitle="Get Started"
                nextLabel="Login"
                next={this.login}
                first
                {...{ navigation, loading }}
            >
                <TextField
                    placeholder="Email"
                    keyboardType="email-address"
                    contrast
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={this.goToPassword}
                    onChangeText={this.setEmail}
                />
                <TextField
                    secureTextEntry
                    placeholder="Password"
                    contrast
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    textInputRef={this.setPasswordRef}
                    onSubmitEditing={this.login}
                    onChangeText={this.setPassword}
                />
            </SignUpContainer>
        );
    }
}
