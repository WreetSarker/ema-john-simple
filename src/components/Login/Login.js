import { useContext, useState } from 'react';

import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import { handleGoogleSignIn, initializeLoginFramework, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './LoginManager';

function Login() {
    const [newUser, setNewUser] = useState(false);
    initializeLoginFramework();
    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(resp => {
                setUser(resp);
                setLoggedInUser(resp);
                history.replace(from);
            })
    }
    const fbSignIn = () => {
        handleFbSignIn()
            .then(res => {
                setUser(res);
                setLoggedInUser(res);
                history.replace(from);
            })
    }
    const signOut = () => {
        handleSignOut()
            .then(res => {
                setUser(res);
                loggedInUser(res);
            })
    }
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        error: '',
        success: false,
        photoURL: ''
    })

    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
            createUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    setUser(res);
                    setLoggedInUser(res);
                    history.replace(from);
                })
        }
        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    setUser(res);
                    setLoggedInUser(res);
                    history.replace(from);
                })
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


    return (
        <div style={{ textAlign: 'center' }}>
            {
                user.isSignedIn ? <button onClick={signOut} >Sign out</button> : <button onClick={googleSignIn} >Sign in</button>
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
