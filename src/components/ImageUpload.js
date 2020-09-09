// @flow
import * as ImageManipulator from "expo-image-manipulator";
import { RNS3 } from "react-native-aws3";
import { Platform } from "react-native";

export type Picture = {
    uri: string,
    width: number,
    height: number,
};

const id = () =>
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);

export default class ImageUpload {
    static uid(): string {
        return `${id()}${id()}-${id()}-${id()}-${id()}-${id()}${id()}${id()}`;
    }

    static async preview({ uri }: Picture): Promise<string> {
        const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 5, height: 5 } }], {
            base64: true,
            format: "jpeg",
        });
        return `data:image/jpeg;base64,${result.base64 || ""}`;
    }

    static async upload(ogPic: Picture): Promise<string> {
        if (Platform.OS === "android") {
            console.log("droidpic", ogPic.width, ogPic.height);
        }
        const picture = await ImageManipulator.manipulateAsync(
            ogPic.uri,
            [{ resize: { width: 1600, height: 1600 * (ogPic.height / ogPic.width) } }],
            { base64: false, format: "jpeg" }
        );

        const file = {
            // `uri` can also be a file system path (i.e. file://)
            uri: picture.uri,
            name: ImageUpload.uid().concat(".jpg"),
            type: "image/jpeg",
        };

        // const options = {
        //     keyPrefix: "unprocessed/",
        //     bucket: "trix",
        //     region: "us-west-2",
        //     awsUrl: "sfo2.digitaloceanspaces.com",
        //     accessKey: "EASSTJ6DUES5Q6A4DK4F",
        //     secretKey: "***REMOVED***",
        //     successActionStatus: 201,
        // };

        try {
            const bdy = { id: file["name"] };
            let options = {
                method: "POST",
                body: file,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            };
            const response = await fetch(
                "https://mgezb5eugf.execute-api.us-west-2.amazonaws.com/api",
                options
            ).then((response) => response.json());

            // console.log("boof", JSON.stringify(response));s
            // const signedUrl = response["body"]["url"];
            // const xhr = new XMLHttpRequest();
            // xhr.open("PUT", signedUrl);
            // console.log("oof", xhr);
            // xhr.setRequestHeader("Content-Type", file.type);
            // xhr.setRequestHeader("x-amz-acl", "public-read");
            // console.log("oof2", xhr);
            // xhr.send(file["uri"]).then(() => consle.log("big deal", xhr.status));

            console.log("https://trix.sfo2.cdn.digitaloceanspaces.com/".concat("unprocessed/").concat(file["name"]));
            return "https://trix.sfo2.cdn.digitaloceanspaces.com/".concat("unprocessed/").concat(file["name"]);
        } catch (error) {
            console.log(error);
        }
    }
}
