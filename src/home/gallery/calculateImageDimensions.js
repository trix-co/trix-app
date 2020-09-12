import Layout from "./Layout";

export default function calculateImageDimensions(item, maxLength) {
    let originalWidth = item.getIn(["asset", "width"]);
    let originalHeight = item.getIn(["asset", "height"]);
    if (Platform.OS === "android") {
        maxLength = maxLength + 25;
    }
    // console.log(
    //     "MaxLength:",
    //     maxLength,
    //     "| OG Width: ",
    //     originalWidth,
    //     "| OG Height:",
    //     originalHeight,
    //     "| Screenwidth:",
    //     Layout.window.width,
    //     "| HeightToMaxHeight:",
    //     originalHeight / maxLength,
    //     "| WidthToMaxWidth:",
    //     originalWidth / Layout.window.width,
    //     "| Screen Height: ",
    //     Layout.window.height
    // );

    if (originalWidth == null || originalHeight == null) {
        return {
            constrainedHeight: maxLength,
            constrainedWidth: maxLength,
            marginHorizontal: 0,
            marginVertical: 0,
        };
    } else if (originalWidth > originalHeight) {
        let height = (maxLength * (originalHeight / maxLength)) / (originalWidth / Layout.window.width);
        return {
            constrainedHeight: height,
            constrainedWidth: Layout.window.width,
            marginHorizontal: 0,
            marginVertical: (maxLength - height) / 2,
        };
    } else {
        let height = (maxLength * (originalHeight / maxLength)) / (originalWidth / Layout.window.width);
        //console.log();
        return {
            constrainedWidth: Layout.window.width,
            constrainedHeight: height,
            marginHorizontal: 0,
            marginVertical: (maxLength - height) / 2,
        };
    }
}
