const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const User = require("../models/User");

/*GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/*GET main page for user*/
// router.get('/main', (req, res, next) => {
//   res.render('main');
// })

/*GET list of free resources*/
router.get("/free-list", (req, res, next) => {
  Resource.find()
    .then(resourcesFromDb => {
      res.render("free-list", {
        resources: resourcesFromDb
      });
    })
    .catch(next);
});

// router.get('/profile', (req, res, next) => {
//   res.render('profile');
// })

router.get("/add", (req, res, next) => {
  res.render("add-resource");
});

router.post("/add", (req, res, next) => {
  console.log("req.body", req.body);
  console.log("req.user", req.user);
  const newResource = new Resource({
    category: req.body.category,
    shortdescr: req.body.shortdescr,
    longdescr: req.body.longdescr,
    location: req.body.location,
    date: req.body.date,
    image: req.body.image
  });
  newResource
    .save()
    .then(resource => {
      console.log("The res was saved!!!");
      res.redirect("/free-list");
    })
    .catch(error => {
      res.render("add-resource"); //vorher /
    });
});

// router.get('/:id/detail', (req, res, next) => {
//   res.render('detail');
// })

module.exports = router;
