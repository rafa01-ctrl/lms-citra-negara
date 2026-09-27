import mongoose,{Schema,models,model} from "mongoose";
const SubjectSchema=new Schema({name:{type:String,required:true},code:String,teacherIds:[{type:Schema.Types.ObjectId,ref:"User"}],classIds:[{type:Schema.Types.ObjectId,ref:"Class"}]},{timestamps:true});
export default models.Subject || model("Subject",SubjectSchema);
