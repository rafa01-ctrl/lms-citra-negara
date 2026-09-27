import mongoose,{Schema,models,model} from "mongoose";
const MaterialSchema=new Schema({title:{type:String,required:true},description:String,fileUrl:String,link:String,teacherId:{type:Schema.Types.ObjectId,ref:"User",required:true},subjectId:{type:Schema.Types.ObjectId,ref:"Subject"},classIds:[{type:Schema.Types.ObjectId,ref:"Class"}]},{timestamps:true});
export default models.Material || model("Material",MaterialSchema);
