import React, { Component } from "react";
import { View, Image, ImageBackground } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

export default class CachedImage extends Component {
    state = {
        imgURI: "",
    };

    async componentDidMount() {
        const filesystemURI = await this.getImageFilesystemKey(this.props.source.uri);
        await this.loadImage(filesystemURI, this.props.source.uri);
        if (this.props.onRef != null) {
            this.props.onRef(this);
        }
    }

    async componentDidUpdate() {
        const filesystemURI = await this.getImageFilesystemKey(this.props.source.uri);
        if (this.props.source.uri === this.state.imgURI || filesystemURI === this.state.imgURI) {
            return null;
        }
        await this.loadImage(filesystemURI, this.props.source.uri);
    }

    async componentWillUnmount() {}

    async getImageFilesystemKey(remoteURI) {
        const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, remoteURI);
        return `${FileSystem.cacheDirectory}${hashed}.jpg`;
    }

    async loadImage(filesystemURI, remoteURI) {
        try {
            // Use the cached image if it exists
            const metadata = await FileSystem.getInfoAsync(filesystemURI);
            if (metadata.exists) {
                this.setState({
                    imgURI: filesystemURI,
                });
                return;
            }

            // otherwise download to cache
            const imageObject = await FileSystem.downloadAsync(remoteURI, filesystemURI, {
                sessionType: FileSystem.FileSystemSessionType.FOREGROUND,
            });
            this.setState({
                imgURI: imageObject.uri,
            });
        } catch (err) {
            console.log("Image loading error:", err);
            this.setState({ imgURI: remoteURI });
        }
    }

    render() {
        return (
            <View>
                {this.props.isBackground ? (
                    <ImageBackground {...this.props} source={this.state.imgURI ? { uri: this.state.imgURI } : null}>
                        {this.props.children}
                    </ImageBackground>
                ) : (
                    <Image
                        {...this.props}
                        ref={(view) => (this._view = view)}
                        source={this.state.imgURI ? { uri: this.state.imgURI } : null}
                    />
                )}
            </View>
        );
    }
}
