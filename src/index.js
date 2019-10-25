const express=require('express')
const bodyParser = require('body-parser')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const {generateMessage , generateLocation}=require('./utils/messages')
const {addUser , removeUser , getUser , getUsersInRoom}=require('./utils/users')
const {activeRooms , deleteRoom,updateRoom}=require('./utils/activerooms');
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port =process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')
var firebase = require("firebase/app")
require("firebase/auth")
require("firebase/firestore")

const firebaseConfig = {
    apiKey: "AIzaSyCvPZB64PAOyL9-FR3A6xva5MWBuq6trTU",
    authDomain: "chat-app-e82a8.firebaseapp.com",
    databaseURL: "https://chat-app-e82a8.firebaseio.com",
    projectId: "chat-app-e82a8",
    storageBucket: "chat-app-e82a8.appspot.com",
    messagingSenderId: "962059879127",
    appId: "1:962059879127:web:7531ddecc5b81cc36a2692",
    measurementId: "G-F92RP78F3K"
  }

firebase.initializeApp(firebaseConfig);

const {router,current,rooms}=require('./routers/router')

//amri plz 
var active=[]

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended:true }))
app.set('view engine','ejs')
app.use(router)

io.on('connection',(socket)=>{
    try {
        console.log('new websocket connection')
        console.log('rooms '+rooms)
        /*console.log(current)
        console.log(logedin)
        //console.log(logedin)*/
        console.log('active '+active)

    socket.emit('update',active)
    
    socket.on('requestrooms',()=>{
    var res=[]
    var inroom=0
    var psw=0
    for(i=0;i<rooms.length;i++){
        if(rooms[i].password=='')
            psw=0
        else
            psw=1
    for (j=0;j<active.length;j++){
        if(rooms[i].roomname==active[j].room){
            inroom=active[j].usersInRoom
            break
        }
        if(inroom==-1)
            inroom=0
    }
        var object={
            uid:rooms[i].uid,
            roomname:rooms[i].roomname,
            psw,
            inroom
        }
        res.push(object)
        object={}
        inroom=0
    }
    socket.emit('response',res)
    })

    socket.on('join',(room,psw)=>{
        
        if(!current[0]){
            console.log('user not loged in')
            socket.emit('NoLogin','Please login before you join a room !')
            return 
        }
        const username=current[0].email
        exists=0
        //console.log(username)
        for(i=0;i<rooms.length;i++){
            if(rooms[i].roomname==room && rooms[i].password==psw)
                exists=1
        }
        if(exists==0){
            socket.emit('problem','please verify room name or the room password!')
            return
        }
       const {error,user}=addUser({ id:socket.id ,username, room})
       
       //console.log(user)
        if (error){
            console.log(error)
            //return callback(error)
            socket.emit('problem',error)
            return 
        }else {
            console.log(user)
        }
        active=updateRoom(room) 
        active=activeRooms(room)
        
        socket.join(user.room)
 
        socket.emit('message',generateMessage('System','Welcome!'))
        
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username+' has joined!'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        //Causes some problems
       // callback()
    })
    
    socket.on('SendMessage',(message,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback('delevried')
    })

    socket.on('SendMessageAndroid',(message)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,message))
    })

    socket.on('sendLocation',(cord,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('LocationMessage',generateLocation(user.username,'http://google.com/maps?q='+cord.latitude+','+cord.longtitude))
        callback('Location shared!')
    })

    socket.on('sendLocationAndroid',(cord)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('LocationMessage',generateLocation(user.username,'http://google.com/maps?q='+cord.latitude+','+cord.longtitude))
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message',generateMessage(user.username+' has left!'))

            const index=active.findIndex((rm)=>user.room=rm.room)
            if(active[index].usersInRoom==1){
                active=deleteRoom(user.room)
            }else{
                active[index].usersInRoom--
            }
            
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })

}
catch(e){
    console.log(e)
    return e
}})
 
server.listen(port,()=>{
    console.log('Server is up and running at '+port)
})


