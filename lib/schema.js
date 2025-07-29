const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const articleSchema = new Schema({
  author: ObjectId,
  classtype_id: {type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
  date: { type: Date, default: Date.now },
});

const articleModel = mongoose.model('articles', articleSchema);

module.exports = { articleModel }
