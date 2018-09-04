const mongoose = require('mongoose');
const Schema = mongoose.Schema;
///maybe owner inside
const resourceSchema = new Schema({
  category: {
    type: String,
    enum: ['Event', 'Culture', 'Sports', 'Food']
  },
  shortdescr: String,
  longdescr: String,
  location: String,
  date: { type: String, default: "-" },
  image: {
    type: String,
    default: '../public/images/free-icon.png'
  },
  _owner: { type: Schema.ObjectId, ref: "User" }

});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;