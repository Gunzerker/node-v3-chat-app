const rooms=[]

const activeRooms= (room)=>{
    const add={
        room,
        usersInRoom:1
    }
const index = rooms.findIndex((rm)=>room==rm.room)
if (index==-1){
    rooms.push(add)
}
return rooms
}

const updateRoom=(room)=>{
    const index=rooms.findIndex((rm)=>room=rm.room)
    if(index!=-1){
        rooms[index].usersInRoom++
    }
return rooms
}

const deleteRoom =(room)=>{
    const index=rooms.findIndex((rm)=>room=rm.room)
    rooms.splice(index,1)
    return rooms
}

const generateActiveRooms=(rooms)=>{
    return rooms
}


module.exports={
    activeRooms,
    deleteRoom,
    updateRoom,
    generateActiveRooms
}