import mongoose, { Schema, models, model } from "mongoose";
const UserSchema = new Schema({
  name:{type:String,required:true}, email:{type:String,required:true,unique:true,lowercase:true}, password:{type:String,required:true},
  role:{type:String,enum:["admin","guru","siswa","kurikulum","kepsek"],required:true}, classId:{type:Schema.Types.ObjectId,ref:"Class"}, nis:{type:String}, nip:{type:String}, phone:{type:String}, avatar:{type:String}
},{timestamps:true});
export default models.User || model("User",UserSchema);
