const express=require('express')
const path=require('path')
const bcrypt=require('bcryptjs')
const publicDirectoryPath=path.join(__dirname,'../public')
const User=require('../models/users')
var firebase = require("firebase/app")


router=new express.Router()

var logedin=[]
var current=[]

router.post('/register',async(req,res)=>{

    firebase.auth().createUserWithEmailAndPassword(req.body.mail, req.body.psw).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
})
    
})
router.post('/login',async(req,res)=>{

    firebase.auth().signInWithEmailAndPassword(req.body.mail, req.body.psw).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          logedin.push(user)
          current[0]=user
          // ...
        } else {
          // User is signed out.
          // ...
        }
      });
      res.redirect('http://localhost:3000/')

})
router.get('/logout',async(req,res)=>{
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  })
})
router.get('',(req,res)=>{
    res.render('index')
})

module.exports={router,logedin,current}