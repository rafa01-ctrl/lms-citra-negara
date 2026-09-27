import mongoose,{Schema,models,model} from "mongoose";
const AssignmentSchema=new Schema({title:{type:String,required:true},description:String,dueDate:Date,teacherId:{type:Schema.Types.ObjectId,ref:"User",required:true},subjectId:{type:Schema.Types.ObjectId,ref:"Subject"},classIds:[{type:Schema.Types.ObjectId,ref:"Class"}],attachmentUrl:String},{timestamps:true});
export default models.Assignment || model("Assignment",AssignmentSchema);
