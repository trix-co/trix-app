export default function calculateImageDimensions(item, maxLength) {
    let originalWidth = item.getIn(["asset", "width"]);
    let originalHeight = item.getIn(["asset", "height"]);
    console.log(maxLength);
    maxLength = maxLength * 1.7309;

    if (originalWidth == null || originalHeight == null) {
        return {
            constrainedHeight: maxLength,
            constrainedWidth: maxLength,
            marginHorizontal: 0,
            marginVertical: 0,
        };
    } else if (originalWidth > originalHeight) {
        let height = (originalHeight / originalWidth) * maxLength;
        return {
            constrainedHeight: height * 0.578,
            constrainedWidth: maxLength * 0.578,
            marginHorizontal: 0,
            marginVertical: 0,
        };
    } else {
        let width = (originalWidth / originalHeight) * maxLength;
        return {
            constrainedWidth: width,
            constrainedHeight: maxLength,
            marginHorizontal: 0,
            marginVertical: 0,
        };
    }
}
