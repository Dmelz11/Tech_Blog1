//Creating home routes for authentication
const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    res.render('homepage')

  } catch (err) {
    console.log(err);
    res.status(500).json("OOPs");
  }
});
router.get("/dashboard", async (req, res) => {
  try {
      // get all blogPosts and JOIN with user data and comment data
      const blogPostData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });
  
      // serialize data so the template can read it
      const blogPosts = blogPostData.map((blogPost) =>
        blogPost.get({ plain: true })
      );
  
      // pass serialized data and session flag into template
      res.render("homepage", {
        blogPosts,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// Get for one post based on id
// If the user is logged in, they can see the post data
router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(
      req.params.id
    );
    const post = dbPostData.get({ plain: true });
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

    const dbUserData = await User.findByPk(
      req.params.id
    );
    const user = dbUserData.get({ plain: true });
    res.json(user);
  } catch (err) {
    console.error(err);
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

router.get('/logout', (req, res) => {
  if (req.session.logout) {
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

module.exports = router;