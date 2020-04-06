const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  _owner: { type: Schema.Types.ObjectId, ref: 'User' },
  _resource: { type: Schema.Types.ObjectId, ref: 'Resource' }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
