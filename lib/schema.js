const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const articleSchema = new Schema({
  author: ObjectId,
  member_id: { type: String, required: true },
  classtype_id: {type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
  date: { type: Date, default: Date.now },
});

const articleModel = mongoose.model('articles', articleSchema);

const classtypeSchema = new Schema({
  author: ObjectId,
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const classtypeModel = mongoose.model('classtypes', classtypeSchema);

const memberSchema = new Schema({
  author: ObjectId,
  name: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  intro: { type: String },
  link: { type: String },
  date: { type: Date, default: Date.now },
});

const memberModel = mongoose.model('members', memberSchema);

const commentSchema = new Schema({
  author: ObjectId,
  member_id: { type: String, required: true },
  article_id: { type: String, required: true },
  comment_id: { type: String },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const commentModel = mongoose.model('comments', commentSchema);

module.exports = { articleModel,classtypeModel,memberModel,commentModel }
