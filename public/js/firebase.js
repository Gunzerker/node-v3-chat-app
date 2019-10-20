var firebase = require('firebase');
  require('firebase/auth');
  require('firebase/database');
var firebaseConfig = {
    apiKey: "AIzaSyAobvyB_YyUM2L3-VXmmSsqC__ND4h8KVE",
    authDomain: "chat-app-78105.firebaseapp.com",
    databaseURL: "https://chat-app-78105.firebaseio.com",
    projectId: "chat-app-78105",
    storageBucket: "chat-app-78105.appspot.com",
    messagingSenderId: "823163563539",
    appId: "1:823163563539:web:9dff27c6dadcb6588f99e6",
    measurementId: "G-NZG0XT8M2S"
  };
  firebase.initializeApp(config); 
  module.exports = {
    isAuthenticated: function (req, res, next) {
      var user = firebase.auth().currentUser;
      if (user !== null) {
        req.user = user;
        next();
      } else {
        res.redirect('/login');
      }
    },
  }