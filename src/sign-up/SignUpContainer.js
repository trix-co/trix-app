// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions} from "react-native";
import {Content} from "native-base";

import {Text, Container, Button, Theme} from "../components";
import type {NavigationProps} from "../components/Types";

type SignUpContainerProps = NavigationProps<*> & {
    title: string,
    subtitle: string,
    next: () => void | Promise<void>,
    children?: React.ChildrenArray<React.Element<*>>,
    nextLabel: string,
    first?: boolean,
    loading?: boolean
};

export default class SignUpContainer extends React.Component<SignUpContainerProps> {

    static defaultProps = {
        nextLabel: "Next"
    };

    @autobind
    back() {
        const {navigation, first} = this.props;
        if (first) {
            navigation.navigate("Welcome");
        } else {
            navigation.pop();
        }
    }

    render(): React.Node {
        const {title, subtitle, next, children, nextLabel, loading} = this.props;
        return (
            <Container gutter={1}>
                <Content style={styles.content}>
                    <View style={styles.innerContainer}>
                        <View>
                            <Text type="large">{subtitle}</Text>
                            <Text type="header2" gutterBottom>{title}</Text>
                        </View>
                        <View>{children}</View>
                        <View>
                            <Button label={nextLabel} full primary onPress={next} {...{loading}} />
                            <Button label="Back" full onPress={this.back} />
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const {height} = Dimensions.get("window");
const styles = StyleSheet.create({
    content: {
        padding: Theme.spacing.base
    },
    innerContainer: {
        height: height - (Theme.spacing.base * 2),
        justifyContent: "center"
    }
});
