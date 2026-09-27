import mongoose,{Schema,models,model} from "mongoose";
const QuizAttemptSchema=new Schema({quizId:{type:Schema.Types.ObjectId,ref:"Quiz",required:true},studentId:{type:Schema.Types.ObjectId,ref:"User",required:true},answers:[Number],score:{type:Number,default:0},startedAt:{type:Date,default:Date.now},submittedAt:Date},{timestamps:true});
QuizAttemptSchema.index({quizId:1,studentId:1},{unique:true});
export default models.QuizAttempt || model("QuizAttempt",QuizAttemptSchema);
