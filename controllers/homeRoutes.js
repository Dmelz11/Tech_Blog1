const router = require('express').Router();
const { Post, User,Comment } = require('../models');

router.get('/', async (req, res) => {
  try {
    
      // get all blogPosts and JOIN with user data and comment data
      const postData = await Post.findAll({
        attributes: ["id", "title", "content","created_at"],
        include: [
          {
            model: Comment ,
            attributes: [
                "name",
                "comment_text",
                "post_id",
                "user_id",
                "created_at",
            ],
            order:[["created_at", "DESC"]],
            include: {
                model: User,
                attributes: ["username"]},
            },
            {
                model:Comment,
                attributes: [
                    "id",
                    "comment_text",
                    "post_id",
                    "user_id",
                    "created_at",
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
        ],
      });
  
      // serialize data so the template can read it
      const posts = postData.map((post) =>
        post.get({ plain: true }));
        res.render("homepage", {
            posts,
            loggedIn: req.session.loggedIn,
        });
     } catch (err) {
        console.log(err);
        res.status(500).json(err);
     }
});


   // login information
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

router.get('/readpost', (req, res) => {
  if (req.session.logout) {
    res.redirect('/');
    return;
  }
  res.render('readpost');
});

router.get('/createpost', (req, res) => {
  if (req.session.logout) {
    res.redirect('/');
    return;
  }
  res.render('createpost');
});
router.get('/dashboard', (req, res) => {
  if (req.session.logout) {
    res.redirect('/');
    return;
  }

  res.render('dashboard');
});

// Get for one post based on id
// If the user is logged in, they can see the post data
router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(
        req.params.id
      );
      const post = postData.get({ plain: true });
      res.json(post)
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  
  // Get for one user based on id
  // If the user is logged in, they can see the post data
  router.get('/user/:id', async (req, res) => {
    try {
  
      const userData = await User.findByPk(
        req.params.id
      );
      const user = userData.get({ plain: true });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
 

router.get('/logout', (req, res) => {
  if (req.session.logout) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});





module.exports = router;