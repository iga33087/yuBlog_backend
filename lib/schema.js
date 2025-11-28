const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const articleSchema = new Schema({
  author: ObjectId,
  member_id: { type: String, required: true },
  classtype_id: {type: String, required: true },
  tag_id: {type: Array, required: true },
  coverImg: { type: String },
  title: { type: String, required: true },
  content: { type: String },
  viewed: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const articleModel = mongoose.model('articles', articleSchema);

const classtypeSchema = new Schema({
  author: ObjectId,
  title: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

const classtypeModel = mongoose.model('classtypes', classtypeSchema);

const tagSchema = new Schema({
  author: ObjectId,
  title: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

const tagModel = mongoose.model('tags', tagSchema);

const memberSchema = new Schema({
  author: ObjectId,
  name: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  intro: { type: String },
  link: { type: String },
  type: { type: String },
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

const appInfoSchema = new Schema({
  author: ObjectId,
  google_app_id: { type: String },
  google_app_password: { type: String },
  google_app_base_url: { type: String },
  date: { type: Date, default: Date.now },
});

const appInfoModel = mongoose.model('appInfo', appInfoSchema);

module.exports = { articleModel,classtypeModel,tagModel,memberModel,commentModel,appInfoModel }
