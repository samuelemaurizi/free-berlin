const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const User = require('../models/User');
const Favorite = require('../models/Favorite');


/*GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
})

/*GET main page for user*/
router.get('/main', (req, res, next) => {
  res.render('main');
})

/*GET list of free resources*/
router.get('/free-list', (req, res, next) => {
  Resource.find()
    .then(resourcesFromDb => {
      res.render('free-list', {
        "resources": resourcesFromDb
      });
    })
    .catch(next)
})

router.get('/profile', (req, res, next) => {
  User.findById(req.user._id)
    .then(userFromDb => {
      console.log(userFromDb)
      //userFromDb.populate(_contributions)
      //console.log(userFromDb._contributions)
      Resource.find({ _owner: req.user._id })
        .then(resourcesFromOwner => {
          var resourcesFromOwner = resourcesFromOwner
          //console.log("resourcesfrmownerfirst", resourcesFromOwner)
          Favorite.find({ _owner: req.user._id })
            .populate('_resource')
            .then(faved => {
              console.log("faved1", faved)
              // if (faved) {
              //   var favorites = faved;
              // }
              // else {
              //   var favorites = [];
              // }
              //console.log("resourcefromowenr", resourcesFromOwner)
              console.log("faved", faved)
              res.render('profile', {
                username: userFromDb.username,
                password: userFromDb.password,
                //favorized: amountLikes,  //userFromDb.favorized,
                description: userFromDb.description,
                contributions: userFromDb._contributions,
                profilepic: userFromDb.profilepic,
                createdAt: userFromDb.created_at,
                contributions: resourcesFromOwner,
                favorites: faved
              })

            })


        });
      //console.log("contrbutions", userFromDb.contributions)
    })
})

router.get('/add', (req, res, next) => {
  res.render('add-resource');
})

router.post('/add', (req, res, next) => {
  console.log("req.body", req.body);
  console.log("req.user", req.user);
  const newResource = new Resource({
    category: req.body.category,
    shortdescr: req.body.shortdescr,
    longdescr: req.body.longdescr,
    location: req.body.location,
    date: req.body.date,
    image: req.body.image,
    _owner: req.user._id
  })
  newResource.save()
    .then((resource) => {
      // User.findById(req.user._id)
      //   .then(userFromDb => {
      //     //userFromDb.populate('_contributions')
      //     //userFromDb._contributions.push(resource._id)
      //     User.update({ _id: req.user._id }, { $push: { _contributions: resource._id } });
      //     console.log("contributions", userFromDb._contributions)
      //   })
      console.log("The res was saved!!!");
      res.redirect('/free-list');
    })
    .catch((error) => {
      res.render('add-resource')//vorher /
    })
})

router.get('/:id/detail', (req, res, next) => {
  Resource.findById(req.params.id)
    .then(resourcesFromDb => {
      res.render('detail', {
        category: resourcesFromDb.category,
        shortdescr: resourcesFromDb.shortdescr,
        longdescr: resourcesFromDb.longdescr,
        location: resourcesFromDb.location,
        date: resourcesFromDb.date,
        image: resourcesFromDb.image,
        _id: req.params.id
      });
    })
    .catch(next)
})


router.get('/:id/edit', (req, res, next) => {
  let resourceId = req.params.id;
  Resource.findById(resourceId)
    .then(resource => {
      if (!resource) {
        return res.status(404).render('not-found');
      }
      res.render("edit-resource", resource)
    })
    .catch(next)
})

router.post('/:id/edit', (req, res, next) => {
  const { category, shortdescr, longdescr, location, date, image } = req.body;
  let resourceId = req.params.id;
  Resource.update({ _id: resourceId }, { $set: { category, shortdescr, longdescr, location, date, image } }, { new: true })
    .then((resource) => {
      res.redirect('/profile')
    })
    .catch(next)
});

// router.post('/:id/favorize', (req, res, next) => {
//   ////
//   //res.redirect('/:id/detail')
// });

router.get('/:id/favorize', (req, res, next) => {
  ////
  //res.redirect('/:id/detail')
  ResourceId = req.params.id;
  UserId = req.user._id;
  const newFavorite = new Favorite({
    _owner: UserId,
    _resource: ResourceId
  })
  newFavorite.save()
    .then((fav) => {
      console.log("The fav was saved!!!", fav);
      Resource.findById(req.params.id)
        .then(resourcesFromDb => {
          res.render('detail', {
            category: resourcesFromDb.category,
            shortdescr: resourcesFromDb.shortdescr,
            longdescr: resourcesFromDb.longdescr,
            location: resourcesFromDb.location,
            date: resourcesFromDb.date,
            image: resourcesFromDb.image,
            _id: req.params.id
          });
        })
    })
    .catch(next)
});

module.exports = router;
