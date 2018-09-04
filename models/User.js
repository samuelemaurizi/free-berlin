const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  favorized: { type: Number, default: 0 },
  profilepic: { type: String, default: "/images/profile-picture.png" },
  description: {
    type: String,
    default: "I have not added a description about me yet"
  },
  // _contributions: [{ type: Schema.Types.ObjectId, ref: 'Resource' }]
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
