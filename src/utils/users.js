const users=[]

//addUser,removeUser,getUser,getUsersInRoom

const addUser=({id,username,room})=>{
    //Clean data
    if (!id || !username || !room){
        return {
            error:'Amri stop plz'
        }
    }
    username = username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate data
    if(!username || !room) {
        return {
            error :'User and room are required!'
        }
    }

    //check existing user
    const existingUser = users.find((user)=>{
        return user.room==room && user.username==username
    })

    //validate user name
    if (existingUser) {
        return {
            error :'Username is in use!'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return { user }
}

const removeUser=(id)=>{
    const index = users.findIndex((user)=>user.id==id)

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{ return users.find((user)=>user.id==id)}

const getUsersInRoom=(room)=>{
    const found=[]
    users.find((user)=>{
        if(user.room==room){
            found.push(user)
        }
    })
    return found
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


