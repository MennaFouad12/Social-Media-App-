
import mongoose, { Schema, Types, model } from "mongoose";


const postSchema = new Schema(
  {
content : {
  type: String,
  minLenght: [3, "content must be at least 3 characters"],
  maxLength: [100, "content must be at most 100 characters"],
  trim:true,
  required: function () {
    return this.images?.length?false:true
  },
},
images:[{
  secure_url: String,
  public_id: String
},
],
createdBy:{
  type:Types.ObjectId,
  ref:"User",
  required:[true,"createdBy is required"],
},
deletedBy:{
  type:Types.ObjectId,
  ref:"User",
},
likes:[{
  type:[Types.ObjectId],
  ref:"User",
}
],
isDeleted:{
  type:Boolean,
  default:false
} ,
customId:{
  type:String,
  unique:true
}
  },
  { timestamps: true,toJSON: { virtuals: true } ,toObject: { virtuals: true } }
);
postSchema.query.paginate=async function (page) {
  page=page ?page:1
  const limit = 5;
const skip = limit * (page - 1);
const data=await this.skip(skip).limit(limit);
//cuurent page,total items ,total pages,item per page
const items = await this.model.countDocuments();
const totalPages = Math.ceil(items / limit);
return { data,
   totalItems:items,
    currentPage:Number(page),
    totalPages,
    itemPerPage:data.length,
    nextPage: page < totalPages ? page + 1 : null, 
    prevPage: page > 1 ? page - 1 : null} ;
}
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
})
export const PostModel = mongoose.model.Post || model("Post", postSchema);
