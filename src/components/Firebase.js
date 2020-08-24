// @flow
import * as firebase from "firebase";
import "firebase/firestore";

const config = {
    apiKey: "AIzaSyBlCnMSpKypjjB3FD9bMx37WMIaadbxOVY",
    authDomain: "trix.co",
    databaseURL: "https://trix-ai-app.firebaseio.com",
    projectId: "trix-ai-app",
    storageBucket: "trix-ai-app.appspot.com",
    messagingSenderId: "375354417916",
    appId: "1:375354417916:web:0b1b9835da7b41b72cad79",
    measurementId: "G-6VZQW1F24R",
};

export default class Firebase {
    static firestore: firebase.firestore.Firestore;
    static auth: firebase.auth.Auth;
    static storage: firebase.storage.Storage;

    static init() {
        firebase.initializeApp(config);
        Firebase.auth = firebase.auth();
        Firebase.firestore = firebase.firestore();
        Firebase.storage = firebase.storage();
        Firebase.app = firebase.app();
    }
}
