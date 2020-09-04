// @flow
import * as _ from "lodash";
import { observable, computed } from "mobx";
import type { TrixPix, TrixPicture } from "../components/Model";

const DEFAULT_PAGE_SIZE = 1000;

type Subscription = () => void;

export default class PhotoStore {
    // eslint-disable-next-line flowtype/no-weak-types
    cursor: any;
    // eslint-disable-next-line flowtype/no-weak-types
    lastKnownEntry: any;
    // eslint-disable-next-line flowtype/no-weak-types
    query: any;

    //profiles: { [uid: string]: Profile } = {};

    @observable _feed: TrixPix;

    @computed get feed(): TrixPix {
        return this._feed;
    }
    set feed(feed: TrixPix) {
        this._feed = feed;
    }

    // eslint-disable-next-line flowtype/no-weak-types
    init(query: any) {
        this.query = query;
        this.loadFeed();
    }

    async checkForNewEntriesInFeed(): Promise<void> {
        //console.log("running it!");
        if (this.lastKnownEntry) {
            console.log("1");
            const snap = await this.query.endBefore(this.lastKnownEntry).get();
            if (snap.docs.length === 0) {
                console.log("2");
                if (!this.feed) {
                    console.log("3");
                    this.feed = [];
                }
                return;
            }
            const posts: TrixPicture[] = [];
            snap.forEach((postDoc) => {
                console.log("loop!");
                posts.push(postDoc.data());
            });
            //const feed = await this.joinProfiles(posts);
            this.addToFeed(posts);
            console.log("size: ", Object.keys(posts).length);
            // eslint-disable-next-line prefer-destructuring
            this.lastKnownEntry = snap.docs[0];
        } else {
            await this.loadFeed();
        }
    }

    async loadFeed(): Promise<void> {
        // eslint-disable-next-line prefer-destructuring
        let query = this.query;
        //console.log("queryio: ", query);
        if (this.cursor) {
            query = query.startAfter(this.cursor);
        }
        //console.log("curry: ", this.cursor);
        const snap = await query.limit(DEFAULT_PAGE_SIZE).get();
        //console.log("snappy: ", snap);
        if (snap.docs.length === 0) {
            if (!this.feed) {
                this.feed = [];
            }
            return;
        }
        const posts: TrixPicture[] = [];
        //console.log("posts0: ", posts);
        snap.forEach((postDoc) => {
            posts.push(postDoc.data());
        });
        //console.log("posts1: ", posts);
        //const feed = await this.joinProfiles(posts);
        const feed = posts;
        if (!this.feed) {
            this.feed = [];
            // eslint-disable-next-line prefer-destructuring
            this.lastKnownEntry = snap.docs[0];
        }
        this.addToFeed(feed);
        this.cursor = _.last(snap.docs);
    }

    addToFeed(entries: TrixPicture[]) {
        const feed = _.uniqBy([...this.feed.slice(), ...entries], (entry) => entry.id);
        this.feed = _.orderBy(feed, (entry) => entry.timestamp, ["desc"]);
    }
}
