// @flow
import * as ImageManipulator from "expo-image-manipulator";
import { RNS3 } from "react-native-aws3";
import Firebase from "./Firebase";

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

        const options = {
            keyPrefix: "unprocessed/",
            bucket: "trix",
            region: "us-west-2",
            awsUrl: "sfo2.digitaloceanspaces.com",
            accessKey: "EASSTJ6DUES5Q6A4DK4F",
            secretKey: "***REMOVED***",
            successActionStatus: 201,
        };

        try {
            const response = await RNS3.put(file, options);
            if (response.status === 201) {
                //console.log("Success: ", response);
                return "https://trix.sfo2.cdn.digitaloceanspaces.com/".concat(response.body.postResponse.key);
            } else {
                console.log("Failed to upload image to S3: ", response);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
