const express=require('express')
const path=require('path')
const bcrypt=require('bcryptjs')
const publicDirectoryPath=path.join(__dirname,'../public')
const User=require('../models/users')
var firebase = require("firebase/app")


router=new express.Router()

var logedin=[]
var current=[]
var rooms=[]


router.post('/register',async(req,res)=>{

    firebase.auth().createUserWithEmailAndPassword(req.body.mail, req.body.psw).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
})
    
})
router.post('/login',async(req,res)=>{

    await firebase.auth().signInWithEmailAndPassword(req.body.mail, req.body.psw).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      
    await firebase.auth().onAuthStateChanged(function(user) {
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
          console.log('yes')
          valid=1
          // ...
        } else {
          valid=0
          // User is signed out.
          // ...
        }
      });
      console.log (valid)
      if(valid==1){
        res.redirect('http://localhost:3000/?usermail='+current[0].email)
      }else{
        res.redirect('http://localhost:3000/login.html/?auth=0')
      }
      

})
router.get('/logout',async(req,res)=>{
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  })
})

router.post('/createloby',async(req,res)=>{
  console.log(req.body)
  var room={
    userid:current[0].uid,
    roomname:req.body.roomname,
    password:req.body.psw
  }
  rooms.push(room)
  console.log(rooms)
  res.redirect('http://localhost:3000/?usermail='+current[0].email)
})

router.get('',(req,res)=>{
    res.render('index')
})

module.exports={router,logedin,current,rooms}