// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app'

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";

// // Add the Firebase products that you want to use
// import "firebase/auth";
import 'firebase/firestore'

export default () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyD2-NHlVpXhk25NDLp4AI744bh6cUhXDjc',
    authDomain: 'ahoy-kino.firebaseapp.com',
    databaseURL: 'https://ahoy-kino.firebaseio.com',
    projectId: 'ahoy-kino',
    storageBucket: 'ahoy-kino.appspot.com',
    messagingSenderId: '286129637538',
    appId: '1:286129637538:web:0ca508b13d1ab874ef2ffb',
  }
  // firebase.initializeApp(firebaseConfig)
  console.log(firebase.apps.length)
  return !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase
}

// Initialize Firebase
