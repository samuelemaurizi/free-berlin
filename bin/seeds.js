const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const User = require('../models/User');

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/starter-code', { useMongoClient: true })
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

// const celebrities = [
//   {
//     category: {      enum: ['Event', 'Culture', 'Sports']
//     },
//     shortdescr: String,
//     longdescr: String,
//     location: String,
//     date: String,
//     image: String
//   },
//   {},
//   {},
//   {}
// ]


/// create is missing