import mongoose,{Schema,models,model} from "mongoose";
const QuizSchema=new Schema({title:{type:String,required:true},description:String,type:{type:String,enum:["quiz","ujian"],default:"quiz"},teacherId:{type:Schema.Types.ObjectId,ref:"User",required:true},subjectId:{type:Schema.Types.ObjectId,ref:"Subject"},classIds:[{type:Schema.Types.ObjectId,ref:"Class"}],duration:Number,questions:[{question:String,options:[String],answer:Number,points:{type:Number,default:10}}],published:{type:Boolean,default:true}},{timestamps:true});
export default models.Quiz || model("Quiz",QuizSchema);
