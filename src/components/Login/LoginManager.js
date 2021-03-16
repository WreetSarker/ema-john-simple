import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () => {

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }
}

export const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
        .then(res => {
            const credential = res.credential;
            const token = credential.accessToken;
            const user = res.user;
            const { displayName, photoURL, email } = user;
            const signedInUser = {
                isSignedIn: true,
                name: displayName,
                email: email,
                photoURL: photoURL,
                success: true,
            }
            return signedInUser;
            console.log(email, displayName, photoURL);
        }).catch(err => {
            console.log(err);
            console.log(err.message);
        })
}
export const handleFbSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase
        .auth()
        .signInWithPopup(fbProvider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            const credential = result.credential;

            // The signed-in user info.
            const user = result.user;
            user.success = true;
            return user;
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const accessToken = credential.accessToken;
            console.log('fb user', user);
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;

            // ...
        });
}
export const handleSignOut = () => {
    return firebase.auth().signOut()
        .then(res => {
            const signedOutUser = {
                isSignedIn: false,
                name: '',
                email: '',
                photoURL: ''
            };
            return signedOutUser;
        })
        .catch(err => {

        })
}

export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((res) => {
            const newUserInfo = res.user;
            newUserInfo.error = '';
            newUserInfo.success = true;
            updateUserName(name);
            return newUserInfo;

        })
        .catch((error) => {
            const newUserInfo = {};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            return newUserInfo;
        });
}

export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((res) => {
            const newUserInfo = res.user;
            newUserInfo.error = '';
            newUserInfo.success = true;
            // console.log('signed in user info', res.user);
            return newUserInfo;
        })
        .catch((error) => {
            const newUserInfo = {};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            return newUserInfo;
        });
}
const updateUserName = name => {
    const user = firebase.auth().currentUser;
    user.updateProfile({
        displayName: name,
    }).then(function () {

    }).catch(function (error) {
    });
}