
// import { ref } from "joi";
import mongoose, { Schema, Types, model } from "mongoose";


const commentSchema = new Schema(
  {
text: {
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
postId:{
  type:Types.ObjectId,
  ref:"Post",
  required:[true,"postid is required"],
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
parentComment:{
type : Types.ObjectId,
ref:"Comment",


}

  },
  { timestamps: true,toJSON: { virtuals: true } ,toObject: { virtuals: true } }
);

commentSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc, next) {
    if (doc.image?.secure_url) {
      await cloudinary.uploader.destroy(doc.image.public_id);
    }

    const replies = await this.constructor.find({ parentComment: doc._id });

    if (replies.length > 0) {
      for (const reply of replies) {
        await reply.deleteOne();
      }
    }

    return next();
  }
);

commentSchema.virtual("replies", {
  ref:"Comment",
  localField:"_id",
  foreignField:"parentComment"})
export const CommentModel = mongoose.model.Post || model("Comment",  commentSchema);
