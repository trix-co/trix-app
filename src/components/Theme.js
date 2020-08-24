// @flow
type Typography = {
    fontFamily: string,
    fontSize: number,
    lineHeight: number,
};

type Color = string;

type Theme = {
    palette: {
        primary: Color,
        info: Color,
        secondary: Color,
        success: Color,
        danger: Color,
        warning: Color,
        sidebar: Color,
        lightGray: Color,
        borderColor: Color,
        white: Color,
        black: Color,
    },
    typography: {
        color: string,
        bold: string,
        semibold: string,
        normal: string,
        light: string,
        header1: Typography,
        header2: Typography,
        header3: Typography,
        large: Typography,
        regular: Typography,
        small: Typography,
        micro: Typography,
    },
    spacing: {
        tiny: number,
        small: number,
        base: number,
        large: number,
        xLarge: number,
    },
};

const theme: Theme = {
    palette: {
        primary: "#48bf84",
        info: "#00A699",
        secondary: "#0f5257",
        success: "#5cb85c",
        danger: "#d93900",
        warning: "#f0ad4e",
        sidebar: "#484848",
        lightGray: "#BFBFBF",
        borderColor: "#0d2129",
        white: "white",
        black: "black",
    },
    typography: {
        color: "#666666",
        bold: "SFProText-Bold",
        semibold: "SFProText-Semibold",
        normal: "SFProText-Medium",
        light: "SFProText-Light",
        header1: {
            fontSize: 48,
            lineHeight: 58,
            fontFamily: "Ubuntu-Bold",
        },
        header2: {
            fontSize: 36,
            lineHeight: 43,
            fontFamily: "Ubuntu-Bold",
        },
        header3: {
            fontSize: 24,
            lineHeight: 28,
            fontFamily: "Ubuntu-Bold",
        },
        large: {
            fontSize: 14,
            lineHeight: 21,
            fontFamily: "Ubuntu-Bold",
        },
        regular: {
            fontSize: 14,
            lineHeight: 21,
            fontFamily: "Ubuntu-Medium",
        },
        small: {
            fontSize: 14,
            lineHeight: 18,
            fontFamily: "Ubuntu-Regular",
        },
        micro: {
            fontSize: 8,
            lineHeight: 8,
            fontFamily: "Ubuntu-Bold",
        },
    },
    spacing: {
        tiny: 8,
        small: 16,
        base: 24,
        large: 48,
        xLarge: 64,
    },
};

export { theme as Theme };
