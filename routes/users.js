
const mongoose=require('mongoose');
const plm=require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/final-challange")
const userSchema=mongoose.Schema({
  username:String,
  password:String,
  email:String,



  monthlyBudget:{
    type:Number,
    default:0
  }

},{
  timestamps:true
})
userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema)