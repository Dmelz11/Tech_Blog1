// imports
const router = require("express").Router();
const { Comment } = require("../../models");

// CREATE Comment
router.post("/", async (req, res) => {
  try {
    console.log("Your comment");
    const comment = await Comment.create({
      comment_body: req.body.comment_body,
      blogPost_id: req.body.blogPost_id,
      user_id: req.session.user_id || req.body.user_id,
    });

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// READ all comments
router.get("/", async (req, res) => {
    try {
      const commentData = await Comment.findAll({
        include: [
          {
            model: User,
            attributes: ["id:","username"],
          },
          {
            model: Post,
            attributes: ["id"],
          },
        ],
      });
  
      res.status(200).json(commentData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const updatedComment = await Comment.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
  
      if (!updatedComment[0]) {
        res.status(400).json({ message: "No comment found with that id!" });
        return;
      }
  
      console.log("Comment updated!");
      res.status(200).json(updatedComment);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      const comment = await Comment.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!comment) {
        res.status(404).json({ message: "No comment found with that id!" });
        return;
      }
      res.status(200).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  

  // exports
  module.exports = router;
  