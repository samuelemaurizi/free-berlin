const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _author: { type: Schema.Types.ObjectId, ref: 'User' },
  _resource: { type: Schema.Types.ObjectId, ref: 'Resource' },
  text: { type: String, required: true }
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
