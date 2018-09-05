const express = require("express");
const router = express.Router();
const Resource = require('../models/Resource');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');


/*GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/*GET main page for user*/
router.get('/main', (req, res, next) => {
  res.render('main');
})

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

router.get('/profile', (req, res, next) => {
  User.findById(req.user._id)
    .then(userFromDb => {
      //console.log(userFromDb)
      //userFromDb.populate(_contributions)
      //console.log(userFromDb._contributions)
      Resource.find({ _owner: req.user._id })
        .then(resourcesFromOwner => {
          var resourcesFromOwner = resourcesFromOwner
          // var counterLikes;
          // resourcesFromOwner.forEach(function (resource) {   //lacking then here?
          //   counterLikes += Favorite.find({ _resource: resource._id }).length
          //   console.log("FAVORITEFIND____", Favorite.find({ _resource: resource._id }))
          // })
          let promises = [];
          for (var i = 0; i < resourcesFromOwner.length; i++) {
            promises.push(Favorite.count({ _resource: resourcesFromOwner[i]._id }))
          }
          Promise.all(promises)
            .then(counterLikes => {
              if (counterLikes.length > 0) {
                var counterLikes = counterLikes.reduce(function (total, amount) {
                  return total + amount;
                })
              }
              else {
                var counterLikes = 0;
              }
              //console.log(counterLikes, "counterLikes")
              //console.log("resourcesfrmownerfirst", resourcesFromOwner)
              Favorite.find({ _owner: req.user._id })
                .populate('_resource')
                .then(faved => {
                  //console.log("faved1", faved)
                  //console.log("faved", faved)
                  res.render('profile', {
                    username: userFromDb.username,
                    password: userFromDb.password,
                    favorized: counterLikes,  //userFromDb.favorized,
                    description: userFromDb.description,
                    contributions: userFromDb._contributions,
                    profilepic: userFromDb.profilepic,
                    createdAt: userFromDb.created_at,
                    contributions: resourcesFromOwner,
                    favorites: faved
                  })
                })
            })



        });
      //console.log("contrbutions", userFromDb.contributions)
    })
})

router.get("/add", (req, res, next) => {
  res.render("add-resource");
});

router.post("/add", (req, res, next) => {
  //console.log("req.body", req.body);
  //console.log("req.user", req.user);
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
      Favorite.findOne({ _resource: req.params.id, _owner: req.user._id })
        .then(favedRes => {
          if (!favedRes) {
            var heartIcon = "/images/unlike.png"
          }
          else {
            var heartIcon = "/images/like.png"
          }
          Comment.find({ _resource: req.params.id })
            .populate('_author')
            .then(comments => {
              res.render('detail', {
                category: resourcesFromDb.category,
                shortdescr: resourcesFromDb.shortdescr,
                longdescr: resourcesFromDb.longdescr,
                location: resourcesFromDb.location,
                date: resourcesFromDb.date,
                image: resourcesFromDb.image,
                _id: req.params.id,
                hearticon: heartIcon,
                comments: comments
              })
            });
        })
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

router.get('/editProfile', (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).render('not-found');
      }
      res.render("edit-profile", user)
    })
    .catch(next)
})

router.post('/editProfile', (req, res, next) => {
  const { username, description, profilepic } = req.body;
  User.update({ _id: req.user.id }, { $set: { username, description, profilepic } }, { new: true })
    .then((user) => {
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
  console.log("XXXXXXXXI am here");
  ResourceId = req.params.id;
  UserId = req.user._id;
  const newFavorite = new Favorite({
    _owner: UserId,
    _resource: ResourceId
  })
  Comment.find({ _resource: req.params.id })
    .populate('_author')
    .then(comments => {
      Favorite.find({ _owner: req.user._id, _resource: req.params.id })
        .then(favorited => {
          if (favorited.length > 0) {
            ///dont save in favs
            console.log("LLLLLLLhas already been faved")
            console.log(favorited, "XXXXXXXXXXXXXfavorited")
            Favorite.deleteOne({ _owner: req.user._id, _resource: req.params.id })
              .then(removedFav => {
                Resource.findById(req.params.id)
                  .then(resourcesFromDb => {
                    res.render('detail', {
                      category: resourcesFromDb.category,
                      shortdescr: resourcesFromDb.shortdescr,
                      longdescr: resourcesFromDb.longdescr,
                      location: resourcesFromDb.location,
                      date: resourcesFromDb.date,
                      image: resourcesFromDb.image,
                      _id: req.params.id,
                      color: "background-color:grey",
                      hearticon: "/images/unlike.png",
                      comments: comments
                    });
                  })
              })
          }
          else {
            newFavorite.save()
              .then((fav) => {
                console.log("XXXXXXThe fav was saved!!!", fav);
                Resource.findById(req.params.id)
                  .then(resourcesFromDb => {
                    res.render('detail', {
                      category: resourcesFromDb.category,
                      shortdescr: resourcesFromDb.shortdescr,
                      longdescr: resourcesFromDb.longdescr,
                      location: resourcesFromDb.location,
                      date: resourcesFromDb.date,
                      image: resourcesFromDb.image,
                      _id: req.params.id,
                      color: "color:red",
                      hearticon: "/images/like.png",
                      comments: comments
                    });
                  })
              })
          }
        })
    })
    .catch(next)
});


router.post('/:id/delete', (req, res, next) => {
  Resource.findByIdAndRemove(req.params.id)
    .then(resourcefromDb => {
      Favorite.deleteMany({ _resource: req.params.id })
        .then(deleted => {
          res.redirect('/profile')
        })
    })
    .catch(next)
});

router.post('/favorites/:resourceId/delete', (req, res, next) => {
  console.log("REQPARAMS", req.params)
  Favorite.deleteOne({ _resource: req.params.resourceId, _owner: req.user._id })
    .then(favoritefromDb => {
      res.redirect('/profile')
    })
    .catch(next)
});

router.post('/filter', (req, res, next) => {
  const category = req.body.category;
  Resource.find({ category: category })
    .then(matchingResources => {
      res.render("free-list", {
        resources: matchingResources
      });
    })
    .catch(next);
});

router.post('/:id/comment', (req, res, next) => {
  Resource.findById(req.params.id)
    .then(resourcesFromDb => {
      Favorite.findOne({ _resource: req.params.id, _owner: req.user._id })
        .then(favedRes => {
          if (!favedRes) {
            var heartIcon = "/images/unlike.png"
          }
          else {
            var heartIcon = "/images/like.png"
          }
          const newComment = new Comment({
            text: req.body.comment,
            _author: req.user._id,
            _resource: req.params.id
          })
          newComment.save()
            .then(comment => {
              Comment.find({ _resource: req.params.id })
                .populate('_author')
                .then(comments => {
                  res.render('detail', {
                    category: resourcesFromDb.category,
                    shortdescr: resourcesFromDb.shortdescr,
                    longdescr: resourcesFromDb.longdescr,
                    location: resourcesFromDb.location,
                    date: resourcesFromDb.date,
                    image: resourcesFromDb.image,
                    _id: req.params.id,
                    hearticon: heartIcon,
                    comments: comments
                  });
                })
            })
        });
    })
    .catch(next);
})

// router.get("/favorite/:resourceID/create", (req, res) => {
//   console.log("CREATING A FAVORITE!!!!!!!")
//   res.send("HEY!!!!! CREATING A FAVORITE!!!!!!!")
// })

module.exports = router;
