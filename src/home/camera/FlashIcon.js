// @flow
import * as React from "react";
import Svg, {Path, Polygon} from "react-native-svg";

type FlashIconProps = {
    on: boolean
};

// eslint-disable-next-line react/no-multi-comp
export default class FlashIcon extends React.PureComponent<FlashIconProps> {

    render(): React.Node {
        const {on} = this.props;
        if (on) {
            return <FlashOn />;
        }
        return <FlashOff />;
    }
}

// eslint-disable-next-line react/no-multi-comp, react/prefer-stateless-function
class FlashOn extends React.PureComponent<{}> {
    render(): React.Node {
        return (
            <Svg
                width={25}
                height={25}
                viewBox="0 0 20 22"
            >
                <Polygon
                    points="10 0 0 12 9 12 8 20 18 8 9 8"
                    strokeWidth="2"
                    stroke="#fff"
                    fill="none"
                />
            </Svg>
        );
    }
}

// eslint-disable-next-line react/no-multi-comp, react/prefer-stateless-function
class FlashOff extends React.PureComponent<{}> {
    render(): React.Node {
        return (
            <Svg
                width={25}
                height={25}
                viewBox="0 0 21 23"
            >
                <Path
                    // eslint-disable-next-line max-len
                    d="M5.35717565,8.77138922 L1,14 L10,14 L9,22 L13.3571757,16.7713892 M15.6428243,14.2286108 L15.6428243,14.2286108 L20,9 L11,9 L12,1 L7.64282435,6.22861078"
                    strokeWidth="2"
                    stroke="#fff"
                    fill="none"
                />
                <Path
                    d="M4,6 L16,18"
                    strokeWidth="2"
                    stroke="#fff"
                    fill="none"
                />
            </Svg>
        );
    }
}
