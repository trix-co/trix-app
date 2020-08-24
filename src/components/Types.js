// @flow
import type {____ViewStyleProp_Internal as Style} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import type {
    // eslint-disable-next-line no-unused-vars
    NavigationNavigatorProps, NavigationScreenProp, NavigationState
} from "react-navigation";

export type ScreenProps<O: {} = {}, S: {} = NavigationState> = NavigationNavigatorProps<O, S>;

export type NavigationProps<S: {} = NavigationState> = {
    navigation: NavigationScreenProp<S>
};

export type ScreenParams<P> = ScreenProps<{}, { params: P }>;

export type BaseProps = {
    style?: Style
};
