import mongoose,{Schema,models,model} from "mongoose";
const SubmissionSchema=new Schema({assignmentId:{type:Schema.Types.ObjectId,ref:"Assignment",required:true},studentId:{type:Schema.Types.ObjectId,ref:"User",required:true},fileUrl:String,answerText:String,score:Number,feedback:String,submittedAt:{type:Date,default:Date.now}},{timestamps:true});
SubmissionSchema.index({assignmentId:1,studentId:1},{unique:true});
export default models.Submission || model("Submission",SubmissionSchema);
