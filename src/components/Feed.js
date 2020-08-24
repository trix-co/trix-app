// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, FlatList, SafeAreaView} from "react-native";
import {observer} from "mobx-react/native";
import {type AnimatedEvent} from "react-native/Libraries/Animated/src/AnimatedEvent";

import FeedStore from "./FeedStore";

import FirstPost from "../components/FirstPost";
import {Theme} from "../components/Theme";
import RefreshIndicator from "../components/RefreshIndicator";
import Post from "../components/post";

import type {FeedEntry} from "../components/Model";
import type {NavigationProps} from "../components/Types";

type FlatListItem<T> = {
    item: T
};

type FeedProps = NavigationProps<> & {
    store: FeedStore,
    onScroll?: AnimatedEvent | () => void,
    bounce?: boolean,
    ListHeaderComponent?: React.Node
};

@observer
export default class Feed extends React.Component<FeedProps> {

    @autobind
    // eslint-disable-next-line class-methods-use-this
    keyExtractor(item: FeedEntry): string {
        return item.post.id;
    }

    @autobind
    loadMore() {
        this.props.store.loadFeed();
    }

    @autobind
    renderItem({ item }: FlatListItem<FeedEntry>): React.Node {
        const {navigation, store} = this.props;
        const {post, profile} = item;
        return (
            <View style={styles.post}>
                <Post {...{navigation, post, store, profile}} />
            </View>
        );
    }

    render(): React.Node {
        const {onScroll, store, navigation, bounce, ListHeaderComponent} = this.props;
        const {feed} = store;
        const loading = feed === undefined;
        return (
            <SafeAreaView style={styles.list}>
                <FlatList
                    showsVerticalScrollIndicator
                    data={feed}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.loadMore}
                    ListEmptyComponent={(
                        <View style={styles.post}>
                            {loading ? <RefreshIndicator /> : <FirstPost {...{navigation}} />}
                        </View>
                    )}
                    {...{ onScroll, bounce, ListHeaderComponent }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    },
    post: {
        paddingHorizontal: Theme.spacing.small
    }
});
