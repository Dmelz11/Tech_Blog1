// imports
const router = require("express").Router();
const sequelize = require('../config/connection');
const { Post, Comment, User } = require("../../models");
const withAuth = require("../utils/auth");

// READ all posts
router.get("/",withAuth, async (req, res) => {
  try {
    const postData = await Comment.findAll({
        where: {user_id: req.session.user_id},
        attributes: ['id', 'title','body'],
      include: [
        {
          model: Comment,
          attributes: ["id","comment_text","user_id"],

       include: {
         model: User, 
         attributes: ["username"]},
       },
       { model: User,
         attributes:["username"]},
       ],
    });
    const posts =postData.map((post)=>
post.get({plain:true}));
res.render("dashboard",{
    loggedIn: req.session.loggedIn,
    loggedInUserData: req.session.loggedInUserData,
    posts: posts, 
})
} catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
router.get("/edit/:id",withAuth, async (req, res) => {
    try {
      const postData = await Comment.findOne({
          where: {user_id: req.session.user_id},
          attributes: ['id', 'title','body'],
        include: [
          {
            model: Comment,
            attributes: ["id","comment_text","user_id"],
  
         include: {
           model: User, 
           attributes: ["username"]},
         },
         { model: User,
           attributes:["username"]},
         ],
      });
      if(!postData){
        res.status(404).json(err);
        return;
      }
      postDataNew = postData.get({plain: true});
      res.render("edit-post",{
        loggedIn: true,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  router.get("/new",(req, res)=>{
    res.render("new-post",{
        layout: "dashboard",
    });
  });

  module.exports=router;



