const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const {generateMessage , generateLocation}=require('./utils/messages')
const {addUser , removeUser , getUser , getUsersInRoom}=require('./utils/users')
const {activeRooms , deleteRoom,updateRoom,generateActiveRooms}=require('./utils/activerooms')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port =process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')

//amri plz 
var active=[]

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    try {
        console.log('new websocket connection')
        
        console.log(active)

       socket.emit('update',active)
    
    socket.on('join',function (username,room,callback){{
       const {error,user}=addUser({ id:socket.id , username , room})
       

       active=updateRoom(room) 
       active=activeRooms(room)

        if (error){
            console.log(error)
            return callback(error)
            //return (error)
        }else {
            console.log(user)
        }

        socket.join(user.room)
 
        socket.emit('message',generateMessage('System','Welcome!'))
        
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username+' has joined!'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        //Causes some problems
        //callback()
    }})
    
    

    socket.on('SendMessage',(message,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,message))
        //callback('Delivred')
    })

    socket.on('sendLocation',(cord,callback)=>{
        const user=getUser(socket.id)

        io.to(user.room).emit('LocationMessage',generateLocation(user.username,'http://google.com/maps?q='+cord.latitude+','+cord.longtitude))
        callback('Location shared!')
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
app.get('',(req,res)=>{
    res.render('index')
})