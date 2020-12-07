//signup
import firebase from 'firebase'

  var firebaseConfig = {
    apiKey: "AIzaSyBWmS0w_Ex_mNBKzyvsNHVLqju97_q30ns",
    authDomain: "vuejs-stock-trader-f7694.firebaseapp.com",
    databaseURL: "https://vuejs-stock-trader-f7694.firebaseio.com",
    projectId: "vuejs-stock-trader-f7694",
    storageBucket: "vuejs-stock-trader-f7694.appspot.com",
    messagingSenderId: "738625718881",
    appId: "1:738625718881:web:3b444ca61121336de7b820",
    measurementId: "G-JQ12LXEBCS"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const db = firebase.database();

  export { firebaseApp, auth, db }