// @flow
import * as React from "react";

import SmartImage from "./SmartImage";
import type {BaseProps} from "./Types";

type AvatarProps = BaseProps & {
    uri: string,
    size: number
};

export default class Avatar extends React.PureComponent<AvatarProps> {

    static defaultProps = {
        size: 50
    };

    render(): React.Node {
        const {uri, style, size} = this.props;
        const computedStyle = {
            height: size,
            width: size,
            borderRadius: size / 2
        };
        return <SmartImage style={[style, computedStyle]} showSpinner={false} {...{ uri }} />;
    }
}
