// @flow
import { observable, computed } from "mobx";

import { Firebase } from "../components";
import type { Profile } from "../components/Model";

const DEFAULT_PROFILE: Profile = {
    name: "John Doe",
    outline: "No Walkthrough",
    unprocessedCount: 0,
    picture: {
        // eslint-disable-next-line max-len
        uri: "https://trix.sfo2.cdn.digitaloceanspaces.com/unprocessed/991f1a16-5f53-11bb-5469-33addc769cb6.jpg",
        preview: "data:image/gif;base64,R0lGODlhAQABAPAAAKyhmP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
    },
};

export default class ProfileStore {
    @observable authSnapshot;

    @observable _profile: Profile = DEFAULT_PROFILE;

    @computed get profile(): Profile {
        return this._profile;
    }
    set profile(profile: Profile) {
        this._profile = profile;
    }

    async deregister(): Promise<void> {
        this.authSnapshot();
    }

    async init(): Promise<void> {
        // Load Profile
        const { uid } = Firebase.auth.currentUser;
        try {
            this.authSnapshot = await Firebase.firestore
                .collection("users")
                .doc(uid)
                .onSnapshot(async (snap) => {
                    if (snap.exists) {
                        this.profile = snap.data();
                        return this.profile;
                    } else {
                        await Firebase.firestore.collection("users").doc(uid).set(DEFAULT_PROFILE);
                        this.profile = DEFAULT_PROFILE;
                    }
                });
        } catch (e) {
            console.log("Profile snapshot code error!", e);
        }
    }
}
