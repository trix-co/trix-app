// @flow
export type Picture = {
    uri: string,
    preview: string,
};

export type TrixPicture = {
    width: number,
    height: number,
    id: string,
    unalteredImageUrl: string,
    timestamp: number,
    uid: string,
    imageUrl: string,
    preview: string,
    tombstone: bool,
};

export type NativePicture = {
    width: number,
    height: number,
    id: string,
    timestamp: number,
    uid: string,
    imageUrl;: string,
    preview: string,
};

export type Profile = {
    picture: Picture,
    name: string,
    outline: string,
};

export type Post = {
    uid: string,
    id: string,
    likes: string[],
    comments: number,
    timestamp: number,
    text: string,
    picture: Picture,
};

export type Comment = {
    id: string,
    text: string,
    uid: string,
    timestamp: number,
};

export type FeedEntry = { post: Post, profile: Profile };
export type Feed = FeedEntry[];
export type TrixPix = TrixPicture[];

export type CommentEntry = { comment: Comment, profile: Profile };
export type Comments = CommentEntry[];
