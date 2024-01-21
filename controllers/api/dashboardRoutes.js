// imports
const router = require("express").Router();
const { Post, User } = require("../../models");
const withAuth = require("../utils/auth");

// READ all posts
router.get("/",withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id:","username"],
        },
      ],
      order:[["createdAt","DESC"]],
    });

    res.status(200).json(postData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

const posts =postData.map((post)=>
post.get({plain:true}));
res.render("dashboard",{
    loggedIn: req.session.loggedIn,
    loggedInUserData: req.session.loggedInUserData,
    posts: posts,
});
// UPDATE Comment


