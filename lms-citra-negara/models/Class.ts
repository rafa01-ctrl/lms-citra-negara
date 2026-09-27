import mongoose,{Schema,models,model} from "mongoose";
const ClassSchema=new Schema({name:{type:String,required:true},level:{type:String},major:{type:String},academicYear:{type:String,default:"2026/2027"},homeroomTeacherId:{type:Schema.Types.ObjectId,ref:"User"}},{timestamps:true});
export default models.Class || model("Class",ClassSchema);
