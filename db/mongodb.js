const mongodb=require('mongodb')

mongodb.connect('mongodb://127.0.0.1:27017',{useNewUrlParser:true},(error,client)=>{
    if(error){
        console.log('Unable to connect to Database')
    }else{
        console.log('Connected to Database')
    }
    const db=client.db('chat-app')
})