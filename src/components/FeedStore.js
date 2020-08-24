// @flow
import * as _ from "lodash";
import {observable, computed} from "mobx";

import Firebase from "../components/Firebase";
import type {Feed, FeedEntry, Profile, Post} from "../components/Model";

const DEFAULT_PAGE_SIZE = 5;

const DEFAULT_PROFILE: Profile = {
    name: "John Doe",
    outline: "React Native",
    picture: {
        // eslint-disable-next-line max-len
        uri: "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/fiber%2Fprofile%2FJ0k2SZiI9V9KoYZK7Enru5e8CbqFxdzjkHCmzd2yZ1dyR22Vcjc0PXDPslhgH1JSEOKMMOnDcubGv8s4ZxA.jpg?alt=media&token=6d5a2309-cf94-4b8e-a405-65f8c5c6c87c",
        preview: "data:image/gif;base64,R0lGODlhAQABAPAAAKyhmP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    }
};

type Subscription = () => void;

export default class FeedStore {
    // eslint-disable-next-line flowtype/no-weak-types
    cursor: any;
    // eslint-disable-next-line flowtype/no-weak-types
    lastKnownEntry: any;
    // eslint-disable-next-line flowtype/no-weak-types
    query: any;

    profiles: { [uid: string]: Profile } = {};

    @observable _feed: Feed;

    @computed get feed(): Feed { return this._feed; }
    set feed(feed: Feed) { this._feed = feed; }

    // eslint-disable-next-line flowtype/no-weak-types
    init(query: any) {
        this.query = query;
        this.loadFeed();
    }

    async joinProfiles(posts: Post[]): Promise<FeedEntry[]> {
        const uids = posts.map(post => post.uid).filter(uid => this.profiles[uid] === undefined);
        const profilePromises = _.uniq(uids).map(uid => (async () => {
            try {
                const profileDoc = await Firebase.firestore.collection("users").doc(uid).get();
                this.profiles[uid] = profileDoc.data();
            } catch (e) {
                this.profiles[uid] = DEFAULT_PROFILE;
            }
        })());
        await Promise.all(profilePromises);
        return posts.map(post => {
            const profile = this.profiles[post.uid];
            return { profile, post };
        });
    }

    async checkForNewEntriesInFeed(): Promise<void> {
        if (this.lastKnownEntry) {
            const snap = await this.query.endBefore(this.lastKnownEntry).get();
            if (snap.docs.length === 0) {
                if (!this.feed) {
                    this.feed = [];
                }
                return;
            }
            const posts: Post[] = [];
            snap.forEach(postDoc => {
                posts.push(postDoc.data());
            });
            const feed = await this.joinProfiles(posts);
            this.addToFeed(feed);
            // eslint-disable-next-line prefer-destructuring
            this.lastKnownEntry = snap.docs[0];
        }
    }

    async loadFeed(): Promise<void> {
        // eslint-disable-next-line prefer-destructuring
        let query = this.query;
        if (this.cursor) {
            query = query.startAfter(this.cursor);
        }
        const snap = await query.limit(DEFAULT_PAGE_SIZE).get();
        if (snap.docs.length === 0) {
            if (!this.feed) {
                this.feed = [];
            }
            return;
        }
        const posts: Post[] = [];
        snap.forEach(postDoc => {
            posts.push(postDoc.data());
        });
        const feed = await this.joinProfiles(posts);
        if (!this.feed) {
            this.feed = [];
            // eslint-disable-next-line prefer-destructuring
            this.lastKnownEntry = snap.docs[0];
        }
        this.addToFeed(feed);
        this.cursor = _.last(snap.docs);
    }

    addToFeed(entries: FeedEntry[]) {
        const feed = _.uniqBy([...this.feed.slice(), ...entries], entry => entry.post.id);
        this.feed = _.orderBy(feed, entry => entry.post.timestamp, ["desc"]);
    }

    subscribeToPost(id: string, callback: Post => void): Subscription {
        return Firebase.firestore.collection("feed").where("id", "==", id).onSnapshot(async snap => {
            const post = snap.docs[0].data();
            callback(post);
            this.feed.forEach((entry, index) => {
                if (entry.post.id === post.id) {
                    this.feed[index].post = post;
                }
            });
        });
    }

    subscribeToProfile(id: string, callback: Profile => void): Subscription {
        return Firebase.firestore.collection("users").doc(id).onSnapshot(async snap => {
            const profile = snap.exists ? snap.data() : DEFAULT_PROFILE;
            callback(profile);
            this.feed.forEach((entry, index) => {
                if (entry.post.uid === id) {
                    this.feed[index].profile = profile;
                }
            });
        });
    }
}
