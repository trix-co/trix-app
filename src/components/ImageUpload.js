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
            //console.log("droidpic", ogPic.width, ogPic.height);
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

            var body = new FormData();
            body.append(file);

            fetch("https://mgezb5eugf.execute-api.us-west-2.amazonaws.com/api", {
                method: "POST",
                headers: {
                    accept: "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bdy),
            }).then((response) => {
                response.json().then((json) => {
                    //console.log(JSON.stringify(response));
                    //console.log(JSON.stringify(json));
                    //console.log("hello", json.body.url);
                    const signedUrl = json.body.url.substring(1, json.body.url.length - 1);
                    const xhr = new XMLHttpRequest();
                    //console.log(signedUrl);
                    xhr.open("PUT", signedUrl);
                    xhr.setRequestHeader("Content-Type", "image/jpeg");
                    xhr.setRequestHeader("x-amz-acl", "public-read");
                    xhr.send(file);
                });
            });

            //console.log("https://trix.sfo2.cdn.digitaloceanspaces.com/".concat("unprocessed/").concat(file["name"]));
            return "https://trix.sfo2.cdn.digitaloceanspaces.com/".concat("unprocessed/").concat(file["name"]);
        } catch (error) {
            console.log(error);
        }
    }
}
