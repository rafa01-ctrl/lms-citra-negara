import mongoose,{Schema,models,model} from "mongoose";
const AnnouncementSchema=new Schema({title:{type:String,required:true},content:{type:String,required:true},authorId:{type:Schema.Types.ObjectId,ref:"User"},targetRoles:[String],classIds:[{type:Schema.Types.ObjectId,ref:"Class"}]},{timestamps:true});
export default models.Announcement || model("Announcement",AnnouncementSchema);
