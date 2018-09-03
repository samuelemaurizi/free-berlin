const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const User = require('../models/User');


/*GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
})

/*GET main page for user*/
// router.get('/main', (req, res, next) => {
//   res.render('main');
// })

/*GET list of free resources*/
// router.get('/free-list', (req, res, next) => {
//   res.render('free-list');
// })

// router.get('/profile', (req, res, next) => {
//   res.render('profile');
// })

// router.get('/add', (req, res, next) => {
//   res.render('index');
// })

// router.post('/add', (req, res, next) => {
//   res.render('add-resource');
// })

// router.get('/:id/detail', (req, res, next) => {
//   res.render('detail');
// })

module.exports = router;
