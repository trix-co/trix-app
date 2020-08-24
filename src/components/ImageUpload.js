// @flow
import * as ImageManipulator from "expo-image-manipulator";

import Firebase from "./Firebase";

export type Picture = {
    uri: string,
    width: number,
    height: number
};

const id = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

export default class ImageUpload {

    static uid(): string {
        return `${id()}${id()}-${id()}-${id()}-${id()}-${id()}${id()}${id()}`;
    }

    static async preview({ uri }: Picture): Promise<string> {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 5, height: 5 }}],
            { base64: true, format: "jpeg" }
        );
        return `data:image/jpeg;base64,${result.base64 || ""}`;
    }

    static async upload(ogPic: Picture): Promise<string> {
        const picture = await ImageManipulator.manipulateAsync(
            ogPic.uri,
            [{ resize: { width: 800, height: 800 * (ogPic.height / ogPic.width) }}],
            { base64: false, format: "jpeg" }
        );
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // eslint-disable-next-line
            xhr.onload = function () {
                resolve(xhr.response);
            };
            // eslint-disable-next-line
            xhr.onerror = function (e) {
                // eslint-disable-next-line
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", picture.uri, true);
            xhr.send(null);
        });
        const ref = Firebase
            .storage
            .ref()
            .child(ImageUpload.uid());
        const snapshot = await ref.put(blob);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    }
}
