// @flow
import {observable, computed} from "mobx";

import {Firebase} from "../../components";
import type {Comment, Comments, CommentEntry} from "../../components/Model";

export default class CommentsStore {

    @observable _comments: Comments = [];
    @observable _comment: string = "";

    @computed get comments(): Comments { return this._comments; }
    set comments(comments: Comments) { this._comments = comments; }

    @computed get comment(): string { return this._comment; }
    set comment(comment: string) { this._comment = comment; }

    async init(postId: string): Promise<void> {
        const query = Firebase.firestore.collection("feed")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "desc");
        query.onSnapshot(async snap => {
            const comments: Promise<CommentEntry>[] = [];
            snap.forEach(commentDoc => comments.push((async () => {
                const comment = commentDoc.data();
                const profileDoc = await Firebase.firestore.collection("users").doc(comment.uid).get();
                const profile = profileDoc.data();
                return { comment, profile };
            })()));
            this.comments = await Promise.all(comments);
        });
    }

    async addComment(postId: string, comment: Comment): Promise<void> {
        const postRef = Firebase.firestore.collection("feed").doc(postId);
        this.comment = "";
        await postRef.collection("comments").add(comment);
        await Firebase.firestore.runTransaction(async transaction => {
            const postDoc = await transaction.get(postRef);
            const comments = postDoc.data().comments + 1;
            transaction.update(postRef, { comments });
        });
    }
}
