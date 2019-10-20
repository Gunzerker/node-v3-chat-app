const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email not valide')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    tokens:[{
        token:{
            type:String,
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

//hash password before saving
userSchema.pre('save',async function (next){
    const user =this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})


const User = mongoose.model('User',userSchema)
/*const me=new User({
    name:'houssem',
    age:10,
    email:'ssddadf@gmail.com',
    password:'abcdefghijklmnop'
})

me.save().then((result)=>{
    console.log('Success')
}).catch((error)=>{
    console.log(error)
})
*/
module.exports=User