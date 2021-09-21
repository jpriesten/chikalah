const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postName: {
      required: true,
      type: String,
      trim: true,
    },
    descr: {
      type: String,
      required: true,
      trim: true,
    },
    userSkill: {
      type: String,
      required: true,
      trim: true,
    },
    jobLocation: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    priceRange: {
      required: true,
      type: String,
      trim: true,
    },
    noOfWorkers: {
      type: String,
      trim: true,
    },
    start: {
      type: String,
      trim: true,
    },
    deadline: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now() + 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

// PostSchema.pre("save", function (next) {
//   let Post = this;

//   console.log(Post);
//   return next();
// });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
