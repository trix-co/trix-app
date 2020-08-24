// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {Switch as RNSwitch} from "react-native";

import {Theme} from "./Theme";

type SwitchProps = {
    defaultValue?: boolean,
    onToggle?: boolean => void,
    onTintColor?: string
};

type SwitchState = {
    value: boolean
};

export default class Switch extends React.Component<SwitchProps, SwitchState> {

    static defaultProps = {
        onTintColor: Theme.palette.primary
    };

    constructor(props: SwitchProps) {
        super(props);
        const {defaultValue} = props;
        this.state = {
            value: !!defaultValue
        };
    }

    @autobind
    toggle() {
        const {onToggle} = this.props;
        const {value} = this.state;
        this.setState({ value: !value });
        if (onToggle) {
            onToggle(!value);
        }
    }

    render(): React.Node {
        const {onTintColor: trackColor} = this.props;
        const {value} = this.state;
        return (
            <RNSwitch
                trackColor={{ true: trackColor, false: trackColor }}
                onValueChange={this.toggle}
                {...{value}}
            />
        );
    }
}
