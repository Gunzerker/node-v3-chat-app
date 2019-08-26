const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const {generateMessage , generateLocation}=require('./utils/messages')
const {addUser , removeUser , getUser , getUsersInRoom}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port =process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('new websocket connection')

    socket.on('join',({username,room},callback)=>{
       const {error,user}=addUser({ id:socket.id , username , room})

        if (error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessage('System','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username+' has joined!'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('SendMessage',(message,callback)=>{
        const user=getUser(socket.id)

        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback('Delivred')
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
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
    
})

server.listen(port,()=>{
    console.log('Server is up and running at '+port)
})
app.get('',(req,res)=>{
    res.render('index')
})