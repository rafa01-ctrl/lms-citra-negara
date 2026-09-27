import mongoose,{Schema,models,model} from "mongoose";
const GradeSchema=new Schema({studentId:{type:Schema.Types.ObjectId,ref:"User",required:true},subjectId:{type:Schema.Types.ObjectId,ref:"Subject",required:true},classId:{type:Schema.Types.ObjectId,ref:"Class"},assignment:{type:Number,default:0},quiz:{type:Number,default:0},exam:{type:Number,default:0},final:{type:Number,default:0},teacherId:{type:Schema.Types.ObjectId,ref:"User"}},{timestamps:true});
GradeSchema.index({studentId:1,subjectId:1},{unique:true});
export default models.Grade || model("Grade",GradeSchema);
