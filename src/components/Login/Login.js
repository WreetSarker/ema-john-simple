import { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

function Login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        error: '',
        success: false,
        photoURL: ''
    })
    const handleSignIn = () => {
        firebase.auth().signInWithPopup(provider)
            .then(res => {
                const credential = res.credential;
                const token = credential.accessToken;
                const user = res.user;
                const { displayName, photoURL, email } = user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photoURL: photoURL
                }
                setUser(signedInUser);
                console.log(email, displayName, photoURL);
            }).catch(err => {
                console.log(err);
                console.log(err.message);
            })
    }
    const handleFbSignIn = () => {
        firebase
            .auth()
            .signInWithPopup(fbProvider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                const credential = result.credential;

                // The signed-in user info.
                const user = result.user;

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
    const handleSignOut = () => {
        firebase.auth().signOut()
            .then(res => {
                const signedOutUser = {
                    isSignedIn: false,
                    name: '',
                    email: '',
                    photoURL: ''
                };
                setUser(signedOutUser);
            })
            .catch(err => {

            })
    }
    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    updateUserName(user.name);

                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo)
                });
        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    console.log('signed in user info', res.user);
                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo)
                });
        }

        e.preventDefault();
    }
    const handleBlur = (event) => {
        let isFieldValid = true;
        if (event.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if (event.target.name === 'password') {
            const isPasswordValid = event.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(event.target.value);
            isFieldValid = isPasswordValid && passwordHasNumber;
        }

        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }
    }

    const updateUserName = name => {
        const user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name,

        }).then(function () {
            // Update successful.
        }).catch(function (error) {
            // An error happened.
        });
    }
    return (
        <div style={{ textAlign: 'center' }}>
            {
                user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button> : <button onClick={handleSignIn} >Sign in</button>
            }
            <br />
            <button onClick={handleFbSignIn}>Sign in using Facebook</button>
            {
                user.isSignedIn && <div>
                    <h3>Welcome, {user.name}</h3>
                    <p>Your email address is: {user.email}</p>
                    <img style={{ width: '50%' }} src={user.photoURL} alt="" />
                </div>
            }

            <h1>Our own Authentication system</h1>
            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
            <label htmlFor="newUser">New User Sign up</label>
            <form onSubmit={handleSubmit}>
                {newUser && <input type="text" onBlur={handleBlur} name="name" placeholder="type your name" />}
                <br />
                <input type="text" onBlur={handleBlur} name="email" placeholder="email" required />
                <br />
                <input type="password" onBlur={handleBlur} name="password" placeholder="password" required />
                <br />
                <input type="submit" value="Submit" />
            </form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'logged in'} successfully</p>}
        </div>
    );
}

export default Login;
