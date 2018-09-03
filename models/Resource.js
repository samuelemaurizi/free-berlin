const mongoose = require('mongoose');
const Schema = mongoose.Schema;
///maybe owner inside
const resourceSchema = new Schema({
  category: {
    type: String,
    enum: ['Event', 'Culture', 'Sports']
  },
  shortdescr: String,
  longdescr: String,
  location: String,
  date: Date,
  image: {
    type: String,
    default: '../public/images/free-icon.png'
  }

});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;