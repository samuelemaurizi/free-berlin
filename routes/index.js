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
  let filter = {}
  if (req.query.category) {
    filter.category = req.query.category
  }
  Resource.find(filter)
    .then(resourcesFromDb => {
      res.render("free-list", {
        resources: resourcesFromDb
      });
    })
    .catch(next);
});

router.get('/profile', (req, res, next) => {
  Resource.find({ _owner: req.user._id })
    .then(resourcesFromOwner => {
      let promises = [];
      for (var i = 0; i < resourcesFromOwner.length; i++) {
        promises.push(Favorite.count({ _resource: resourcesFromOwner[i]._id }))
      }
      Promise.all(promises)
        .then(favoritesCounts => {
          var counterLikes = favoritesCounts.reduce((total, amount) => total + amount, 0)

          Favorite.find({ _owner: req.user._id })
            .populate('_resource')
            .then(faved => {
              res.render('profile', {
                username: req.user.username,
                password: req.user.password,
                favorized: counterLikes,
                description: req.user.description,
                contributions: req.user._contributions,
                profilepic: req.user.profilepic,
                createdAt: req.user.created_at.toDateString(),
                contributions: resourcesFromOwner,
                favorites: faved
              })
            })
        })

    });
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
      console.log("The res was saved!!!");
      res.redirect('/free-list');
    })
    .catch((error) => {
      res.render('add-resource', { error: 'You must fill all obligatory fields' })//vorher /
    })
})

router.get('/:id/detail', (req, res, next) => {
  Resource.findById(req.params.id)
    .then(resourcesFromDb => {
      Favorite.findOne({ _resource: req.params.id, _owner: req.user && req.user._id })
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
                comments: comments.map(comment => {
                  comment.readableDate = comment.created_at.toDateString();
                  return comment;
                }),
                error: req.flash("error")
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
    .catch((error) => {
      res.render('edit-resource', { error: 'Fields are not supposed to be blank' })//vorher /
    })
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
    .catch((error) => {
      console.log("CATCH!!!!!!!!!!!!!");

      res.render('edit-profile', { error: 'Fields are not supposed to be blank' })//vorher /
    })
});

router.get('/:id/favorize', (req, res, next) => {
  ////
  //res.redirect('/:id/detail')
  console.log("XXXXXXXXI am here");
  let resourceId = req.params.id;
  UserId = req.user._id;
  const newFavorite = new Favorite({
    _owner: UserId,
    _resource: resourceId
  })
  Favorite.find({ _owner: req.user._id, _resource: req.params.id })
    .then(favorited => {
      if (favorited.length > 0) {
        ///dont save in favs
        console.log("LLLLLLLhas already been faved")
        console.log(favorited, "XXXXXXXXXXXXXfavorited")
        Favorite.deleteOne({ _owner: req.user._id, _resource: req.params.id })
          .then(removedFav => {
            res.redirect(`/${resourceId}/detail`)
          })
      }
      else {
        newFavorite.save()
          .then((fav) => {
            console.log("XXXXXXThe fav was saved!!!", fav);
            res.redirect(`/${resourceId}/detail`)
          })
      }
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

router.post('/:id/comment', (req, res, next) => {
  const newComment = new Comment({
    text: req.body.comment,
    _author: req.user._id,
    _resource: req.params.id
  })
  newComment.save()
    .then(comment => {
      res.redirect(`/${req.params.id}/detail`)
    })
    .catch((error) => {
      console.log("req.flash!!!!");

      req.flash("error", "Please write something in the comment field")
      res.redirect(`/${req.params.id}/detail`)
      // res.render('detail', { error: 'Please write something in the comment field' })//vorher /
    })
})

module.exports = router;