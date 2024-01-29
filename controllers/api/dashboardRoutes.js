//imports
const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, Comment, User } = require("../../models");
const withAuth = require("../utils/auth");

// READ all posts in dashboard only if logged in
router.get("/", withAuth, async (req, res) => {
  try {
    const blogPostData = await Comment.findAll({
      where: { user_id: req.session.user_id },
      attributes: ["id", "title", "body"],
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_body", "user_id"],

          include: {
            model: User,
            attributes: ["username"],
          },
        },
        { model: User, attributes: ["username"] },
      ],
    });
    //serialization
    const blogPosts = blogPostData.map((post) => post.get({ plain: true }));
    res.render("dashboard", {
      loggedIn: req.session.loggedIn,
      loggedInUserData: req.session.loggedInUserData,
      posts: blogPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
//routing to edit an existing post
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await Comment.findOne({
      where: { user_id: req.session.user_id },
      attributes: ["id", "title", "body"],
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_body", "user_id"],

          include: {
            model: User,
            attributes: ["username"],
          },
        },
        { model: User, attributes: ["username"] },
      ],
    });
    if (!blogPostData) {
      res.status(404).json({ message: "Unable to locate post with this id" });
      return;
    }
    blogPostData = blogPostData.get({ plain: true });
    res.render("edit-post", {
      loggedIn: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
router.get("/new", (req, res) => {
  res.render("new-post", {
    layout: "dashboard",
  });
});

module.exports = router;
